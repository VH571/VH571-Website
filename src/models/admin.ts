import mongoose, { Model, Schema } from "mongoose";
//simple credentials for admin
export interface Admin {
  _id: string;
  username: string;
  password: string;
}

export const AdminSchema = new Schema<Admin>(
  {
    username: { type: String, required: true},
    password: { type: String, required: true },
  },
  { _id: true }
);

export const AdminModel: Model<Admin> =
  mongoose.models.Resume || mongoose.model<Admin>("Admin", AdminSchema);