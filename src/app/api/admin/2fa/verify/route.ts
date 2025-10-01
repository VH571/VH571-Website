import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import { getAdminModel } from "@/models/admin";
import { decrypt } from "@/lib/crypt";
import { authenticator } from "otplib";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { token } = await req.json().catch(() => ({}));
  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  await connectDB();
  const Admin = getAdminModel();
  const admin = await Admin.findById(session.user.id).lean();
  if (!admin?.twoFA?.secretEnc) {
    return NextResponse.json(
      { error: "No 2FA secret to verify" },
      { status: 400 }
    );
  }
  const secret = await decrypt(admin.twoFA.secretEnc);
  authenticator.options = { window: 1 };
  const ok = authenticator.check(token, secret);
  if (!ok) {
    return NextResponse.json({ error: "Invalid code" }, { status: 400 });
  }
  await Admin.updateOne(
    { _id: admin._id },
    { $set: { "twoFA.enabled": true } }
  );
  return NextResponse.json({ success: true });
}
