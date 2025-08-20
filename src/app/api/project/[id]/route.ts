import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { ProjectModel } from "@/models/project";
import { MongoServerError } from "mongodb";
import mongoose from "mongoose";
//get specific project
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
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
  request: NextRequest,
  { params }: { params: { id: string } }
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
    return NextResponse.json(
      { error: "Failed at updating project" },
      { status: 500 }
    );
  }
}

//delete specific project
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
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
