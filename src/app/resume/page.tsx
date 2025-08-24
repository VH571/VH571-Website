import { Box, VStack } from "@chakra-ui/react";
import { Resume } from "@/models/resume";
import { getDefaultResume } from "@/lib/resumeService";
import {
  EducationSection,
  ExtracurricularSection,
  ExperienceSection,
  VolunteerSection,
  SkillsSection,
  CertificationsSection,
  AwardsSection,
} from "@/components/ResumeSection";
export default async function ResumePage() {
  let defaultResume: Resume | null = null;
  try {
    defaultResume = await getDefaultResume();
  } catch (err) {
    console.log(err);
  }
  console.log(defaultResume);

  if (!defaultResume) {
    return <Box>Failed to load resume</Box>;
  }

  return (
    <Box
      as="article"
      maxW="10xl"
      mx="auto"
      p={6}
      overflowX="auto"
      overflowY="hidden"
      style={{
        height: "100vh",
        columnWidth: "20rem",
        columnGap: "1.5rem",
        columnFill: "auto",
      }}
    >
      <EducationSection education={defaultResume.education ?? []} />
      <ExperienceSection experience={defaultResume.experience ?? []} />
      <ExtracurricularSection
        extracurricular={defaultResume.extracurriculars ?? []}
      />
      <SkillsSection technicalSkills={defaultResume.technicalSkills} />
      <VolunteerSection volunteerWork={defaultResume.volunteerWork} />
      <CertificationsSection certifications={defaultResume.certifications} />
      <AwardsSection awards={defaultResume.awards} />
    </Box>
  );
}
