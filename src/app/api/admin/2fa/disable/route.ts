import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import { getAdminModel } from "@/models/admin";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const Admin = getAdminModel();

  await Admin.updateOne(
    { _id: session.user.id },
    { $set: { "twoFA.enabled": false, "twoFA.secretEnc": "" } }
  );

  return NextResponse.json({ success: true });
}
