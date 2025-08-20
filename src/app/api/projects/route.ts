import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { ProjectModel } from "@/models/project";
//get all projects
export async function GET() {
  await connectDB();
  const projects = await ProjectModel.find({});
  return NextResponse.json(projects);
}

