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
