import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { ResumeModel } from "@/models/resume";
import { ProjectModel } from "@/models/project";

//get defaut resume projects
export async function GET() {
  await connectDB();
  const resume = await ResumeModel.findOne({ isDefault: true })
    .select("projects")
    .populate({
      path: "projects",
      select: "_id name role tech description achievements links screenshots",
    })
    .lean();
  if (!resume) {
    return NextResponse.json(
      { error: "No default resume set" },
      { status: 404 }
    );
  }
  const projects = (resume.projects ?? []) as unknown[];
  return NextResponse.json(projects);
}
//creates new project
export async function POST(request: Request) {
  await connectDB();
  const project = await request.json();
  const newProject = new ProjectModel(project);
  await newProject.save();
  return NextResponse.json({
    message: "Resume created successfully",
    project: newProject,
  });
}
