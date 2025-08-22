import { Resume } from "@/models/resume";
//get default resume
export async function getDefaultResume() {
  const response = await fetch("/api/resume");
  return response.json();
}
  
//get all resumes
export async function getAllResumes() {
  const response = await fetch("/api/resumes");
  return response.json();
}

//get specific resume
export async function getResumeByID(id: string) {
  const response = await fetch("/api/resume/" + { id });
  return response.json();
}

//make new resume
export async function makeNewResume(resume: Resume) {
  const response = await fetch("/api/resume", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(resume),
  });
  return response.json();
}

//edit specific resume
export async function editResumeByID(id: string, resume: Resume) {
  const response = await fetch("/api/resume/" + { id }, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(resume),
  });
  return response.json();
}

//delete specific resume
export async function deleteResumeByID(id: string) {
  const response = await fetch("/api/resume" + { id }, {
    method: "DELETE",
  });
  return response.json();
}
