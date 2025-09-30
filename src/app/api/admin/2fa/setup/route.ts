// app/api/2fa/setup/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import { getAdminModel } from "@/models/admin";
import { encrypt } from "@/lib/crypt";
import { authenticator } from "otplib";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const Admin = getAdminModel();
  const admin = await Admin.findById(session.user.id);
  if (!admin)
    return NextResponse.json({ error: "Admin not found" }, { status: 404 });

  const secret = authenticator.generateSecret();
  const issuer = "VH571 Website";
  const label = `${admin.username}@${issuer}`;
  const otpauth = authenticator.keyuri(label, issuer, secret);

  admin.twoFA = { enabled: false, secretEnc: await encrypt(secret) };
  await admin.save();

  return NextResponse.json({
    otpauth,
    secretBase32: secret,
  });
}
