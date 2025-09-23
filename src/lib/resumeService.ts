import { getBaseUrl } from "./routes";
import { Resume } from "@/models/resume";
const baseUrl = getBaseUrl();
//get default resume
export async function getDefaultResume() {
  const response = await fetch(`${baseUrl}/api/resume`);
  return response.json();
}

//get all resumes
export async function getAllResumes() {
  const response = await fetch(`${baseUrl}/api/resumes`);
  return response.json();
}

//get specific resume
export async function getResumeByID(id: string) {
  const response = await fetch(`${baseUrl}/api/resume/${id}`);
  return response.json();
}

//make new resume
export async function makeNewResume(resume: Resume) {
  const response = await fetch(`${baseUrl}/api/resume`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(resume),
  });
  return response.json();
}

//edit specific resume
export async function editResumeByID(id: string, resume: Resume) {
  const response = await fetch(`${baseUrl}/api/resume/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(resume),
  });
  return response.json();
}

//delete specific resume
export async function deleteResumeByID(id: string) {
  const response = await fetch(`${baseUrl}/api/resume/${id}`, {
    method: "DELETE",
  });
  return response.json();
}

export async function patchResumeField(
  id: string,
  field: string,
  value: unknown
) {
  const response = await fetch(`${baseUrl}/api/resume/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ field, value }),
  });
  return response.json();
}
export async function patchResumePath(
  id: string,
  path: string,
  value: unknown
) {
  const response = await fetch(`${baseUrl}/api/resume/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, value }),
  });
  return response.json();
}

export async function patchResumePartial(
  id: string,
  partial: Record<string, unknown>
) {
  const response = await fetch(`${baseUrl}/api/resume/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(partial),
  });
  return response.json();
}
export async function setResumeDefault(id: string, isDefault: boolean) {
  const res = await fetch(`${baseUrl}/api/resume/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isDefault }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
