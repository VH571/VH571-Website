import { NextResponse } from "next/server";
import { getBucket } from "@/lib/gridfs";
import type { ImageURL } from "@/models/project";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file") as File | null;
  const alt = (form.get("alt") as string) || "";
  const width = form.get("width") ? Number(form.get("width")) : undefined;
  const height = form.get("height") ? Number(form.get("height")) : undefined;

  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${Date.now()}-${file.name || "image"}`;
  const contentType = file.type || "application/octet-stream";

  const bucket = await getBucket();
  const uploadStream = bucket.openUploadStream(filename, { contentType });

  await new Promise<void>((resolve, reject) => {
    uploadStream.on("error", reject);
    uploadStream.on("finish", resolve);
    uploadStream.end(buffer);
  });

  const id = uploadStream.id.toString();

  const image: ImageURL = {
    url: `/api/public/images/${id}`,
    alt: alt || undefined,
    width: width || undefined,
    height: height || undefined,
  };

  return NextResponse.json(image, { status: 201 });
}
