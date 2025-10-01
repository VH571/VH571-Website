import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import mongoose from "mongoose";
import { ResumeModel } from "@/models/resume";
//get all projects of a resume
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid Resume ID" }, { status: 400 });
  }

  const resume = await ResumeModel.findById(id)
    .select("projects")
    .populate({
      path: "projects",
      select: "_id name role tech description achievements links screenshots",
    })
    .lean();
  if (!resume) {
    return NextResponse.json(
      { error: "No resume found by that id" },
      { status: 404 }
    );
  }
  const projects = resume.projects ?? [];
  return NextResponse.json(projects);
}
