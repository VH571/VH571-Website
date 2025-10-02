import { Box, VStack } from "@chakra-ui/react";
import ContactForm from "@/components/ContactForm";
import { DownloadResumeButton } from "@/components/ResumeDowloadButton";
import { Resume } from "@/models/resume";
import { getDefaultResume } from "@/lib/resumeService";

type ResumeResult = Resume | { error: string } | null;
export default async function ContactPage() {
  let defaultResume: ResumeResult = null;
  let error: string | null = null;

  try {
    defaultResume = await getDefaultResume();
  } catch (err) {
    error = `Could not fetch default resume: ${(err as Error).message}`;
    defaultResume = { error };
  }
  return (
    <Box w={"100%"} h={"100%"}>
      <VStack>
        <Box></Box>
        <ContactForm />
        <DownloadResumeButton resume={defaultResume} />
        <Box></Box>
      </VStack>
    </Box>
  );
}
