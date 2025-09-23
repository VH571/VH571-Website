import mongoose, { Schema, Model } from "mongoose";

export interface Link {
  label?: string;
  url: string;
}
//images stores in AWS S3
export interface ImageURL {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface Project {
  _id: string;
  name: string;
  role: string;
  tech?: string[];
  description?: string;
  achievements?: string[];
  links?: Link[];
  screenshots: ImageURL[];
}

export const LinkSchema = new Schema<Link>(
  {
    label: { type: String },
    url: { type: String, required: true },
  },
  { _id: false }
);

export const ImageURLSchema = new Schema<ImageURL>(
  {
    url: { type: String, required: true },
    alt: String,
    width: Number,
    height: Number,
  },
  { _id: true }
);

const ProjectSchema = new Schema<Project>(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    tech: [{ type: String, trim: true }],
    description: { type: String },
    achievements: [{ type: String }],
    links: [LinkSchema],
    screenshots: [ImageURLSchema],
  },
  { timestamps: true, validateBeforeSave: true, strict: "throw" }
);

export const ProjectModel: Model<Project> =
  mongoose.models.Project || mongoose.model<Project>("Project", ProjectSchema);
