import { getProjectByID } from "@/lib/projectService";
import type { Project } from "@/models/project";
import { Box } from "@chakra-ui/react";
import { ProjectSection } from "@/components/ProjectSection";
type ProjectResult = Project | { error: string };

export default async function PortfolioIDPage({
  params,
}: {
  params: { id: string };
}) {
  let project: ProjectResult;
  try {
    project = await getProjectByID(params.id);
  } catch (err) {
    throw new Error(`Could not fetch Project. ${(err as Error).message}`);
  }

  if (!project || "error" in project) {
    throw new Error(project?.error ?? "Project not found.");
  }
  project = project as Project;
  return (
    <Box>
      <ProjectSection p={project} />
    </Box>
  );
}
