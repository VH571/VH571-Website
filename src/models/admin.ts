import { Schema, model, models, type Types, type Model } from "mongoose";

export interface IAdmin {
  _id: Types.ObjectId;
  username: string;
  password: string;
  role: "admin";
  twoFA?: { enabled: boolean; secretEnc: string };
}

const TwoFASchema = new Schema(
  {
    enabled: { type: Boolean, default: false },
    secretEnc: { type: String, default: "" },
  },
  { _id: false }
);

export const AdminSchema = new Schema<IAdmin>(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin"], default: "admin" },
    twoFA: { type: TwoFASchema, default: () => ({}) },
  },
  { _id: true }
);

export function getAdminModel(): Model<IAdmin> {
  return (models.Admin as Model<IAdmin>) || model<IAdmin>("Admin", AdminSchema);
}
