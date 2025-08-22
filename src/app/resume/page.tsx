import { Box } from "@chakra-ui/react";
import {
  Resume,
  Education,
  Extracurricular,
  TechnicalSkills,
  Experience,
  VolunteerWork,
  Certification,
} from "@/models/resume";
import { getDefaultResume } from "@/lib/resumeService";
import ResumeSection from "@/components/ResumeSection";

export default async function ResumePage() {
  try {
    const resume = await getDefaultResume();
  } catch (err) {
    console.log(err);
  }

  return (
    <Box
      h={"100%"}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <ResumeSection />
    </Box>
  );
}
