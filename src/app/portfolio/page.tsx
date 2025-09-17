import { ProjectCarousel } from "@/components/ProjectCarousel";
import { getDefaultProjects } from "@/lib/projectService";
import { Project } from "@/models/project";
import { Center, Box} from "@chakra-ui/react";
type ProjectResult = Project[] | { error: string };

export default async function PortfolioPage() {
  let defaultProjects: ProjectResult;
  try {
    defaultProjects = await getDefaultProjects();
  } catch (err) {
    throw new Error(
      `Could not fetch default Projects. ${(err as Error).message}`
    );
  }
  if (!Array.isArray(defaultProjects)) {
    throw new Error(defaultProjects.error ?? "No default Projects found.");
  }

  return (
    <Box
    as="section"
    maxW="8xl"          
    mx="auto"
    px={{ base: 4, md: 6 }}
    py={{ base: 6, md: 10 }}
  >
      <ProjectCarousel projects={defaultProjects} />
    </Box>
  );
}
