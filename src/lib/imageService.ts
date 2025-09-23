import { getBaseUrl } from "./routes";
import type { ImageURL } from "@/models/project";

const baseUrl = getBaseUrl();

export async function uploadImage(
  file: File,
  opts?: { alt?: string; width?: number; height?: number }
): Promise<ImageURL> {
  const fd = new FormData();
  fd.append("file", file);
  if (opts?.alt) fd.append("alt", opts.alt);
  if (opts?.width) fd.append("width", String(opts.width));
  if (opts?.height) fd.append("height", String(opts.height));

  const res = await fetch(`${baseUrl}/api/images/upload`, {
    method: "POST",
    body: fd,
  });
  if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
  return res.json() as Promise<ImageURL>;
}

export async function deleteImageByUrl(url: string) {
  const id = url.split("/").pop()!;
  const res = await fetch(`${baseUrl}/api/images/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
  return res.json();
}
