import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { ProjectModel } from "@/models/project";
import mongoose from "mongoose";
//get specific project
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
  }
  const project = await ProjectModel.findById(id);
  if (!project) {
    return NextResponse.json({ error: "project not found" }, { status: 404 });
  }
  return NextResponse.json(project);
}

//edit specific project
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
  }
  const project = await request.json();
  try {
    const newproject = await ProjectModel.findByIdAndUpdate(id, {
      $set: project,
    });
    if (!newproject) {
      return NextResponse.json({ error: "project not found" }, { status: 404 });
    }
    return NextResponse.json({
      message: "project updated",
      project: newproject,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed at updating project" },
      { status: 500 }
    );
  }
}

//delete specific project
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
  }
  try {
    const deleted = await ProjectModel.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "project not found" }, { status: 404 });
    }
    return NextResponse.json({
      message: "project deleted",
      id,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params;

  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { error: "Body must be an object" },
      { status: 400 }
    );
  }
  const set: Record<string, unknown> = {};
  const b = body as Record<string, unknown>;

  if (typeof b.path === "string" && "value" in b) {
    set[b.path] = b.value;
  } else if (typeof b.field === "string" && "value" in b) {
    set[b.field] = b.value;
  } else {
    for (const [k, v] of Object.entries(b)) set[k] = v;
  }

  if ("_id" in set) {
    return NextResponse.json({ error: "Cannot update _id" }, { status: 400 });
  }

  try {
    await ProjectModel.findByIdAndUpdate(
      id,
      { $set: set },
      { new: true, runValidators: true, context: "query" }
    );

    const updated = await ProjectModel.findById(id).lean();
    if (!updated) {
      return NextResponse.json({ error: "project not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (err: unknown) {
    return NextResponse.json(
      { error: (err as any)?.message || "Patch failed" },
      { status: 500 }
    );
  }
}
