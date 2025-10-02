// lib/resumeToLatex.ts
import {
  Resume,
  Education,
  Experience,
  Extracurricular,
  Certification,
  Award,
  TechnicalSkills,
} from "@/models/resume";

const esc = (s = "") =>
  s
    .replaceAll("\\", "\\textbackslash{}")
    .replaceAll("{", "\\{")
    .replaceAll("}", "\\}")
    .replaceAll("$", "\\$")
    .replaceAll("#", "\\#")
    .replaceAll("%", "\\%")
    .replaceAll("&", "\\&")
    .replaceAll("_", "\\_")
    .replaceAll("^", "\\^{}")
    .replaceAll("~", "\\~{}");

const link = (url?: string, label?: string) =>
  url ? `\\href{${esc(url)}}{\\underline{${esc(label ?? url)}}}` : "";

function eduBlock(edu: Education[]) {
  return edu
    .map(
      (e) =>
        `\\resumeSubheading{${esc(e.institution)}}{${esc(e.location ?? "")}}{${esc(e.degree)} in ${esc(e.fieldOfStudy)}}{${esc(e.startDate)}${e.endDate ? " -- " + esc(e.endDate) : ""}}`
    )
    .join("\n");
}

function experienceBlock(exps: Experience[]) {
  return exps
    .map((x) => {
      const header = `\\resumeSubheading{${esc(x.company)}}{${esc(x.startDate)}${x.endDate ? " -- " + esc(x.endDate) : " -- Present"}}{${esc(x.role)}}{${esc(x.location ?? "")}}`;
      const items =
        x.achievements?.map((a) => `\\resumeItem{${esc(a)}}`).join("\n") ?? "";
      return `${header}\n\\resumeItemListStart\n${items}\n\\resumeItemListEnd`;
    })
    .join("\n\n");
}

function projectBlock(projects: any[]) {
  return (projects ?? [])
    .map((p) => {
      const title = p?.links?.[0]?.url
        ? `\\textbf{\\href{${esc(p.links[0].url)}}{${esc(p.name)}}}`
        : `\\textbf{${esc(p?.name ?? "Project")}}`;
      const tech = p?.tech?.length
        ? ` $|$ \\emph{${esc(p.tech.join(", "))}}`
        : "";
      const dates = p?.dateRange ? esc(p.dateRange) : "";
      const head = `\\resumeProjectHeading{${title}${tech}}{${dates}}`;
      const items = (
        (p?.achievements ?? p?.description)
          ? [p.description, ...(p?.achievements ?? [])]
          : []
      )
        .filter(Boolean)
        .map((t: string) => `\\resumeItem{${esc(t)}}`)
        .join("\n");
      return `${head}\n\\resumeItemListStart\n${items}\n\\resumeItemListEnd`;
    })
    .join("\n\n");
}

function skillsBlock(sk: TechnicalSkills | undefined) {
  const lines = [
    sk?.languages?.length &&
      `\\textbf{Languages}{: ${esc(sk.languages.join(", "))}} \\\\`,
    sk?.frameworks?.length &&
      `\\textbf{Frameworks}{: ${esc(sk.frameworks.join(", "))}} \\\\`,
    (sk?.tools?.length || sk?.databases?.length) &&
      `\\textbf{Developer Tools}{: ${esc([...(sk?.tools ?? []), ...(sk?.databases ?? [])].join(", "))}} \\\\`,
    sk?.other?.length && `\\textbf{Other}{: ${esc(sk.other.join(", "))}}`,
  ]
    .filter(Boolean)
    .join("\n");

  return `\\begin{itemize}[leftmargin=0.15in, label={}]\n  \\small{\\item{\n${lines}\n  }}\n\\end{itemize}`;
}

function extracurricularBlock(xs: Extracurricular[]) {
  return (xs ?? [])
    .map((x) => {
      const head = `\\resumeProjectHeading{\\textbf{${esc(x.company)}}}{${esc(x.startDate ?? "")}${x.endDate ? " -- " + esc(x.endDate) : ""}}`;
      const items = [
        x.description && `\\resumeItem{${esc(x.description)}}`,
        ...(x.achievements ?? []).map((a) => `\\resumeItem{${esc(a)}}`),
      ]
        .filter(Boolean)
        .join("\n");
      return `${head}\n\\resumeItemListStart\n${items}\n\\resumeItemListEnd`;
    })
    .join("\n\n");
}

function certsBlock(cs: Certification[]) {
  if (!cs?.length) return "\\vspace{-6pt}";
  return (
    `\\begin{itemize}[leftmargin=0.15in, label={}]\n` +
    cs
      .map((c) => {
        const right = esc(c.issueDate ?? "");
        const left =
          `\\textbf{${esc(c.name)}}${c.issuer ? ` — ${esc(c.issuer)}` : ""}` +
          (c.credentialUrl ? ` (${link(c.credentialUrl, "link")})` : "");
        return `  \\item ${left} \\hfill ${right}`;
      })
      .join("\n") +
    `\n\\end{itemize}`
  );
}

function awardsBlock(as: Award[]) {
  if (!as?.length) return "\\vspace{-6pt}";
  return (
    `\\begin{itemize}[leftmargin=0.15in, label={}]\n` +
    as
      .map((a) => {
        const right = esc(a.date ?? "");
        const left = `\\textbf{${esc(a.title)}}${a.organization ? ` — ${esc(a.organization)}` : ""}`;
        const extra = a.summary ? `\\\\ ${esc(a.summary)}` : "";
        return `  \\item ${left} \\hfill ${right}${extra}`;
      })
      .join("\n") +
    `\n\\end{itemize}`
  );
}

export function resumeToLatex(template: string, r: Resume) {
  const contactParts = [
    r.email && link(`mailto:${r.email}`, r.email),
    r.linkedinUrl &&
      link(r.linkedinUrl, r.linkedinUrl.replace(/^https?:\/\//, "")),
    r.githubUrl && link(r.githubUrl, r.githubUrl.replace(/^https?:\/\//, "")),
    r.website && link(r.website, r.website.replace(/^https?:\/\//, "")),
  ].filter(Boolean);
  const CONTACT_LINE = [r.title, ...contactParts].filter(Boolean).join(" $|$ ");

  return template
    .replaceAll("{{NAME}}", esc(r.name))
    .replaceAll("{{CONTACT_LINE}}", CONTACT_LINE || " ")
    .replaceAll("{{EDUCATION_BLOCK}}", eduBlock(r.education ?? []))
    .replaceAll("{{EXPERIENCE_BLOCK}}", experienceBlock(r.experience ?? []))
    .replaceAll("{{PROJECTS_BLOCK}}", projectBlock((r as any).projects ?? []))
    .replaceAll("{{SKILLS_BLOCK}}", skillsBlock(r.technicalSkills))
    .replaceAll(
      "{{EXTRA_BLOCK}}",
      extracurricularBlock(r.extracurriculars ?? [])
    )
    .replaceAll("{{CERTS_BLOCK}}", certsBlock(r.certifications ?? []))
    .replaceAll("{{AWARDS_BLOCK}}", awardsBlock(r.awards ?? []));
}
