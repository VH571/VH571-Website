import { NextResponse } from "next/server";
import { getBucket, getDb } from "@/lib/gridfs";
import { ObjectId } from "mongodb";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  let _id: ObjectId;
  try {
    _id = new ObjectId(id);
  } catch {
    return new NextResponse("Bad id", { status: 400 });
  }

  const db = await getDb();
  const fileDoc = await db.collection("images.files").findOne({ _id });
  if (!fileDoc) return new NextResponse("Not found", { status: 404 });

  const contentType = fileDoc.contentType ?? "application/octet-stream";

  const bucket = await getBucket();
  const stream = bucket.openDownloadStream(_id);

  const body = new ReadableStream({
    start(controller) {
      stream.on("data", (chunk) => controller.enqueue(chunk));
      stream.on("end", () => controller.close());
      stream.on("error", (e) => controller.error(e));
    },
    cancel() {
      stream.destroy();
    },
  });

  return new NextResponse(body, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  let _id: ObjectId;
  try {
    _id = new ObjectId(id);
  } catch {
    return NextResponse.json({ error: "Bad id" }, { status: 400 });
  }

  const bucket = await getBucket();
  try {
    await bucket.delete(_id);
  } catch {}

  return NextResponse.json({ ok: true });
}
