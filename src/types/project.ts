import mongoose, { Document, Schema } from "mongoose";
//images stores in AWS S3
export interface ImageURL extends Document {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
};
const ImageURLSchema = new Schema<ImageURL>({
  url: { type: String, required: true },
  alt: String,
  width: Number,
  height: Number,
});
export interface Project extends Document {
  _id: string;
  name: string;
  role: string;
  tech?: string[];
  description?: string;
  achievements?: string[];
  links?: { label?: string; url: string }[];
  screenshots: ImageURL[];
};
const ProjectSchema = new Schema<Project>({
  name: { type: String, required: true },
  role: { type: String, required: true },
  tech: [String],
  description: String,
  achievements: [String],
  links: [
    {
      label: String,
      url: { type: String, required: true },
    },
  ],
  screenshots: [ImageURLSchema],
});

export const ProjectModel = mongoose.model<Project>("Project", ProjectSchema);
