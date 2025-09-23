import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { ResumeModel } from "@/models/resume";
import mongoose from "mongoose";
import { MongoServerError } from "mongodb";
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

//edit specific resume
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
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
  request: Request,
  { params }: { params: Promise<{ id: string }> }
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
//patch specific section of resume
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params;

  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid resume ID" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const set: Record<string, unknown> = {};
  if (body && typeof body === "object") {
    const b = body as Record<string, unknown>;

    if (typeof b.path === "string" && "value" in b) {
      set[b.path] = b.value;
    } else if (typeof b.field === "string" && "value" in b) {
      set[b.field] = b.value;
    } else {
      Object.entries(b).forEach(([k, v]) => {
        set[k] = v;
      });
    }
  } else {
    return NextResponse.json(
      { error: "Body must be an object" },
      { status: 400 }
    );
  }

  if ("_id" in set) {
    return NextResponse.json({ error: "Cannot update _id" }, { status: 400 });
  }

  const hasIsDefault = Object.prototype.hasOwnProperty.call(set, "isDefault");
  const makeDefault = hasIsDefault ? Boolean(set["isDefault"]) : undefined;
  if (hasIsDefault) delete set["isDefault"];

  try {
    if (hasIsDefault) {
      const session = await mongoose.startSession();
      try {
        await session.withTransaction(async () => {
          if (makeDefault) {
            await ResumeModel.updateMany(
              { _id: { $ne: id }, isDefault: true },
              { $set: { isDefault: false } },
              { session }
            );
            await ResumeModel.findByIdAndUpdate(
              id,
              { $set: { ...set, isDefault: true } },
              { new: true, runValidators: true, context: "query", session }
            );
          } else {
            await ResumeModel.findByIdAndUpdate(
              id,
              { $set: { ...set, isDefault: false } },
              { new: true, runValidators: true, context: "query", session }
            );
          }
        });
      } finally {
        session.endSession();
      }
    } else {
      await ResumeModel.findByIdAndUpdate(
        id,
        { $set: set },
        { new: true, runValidators: true, context: "query" }
      );
    }

    const updated = await ResumeModel.findById(id).lean();
    if (!updated) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (err: unknown) {
    if (err instanceof MongoServerError && err.code === 11000) {
      return NextResponse.json(
        { error: "Only one resume can be set as default" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: (err as any)?.message || "Patch failed" },
      { status: 500 }
    );
  }
}
