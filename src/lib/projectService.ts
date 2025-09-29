import { getBaseUrl } from "./routes";
import { Project } from "@/models/project";
const baseUrl = getBaseUrl();
//get default project
export async function getDefaultProjects(): Promise<Project[]> {
  const response = await fetch(`${baseUrl}/api/project`);
  return response.json();
}

//get resume projects
export async function getResumeProjects(id: string): Promise<Project[]> {
  const response = await fetch(`${baseUrl}/api/projects/${id}`);
  return response.json();
}

//get all projects
export async function getAllProjects() {
  const response = await fetch(`${baseUrl}/api/projects`);
  return response.json();
}

//get specific project
export async function getProjectByID(id: string) {
  const response = await fetch(`${baseUrl}/api/project/${id}`);
  return response.json();
}

//make new project
export async function makeNewproject(
  project: Omit<Project, "_id">
): Promise<Project> {
  const response = await fetch(`${baseUrl}/api/project`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(project),
  });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `HTTP ${response.status}`);
  }
  const data: { message: string; project: Project } = await response.json();
  return data.project;
}

//edit specific project
export async function editProjectByID(id: string, project: Project) {
  const response = await fetch(`${baseUrl}/api/project/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(project),
  });
  return response.json();
}

//delete specific project
export async function deleteProjectByID(id: string) {
  const response = await fetch(`${baseUrl}/api/project/${id}`, {
    method: "DELETE",
  });
  return response.json();
}

export async function patchProjectField(
  id: string,
  field: string,
  value: unknown
) {
  const res = await fetch(`${baseUrl}/api/project/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ field, value }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function patchProjectPath(
  id: string,
  path: string,
  value: unknown
) {
  const res = await fetch(`${baseUrl}/api/project/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, value }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function patchProjectPartial(
  id: string,
  partial: Record<string, unknown>
) {
  const res = await fetch(`${baseUrl}/api/project/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(partial),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
