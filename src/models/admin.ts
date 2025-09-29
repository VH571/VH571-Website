import { Schema, model, models } from "mongoose";
export interface Admin {
  _id: string;
  username: string;
  password: string;
  role: "admin";
  twoFA: { enabled: boolean; secretEnc: string };
}

const TwoFASchema = new Schema(
  {
    enabled: { type: Boolean, default: false },
    secretEnc: { type: String, default: "" },
  },
  { _id: false }
);
export const AdminSchema = new Schema<Admin>(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin"], default: "admin" },
    twoFA: { type: TwoFASchema, default: () => ({}) },
  },
  { _id: true }
);

export const User = models.User || model("User", AdminSchema);
