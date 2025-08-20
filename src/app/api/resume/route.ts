import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { ResumeModel } from "@/models/resume";

//get defaut resume
export async function GET() {
  await connectDB();
  const resume = await ResumeModel.findOne({ isDefault: true }).lean();

  if (!resume) {
    return NextResponse.json(
      { error: "No default resume set" },
      { status: 404 }
    );
  }
  return NextResponse.json(resume);
}

//creates new resume
export async function POST(request: NextRequest) {
  await connectDB();
  const resume = await request.json();
  const newResume = new ResumeModel(resume);
  await newResume.save();
  return NextResponse.json({
    message: "Resume created successfully",
    resume: newResume,
  });
}
