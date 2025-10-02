import { NextRequest } from "next/server";
import { readFile, writeFile, mkdtemp, copyFile, access } from "fs/promises";
import { constants as fsConstants } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { spawn } from "child_process";
import { resumeToLatex } from "@/lib/resumeToLatex";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
const TECTONIC_BIN = process.env.TECTONIC_BIN || "tectonic";

export async function POST(req: NextRequest) {
  try {
    if (req.nextUrl.searchParams.get("health") === "1") {
      return json({
        ok: true,
        runtime: process.release?.name,
        node: process.version,
      });
    }

    const resume = await req.json();

    // --- Template paths (unchanged)
    const templatePath = join(process.cwd(), "src", "templates", "main.tex");
    const glyphPath = join(
      process.cwd(),
      "src",
      "templates",
      "glyphtounicode.tex"
    );
    await assertExists(templatePath, "templates/main.tex not found");
    await assertExists(glyphPath, "templates/glyphtounicode.tex not found");

    const template = await readFile(templatePath, "utf8");
    const tex = resumeToLatex(template, resume);

    // --- Write temp project (unchanged)
    const dir = await mkdtemp(join(tmpdir(), "resume-"));
    const mainPath = join(dir, "main.tex");
    await writeFile(mainPath, tex, "utf8");
    await copyFile(glyphPath, join(dir, "glyphtounicode.tex"));

    // --- Compile with Tectonic, fallback to LaTeX.Online on failure
    try {
      const { code, stdout, stderr } = await runTectonic(mainPath, dir);
      if (code !== 0) {
        // Try fallback on any non-zero exit
        return await compileViaLatexOnline(tex, resume.name || "resume", {
          stdout,
          stderr,
        });
      }
      // Success -> read local PDF
      const pdfBuf = await readFile(join(dir, "main.pdf"));
      return new Response(new Uint8Array(pdfBuf), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${sanitize(resume.name || "resume")}.pdf"`,
        },
      });
    } catch (e: any) {
      // Spawn/ENOENT/etc. -> fallback
      return await compileViaLatexOnline(tex, resume.name || "resume", {
        error: e?.message,
      });
    }
  } catch (err: any) {
    return json(
      {
        error: err?.message ?? "Internal error",
        stack: err?.stack,
        hint: hintFrom(String(err?.message ?? "")),
      },
      500
    );
  }
}

// ---------- helpers (existing ones kept) ----------

function runTectonic(
  texPath: string,
  outDir: string
): Promise<{ code: number; stdout: string; stderr: string }> {
  return new Promise((resolve) => {
    const args = [
      "-X",
      "compile",
      texPath,
      "--outdir",
      outDir,
      "--print", // <-- flag only, no value
    ];
    const p = spawn(TECTONIC_BIN, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    p.stdout.on("data", (d) => (stdout += d.toString()));
    p.stderr.on("data", (d) => (stderr += d.toString()));
    p.on("error", (e) => {
      stderr += "\n" + (e?.message || String(e));
    });
    p.on("close", (code) => {
      resolve({ code: code ?? 1, stdout, stderr });
    });
  });
}

async function compileViaLatexOnline(
  tex: string,
  filename: string,
  debug?: any
) {
  const qs = new URLSearchParams({
    command: "xelatex",
    text: tex,
  });

  const resp = await fetch("https://latexonline.cc/compile?" + qs.toString(), {
    method: "GET",
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    return json(
      {
        error: "Remote compile failed",
        status: resp.status,
        bodyPreview: text.slice(0, 500),
        debug,
      },
      502
    );
  }

  const pdf = await resp.arrayBuffer();
  return new Response(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${sanitize(filename)}.pdf"`,
    },
  });
}


async function assertExists(path: string, msg: string) {
  try {
    await access(path, fsConstants.R_OK);
  } catch {
    throw new Error(msg + " at " + path);
  }
}

function sanitize(s: string) {
  return s.replace(/[^\w.-]+/g, "_");
}
function json(data: any, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function hintFrom(log: string) {
  const l = log.toLowerCase();
  if (l.includes("spawn tectonic") || l.includes("enoent"))
    return "Tectonic not found on PATH. Set TECTONIC_BIN or install it.";
  if (l.includes("edge runtime") || l.includes("webassembly"))
    return 'This route must run on Node. Keep `export const runtime = "nodejs"`.';
  if (l.includes("! latex error") || l.includes("emergency stop"))
    return "Check LaTeX logs for the exact failing line.";
  if (l.includes("fontspec") || l.includes("roboto"))
    return "Template needs fonts; Tectonic usually fetches them. Try again or xelatex.";
  if (l.includes("glyphtounicode"))
    return "Ensure glyphtounicode.tex is copied and \\input{glyphtounicode} is correct.";
  return undefined;
}
