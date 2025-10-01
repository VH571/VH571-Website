import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { getAdminModel } from "@/models/admin";

export async function GET() {
  await connectDB();

  const username = process.env.ADMIN_USERNAME ?? "admin";
  const password = process.env.ADMIN_PASSWORD ?? "12345";

  const passwordHash = await bcrypt.hash(password, 10);

  const Admin = getAdminModel();
  const admin = await Admin.findOne({ username });

  if (admin) {
    return NextResponse.json({ message: "Admin already exists", username });
  }

  await Admin.create({
    username,
    password: passwordHash,
    role: "admin",
  });

  return NextResponse.json({
    message: "Admin created",
    username,
    password,
  });
}
