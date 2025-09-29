import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { ResumeModel } from "@/models/resume";
import mongoose from "mongoose";

//get specific resume
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid resume ID" }, { status: 400 });
  }
  const resume = await ResumeModel.findById(id);
  if (!resume) {
    return NextResponse.json({ error: "Resume not found" }, { status: 404 });
  }
  return NextResponse.json(resume);
}
