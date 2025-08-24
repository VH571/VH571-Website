import mongoose, { Model, Schema, Types } from "mongoose";
import { ImageURL, Link, ImageURLSchema, LinkSchema } from "./project";

export interface Resume {
  _id: string;
  name: string;
  title: string;
  headshot: ImageURL;
  email: string;
  githubUrl?: string;
  linkedinUrl?: string;
  website?: string;
  summary?: string;
  education?: Education[];
  extracurriculars?: Extracurricular[];
  technicalSkills?: TechnicalSkills;
  projects?: Types.ObjectId[];
  experience?: Experience[];
  volunteerWork?: VolunteerWork[];
  certifications?: Certification[];
  awards?: Award[];
  isDefault: boolean;
}

export type Section =
  | Education
  | Extracurricular
  | TechnicalSkills
  | Experience
  | VolunteerWork
  | Certification
  | Award;

export type Education = {
  _id?: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  location?: string;
};

export type Extracurricular = {
  _id?: string;
  company: string;
  role: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  achievements?: string[];
};

export type TechnicalSkills = {
  _id?: string;
  languages?: string[];
  frameworks?: string[];
  databases?: string[];
  tools?: string[];
  other?: string[];
};

export type Experience = {
  _id?: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  location?: string;
  achievements: string[];
  tech?: string[];
  links?: Link[];
};

export type VolunteerWork = {
  _id?: string;
  organization: string;
  role: string;
  startDate: string;
  endDate?: string;
  location?: string;
  links?: Link[];
};

export type Certification = {
  _id?: string;
  name: string;
  issuer: string;
  issueDate: string;
  credentialId?: string;
  credentialUrl?: string;
  summary?: string;
  links?: Link[];
};

export type Award = {
  _id?: string;
  title: string;
  organization?: string;
  date: string;
  summary?: string;
  links?: Link[];
};

const EducationSchema = new Schema<Education>(
  {
    institution: { type: String, required: true, trim: true },
    degree: { type: String, required: true, trim: true },
    fieldOfStudy: { type: String, required: true, trim: true },
    startDate: { type: String, required: true },
    endDate: { type: String },
    location: { type: String },
  },
  { _id: true }
);

const ExtracurricularSchema = new Schema<Extracurricular>(
  {
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    description: { type: String },
    startDate: { type: String },
    endDate: { type: String },
    achievements: [{ type: String }],
  },
  { _id: true }
);

const TechnicalSkillsSchema = new Schema<TechnicalSkills>(
  {
    languages: [{ type: String, trim: true }],
    frameworks: [{ type: String, trim: true }],
    databases: [{ type: String, trim: true }],
    tools: [{ type: String, trim: true }],
    other: [{ type: String, trim: true }],
  },
  { _id: false }
);

const ExperienceSchema = new Schema<Experience>(
  {
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    startDate: { type: String, required: true },
    endDate: { type: String },
    location: { type: String },
    achievements: [{ type: String, required: true }],
    tech: [{ type: String, trim: true }],
    links: [LinkSchema],
  },
  { _id: true }
);

const VolunteerWorkSchema = new Schema<VolunteerWork>(
  {
    organization: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    startDate: { type: String, required: true },
    endDate: { type: String },
    location: { type: String },
    links: [LinkSchema],
  },
  { _id: true }
);

const CertificationSchema = new Schema<Certification>(
  {
    name: { type: String, required: true, trim: true },
    issuer: { type: String, required: true, trim: true },
    issueDate: { type: String, required: true },
    credentialId: { type: String },
    credentialUrl: { type: String },
    summary: { type: String },
    links: [LinkSchema],
  },
  { _id: true }
);

const AwardSchema = new Schema<Award>(
  {
    title: { type: String, required: true, trim: true },
    organization: { type: String, trim: true },
    date: { type: String, required: true },
    summary: { type: String },
    links: [LinkSchema],
  },
  { _id: true }
);

const ResumeSchema = new Schema<Resume>(
  {
    name: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    headshot: { type: ImageURLSchema, required: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    githubUrl: { type: String },
    linkedinUrl: { type: String },
    website: { type: String },
    summary: { type: String },
    education: [EducationSchema],
    extracurriculars: [ExtracurricularSchema],
    technicalSkills: TechnicalSkillsSchema,
    projects: [{ type: Schema.Types.ObjectId, ref: "Project" }],
    experience: [ExperienceSchema],
    volunteerWork: [VolunteerWorkSchema],
    certifications: [CertificationSchema],
    awards: [AwardSchema],
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true, validateBeforeSave: true, strict: "throw" }
);

ResumeSchema.index(
  { isDefault: 1 },
  { unique: true, partialFilterExpression: { isDefault: true } }
);
export const ResumeModel: Model<Resume> =
  mongoose.models.Resume || mongoose.model<Resume>("Resume", ResumeSchema);
