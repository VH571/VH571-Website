import { ProjectCarousel } from "@/components/ProjectSection";
import { getDefaultProjects } from "@/lib/projectService";
import { Project } from "@/models/project";
import { Box, Text, VStack, Heading } from "@chakra-ui/react";

type ProjectResult = Project[] | { error: string };

export default async function PortfolioPage() {
  let defaultProjects: ProjectResult;
  let error: string | null = null;

  try {
    defaultProjects = await getDefaultProjects();
  } catch (err) {
    error = `Could not fetch default projects: ${(err as Error).message}`;
    defaultProjects = { error };
  }

  if (!Array.isArray(defaultProjects)) {
    const errorMessage =
      "error" in defaultProjects
        ? defaultProjects.error
        : "No default projects found";

    return (
      <Box
        as="section"
        maxW={{ sm: "sm", md: "3xl", xl: "7xl" }}
        h={"auto"}
        mx="auto"
        display={"flex"}
        alignItems={"center"}
        px={{ base: 4, md: 6 }}
        py={{ base: 6, md: 10 }}
      >
        <VStack gap={4} textAlign="center" py={12} w="full">
          <Heading size="lg">Projects Not Available</Heading>
          <Text fontSize="lg">
            We are having trouble loading the portfolio projects right now.
          </Text>
          <Text fontSize="sm">Please try again later or check back soon.</Text>
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
    <Box
      as="section"
      maxW={{ sm: "sm", md: "3xl", xl: "7xl" }}
      h={"auto"}
      mx="auto"
      display={"flex"}
      alignItems={"center"}
      px={{ base: 4, md: 6 }}
      py={{ base: 6, md: 10 }}
    >
      <ProjectCarousel projects={defaultProjects} />
    </Box>
  );
}
