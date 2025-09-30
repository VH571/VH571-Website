import NextAuth, { User, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import { ZodError } from "zod";
import { signInSchema } from "./lib/zod";
import { connectDB } from "./lib/db";
import { getAdminModel } from "./models/admin";
import { decrypt } from "./lib/crypt";
import bcrypt from "bcryptjs";
import { authenticator } from "otplib";
import jwt from "jsonwebtoken";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      role: "admin";
      twoFAEnabled?: boolean;
    };
  }

  interface User {
    id: string;
    username: string;
    role: "admin";
    twoFAEnabled?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "admin";
    twoFAEnabled?: boolean;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        totp: { label: "Two-Factor Code", type: "text" },
        ticket: { label: "Ticket", type: "text" },
      },
      authorize: async (credentials) => {
        try {
          const { username, password, totp, ticket } =
            await signInSchema.parseAsync(credentials as any);

          if (
            process.env.ADMIN_USERNAME &&
            username !== process.env.ADMIN_USERNAME
          ) {
            return null;
          }

          await connectDB();
          const Admin = getAdminModel();
          const admin = await Admin.findOne({ username }).lean();
          if (!admin) return null;

          if (admin.twoFA?.enabled) {
            if (!ticket) return null;
            try {
              const decoded = jwt.verify(ticket, process.env.AUTH_SECRET!) as {
                u: string;
              };
              if (decoded.u !== username) return null;
            } catch {
              return null;
            }

            if (!totp) {
              return null;
            }
            const secret = await decrypt(admin.twoFA.secretEnc);
            const okTotp = authenticator.check(totp, secret);
            if (!okTotp) return null;

            return {
              id: String(admin._id),
              username: admin.username,
              role: "admin" as const,
              twoFAEnabled: true,
            };
          }

          const okPass = await bcrypt.compare(password, admin.password);
          if (!okPass) return null;

          return {
            id: String(admin._id),
            username: admin.username,
            role: "admin" as const,
            twoFAEnabled: false,
          };
        } catch (error) {
          if (error instanceof ZodError) return null;
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }: { token: JWT; user: User | null }) => {
      if (user) {
        token.role = user.role;
        token.twoFAEnabled = user.twoFAEnabled;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = (token.role as any) || "admin";
        try {
          await connectDB();
          const Admin = getAdminModel();
          const admin = await Admin.findById(session.user.id, {
            "twoFA.enabled": 1,
          }).lean();
          session.user.twoFAEnabled = !!admin?.twoFA?.enabled;
        } catch {
          session.user.twoFAEnabled = !!token.twoFAEnabled;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
