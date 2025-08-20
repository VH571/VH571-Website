import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Resume, ResumeModel } from "@/models/resume";
import mongoose from "mongoose";
import { MongoServerError } from "mongodb";
//get specific resume
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
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

//edit specific resume
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid resume ID" }, { status: 400 });
  }
  const resume = await request.json();
  try {
    const newResume = await ResumeModel.findByIdAndUpdate(id, { $set: resume });
    if (!newResume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Resume updated", resume: newResume });
  } catch (err: unknown) {
    if (err instanceof MongoServerError && err.code === 11000)
      return NextResponse.json(
        { error: "Only one resume can be set as default" },
        { status: 409 }
      );
    return NextResponse.json(
      { error: "Failed at updating resume" },
      { status: 500 }
    );
  }
}

//delete specific resume
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid resume ID" }, { status: 400 });
  }
  try {
    const deleted = await ResumeModel.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }
    if (deleted.isDefault) {
      await ResumeModel.findOneAndUpdate(
        {},
        { $set: { isDefault: true } },
        { sort: { updatedAt: -1 } }
      );
    }

    return NextResponse.json({
      message: "Resume deleted",
      id,
      wasDefault: deleted.isDefault === true,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete resume" },
      { status: 500 }
    );
  }
}
