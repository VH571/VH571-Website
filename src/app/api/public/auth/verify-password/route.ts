export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAdminModel } from "@/models/admin";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

function makeTicket(username: string) {
  const secret = process.env.AUTH_SECRET!;
  return jwt.sign({ u: username }, secret, { expiresIn: "5m" });
}

export async function POST(req: Request) {
  try {
    const { username, password } = (await req.json()) as {
      username?: string;
      password?: string;
    };
    if (!username || !password) {
      return NextResponse.json(
        { error: "Missing credentials" },
        { status: 400 }
      );
    }

    await connectDB();
    const Admin = getAdminModel();
    const admin = await Admin.findOne({ username }).lean();

    if (!admin) return NextResponse.json({ ok: false }, { status: 401 });

    const ok = await bcrypt.compare(password, admin.password);
    if (!ok) return NextResponse.json({ ok: false }, { status: 401 });

    if (admin.twoFA?.enabled) {
      const ticket = makeTicket(username);
      return NextResponse.json({ ok: true, needsTotp: true, ticket });
    }
    return NextResponse.json({ ok: true, needsTotp: false });
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
