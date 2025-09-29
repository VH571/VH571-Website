import { getProjectByID } from "@/lib/projectService";
import type { Project } from "@/models/project";
import { Box, Text, VStack, Heading } from "@chakra-ui/react";
import { ProjectSection } from "@/components/ProjectSection";

type ProjectResult = Project | { error: string };

export default async function PortfolioIDPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let project: ProjectResult;
  let error: string | null = null;

  try {
    project = await getProjectByID(id);
  } catch (err) {
    error = `Could not fetch project: ${(err as Error).message}`;
    project = { error };
  }

  if (!project || "error" in project) {
    const errorMessage = project?.error ?? "Project not found";

    return (
      <Box maxW="920px" mx="auto" px={"24px"} py={"8px"}>
        <VStack gap={4} textAlign="center" py={12}>
          <Heading size="lg">Project Not Available</Heading>
          <Text fontSize="lg">
            The project you looking for is currently not available.
          </Text>
          <Text fontSize="sm">Project ID: {id}</Text>
          {process.env.NODE_ENV === "development" && (
            <Text color="red.400" fontSize="xs" mt={4}>
              Debug: {errorMessage}
            </Text>
          )}
        </VStack>
      </Box>
    );
  }

  return (
    <Box maxW="920px" mx="auto" px={"24px"} py={"8px"}>
      <ProjectSection
        project={project as Project}
        mode="view"
        canEdit={false}
      />
    </Box>
  );
}
