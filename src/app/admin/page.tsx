import { LuFileUser, LuFileCode } from "react-icons/lu";
import { ResumeTab, ProjectTab } from "@/components/AdminTabs";
import { getAllResumes } from "@/lib/resumeService";
import { getAllProjects } from "@/lib/projectService";
import { Tabs } from "@chakra-ui/react";
import { Resume } from "@/models/resume";
import { Project } from "@/models/project";

type ResumesLst = Resume[] | { error: string } | null;
type ProjectLst = Project[] | { error: string } | null;

export default async function Admin() {
  let resumeList: ResumesLst = null;
  let projectList: ProjectLst = null;

  try {
    resumeList = await getAllResumes();
    projectList = await getAllProjects();
  } catch (err) {
    throw new Error(`Could not fetch resumes or projects. ${err}`);
  }

  if (!resumeList || "error" in resumeList) {
    throw new Error(resumeList?.error ?? "No resumes found.");
  }
  if (!projectList || "error" in projectList) {
    throw new Error(projectList?.error ?? "No projects found.");
  }
  return (
    <Tabs.Root
      defaultValue="resumes"
      variant="line"
      size="lg"
      colorPalette="brand"
      padding={"20px"}
      justify={"center"}
      minW={"350px"}
      position="relative"
    >
      <Tabs.List>
        <Tabs.Trigger value="resumes" fontWeight={"bold"} fontSize="2rem">
          <LuFileUser />
          RESUME
        </Tabs.Trigger>
        <Tabs.Trigger value="projects" fontWeight={"bold"} fontSize="2rem">
          <LuFileCode />
          PROJECTS
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="resumes">
        <ResumeTab resumeList={resumeList} />
      </Tabs.Content>
      <Tabs.Content value="projects">
        <ProjectTab projectList={projectList} />
      </Tabs.Content>
    </Tabs.Root>
  );
}
