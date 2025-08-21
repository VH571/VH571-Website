import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { ResumeModel } from "@/models/resume";

//get all resumes
export async function GET() {
  await connectDB();
  const resumes = await ResumeModel.find({});
  return NextResponse.json(resumes);
}
