import { z } from "zod";

export const signInSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Username is required" })
    .min(3, { message: "Username must be at least 3 characters" })
    .max(50, { message: "Username must be less than 50 characters" })
    .trim()
    .transform((s) => s.toLowerCase()),

  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" })
    .max(100, { message: "Password must be less than 100 characters" }),

  totp: z.preprocess(
    (v) => (v === "" ? undefined : v),
    z
      .string()
      .length(6, { message: "TOTP must be exactly 6 digits" })
      .regex(/^\d{6}$/, { message: "TOTP must contain only numbers" })
      .optional()
  ),

  ticket: z.string().optional(),
});
