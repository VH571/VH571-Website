import { Center, VStack, Text} from "@chakra-ui/react";
import { getAllProjects } from "@/lib/projectService";
import { Project } from "@/models/project";
type ProjectLst = Project | { error: string } | null;

export default async function Admin() {
    let defaultResume: ProjectLst = null;
      try {
        defaultResume = await getAllProjects();
      } catch (err) {
        throw new Error(`Could not fetch resumes. ${err}`);
      }
    
      if (!defaultResume || "error" in defaultResume) {
        throw new Error(defaultResume?.error ?? "No resumes found.");
      }
  return (
    <Center h="100%" w="100%">
      hello
    </Center>
  );
}
