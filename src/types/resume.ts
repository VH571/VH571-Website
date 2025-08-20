import { ImageURL, Project } from "./project";

export type Resume = {
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
  projects?: Project[];
  experience?: Experience[];
  volunteerWork?: VolunteerWork[];
  certifications?: Certification[];
  awards?: Award[];
};

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
  links?: { label?: string; url: string }[];
};

export type VolunteerWork = {
  _id?: string;
  organization: string;
  role: string;
  startDate: string;
  endDate?: string;
  location?: string;
  links?: { label?: string; url: string }[];
};

export type Certification = {
  _id?: string;
  name: string;
  issuer: string;
  issueDate: string;
  credentialId?: string;
  credentialUrl?: string;
  summary?: string;
  links?: { label?: string; url: string }[];
};

export type Award = {
  _id?: string;
  title: string;
  organization?: string;
  date: string;
  summary?: string;
  links?: { label?: string; url: string }[];
};
