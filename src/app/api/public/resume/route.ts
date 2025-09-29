import { NextResponse } from "next/server";
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
