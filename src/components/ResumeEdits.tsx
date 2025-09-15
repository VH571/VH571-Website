import { Center, VStack, Text, Drawer, Editable, Separator} from "@chakra-ui/react";
import { getAllResumes } from "@/lib/resumeService";
import { Resume } from "@/models/resume";
type ResumesLst = Resume | { error: string } | null;

//simple form component for each resume
export default async function ResumeForm() {
    let defaultResume: ResumesLst = null;
      try {
        defaultResume = await getAllResumes();
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
