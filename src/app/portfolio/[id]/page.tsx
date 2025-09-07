import PortfolioGrid from "@/components/PortfolioGrid";
import { getDefaultProjects } from "@/lib/projectService";
import { Project } from "@/models/project";
import { Box } from "@chakra-ui/react";
type ProjectResult = Project[] | { error: string };

export default async function PortfolioPage() {
  let defaultProjects: ProjectResult;
  try {
    defaultProjects = await getDefaultProjects();
  } catch (err) {
    throw new Error(`Could not fetch default Projects. ${(err as Error).message}`);
  }
  if (!Array.isArray(defaultProjects)) {
    throw new Error(defaultProjects.error ?? "No default Projects found.");
  }
  return (
  <Box>

  </Box>);
}