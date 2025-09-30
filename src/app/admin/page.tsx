import { LuFileUser, LuFileCode } from "react-icons/lu";
import { ResumeTab, ProjectTab } from "@/components/AdminTabs";
import { getAllResumes } from "@/lib/resumeService";
import { getAllProjects } from "@/lib/projectService";
import { Tabs, Box, VStack, Text, Heading, Alert } from "@chakra-ui/react";
import { Resume } from "@/models/resume";
import { Project } from "@/models/project";

type ResumesLst = Resume[] | { error: string } | null;
type ProjectLst = Project[] | { error: string } | null;
import { SignOutButton } from "@/components/SignOutButton";
export default async function Admin() {
  let resumeList: ResumesLst = null;
  let projectList: ProjectLst = null;
  let resumeError: string | null = null;
  let projectError: string | null = null;
  try {
    resumeList = await getAllResumes();
  } catch (err) {
    resumeError = `Could not fetch resumes: ${(err as Error).message}`;
    resumeList = { error: resumeError };
  }
  try {
    projectList = await getAllProjects();
  } catch (err) {
    projectError = `Could not fetch projects: ${(err as Error).message}`;
    projectList = { error: projectError };
  }

  if (!resumeList || "error" in resumeList) {
    const errorMsg = resumeList?.error ?? "No resumes found";
    resumeError = errorMsg;
    resumeList = [];
  }

  if (!projectList || "error" in projectList) {
    const errorMsg = projectList?.error ?? "No projects found";
    projectError = errorMsg;
    projectList = [];
  }

  return (
    <Box>
      <SignOutButton />
      <Tabs.Root
        defaultValue="resumes"
        variant="line"
        size="lg"
        colorPalette="brand"
        padding={"20px"}
        justify={"center"}
        maxW={"1900px"}
        maxH={"919px"}
        minW={"350px"}
      >
        <Tabs.List fontSize={{ xl: "4xl", md: "xl" }}>
          <Tabs.Trigger
            value="resumes"
            fontWeight={"bold"}
            fontSize={{ xl: "4xl", md: "xl" }}
          >
            <LuFileUser />
            RESUME
          </Tabs.Trigger>
          <Tabs.Trigger
            value="projects"
            fontWeight={"bold"}
            fontSize={{ xl: "4xl", md: "xl" }}
          >
            <LuFileCode />
            PROJECTS
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="resumes">
          {resumeError ? (
            <Box p={6}>
              <Alert.Root status="warning" mb={4}>
                <Alert.Indicator />
                <Alert.Title>Unable to Load Resumes</Alert.Title>
                <Alert.Description>{resumeError}</Alert.Description>
              </Alert.Root>
              <VStack gap={4} textAlign="center" py={8}>
                <Heading size="md">No Resumes Available</Heading>
                <Text fontSize="md">
                  There was an error loading resumes. You can try refreshing the
                  page or check back later.
                </Text>
                {process.env.NODE_ENV === "development" && (
                  <Text color="red.400" fontSize="xs" mt={4}>
                    Debug: {resumeError}
                  </Text>
                )}
              </VStack>
            </Box>
          ) : (
            <ResumeTab resumeList={resumeList as Resume[]} />
          )}
        </Tabs.Content>

        <Tabs.Content value="projects">
          {projectError ? (
            <Box p={6}>
              <Alert.Root status="warning" mb={4}>
                <Alert.Indicator />
                <Alert.Title>Unable to Load Projects</Alert.Title>
                <Alert.Description>{projectError}</Alert.Description>
              </Alert.Root>
              <VStack gap={4} textAlign="center" py={8}>
                <Heading size="md">No Projects Available</Heading>
                <Text fontSize="md">
                  There was an error loading projects. You can try refreshing
                  the page or check back later.
                </Text>
                {process.env.NODE_ENV === "development" && (
                  <Text color="red.400" fontSize="xs" mt={4}>
                    Debug: {projectError}
                  </Text>
                )}
              </VStack>
            </Box>
          ) : (
            <ProjectTab projectList={projectList as Project[]} />
          )}
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
}
