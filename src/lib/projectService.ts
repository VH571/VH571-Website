import { getBaseUrl } from "./routes";
import { Project } from "@/models/project";
const baseUrl = getBaseUrl();

//get default project
export async function getDefaultProject() {
  const response = await fetch(`${baseUrl}/api/project`);
  return response.json();
}

//get all projects
export async function getAllProjects() {
  const response = await fetch(`${baseUrl}/api/project`);
  return response.json();
}

//get specific project
export async function getProjectByID(id: string) {
  const response = await fetch(`${baseUrl}/api/project/${id}`);
  return response.json();
}

//make new project
export async function makeNewproject(project: Project) {
  const response = await fetch(`${baseUrl}/api/project`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(project),
  });
  return response.json();
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
