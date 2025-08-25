import { Box, HStack, VStack, Text, Image, Link } from "@chakra-ui/react";
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
type ResumeResult = Resume | { error: string } | null;
import { SiGithub, SiLinkedin } from "react-icons/si";
import { IoIosMail, IoIosGlobe } from "react-icons/io";
export default async function ResumePage() {
  let defaultResume: ResumeResult = null;
  try {
    defaultResume = await getDefaultResume();
  } catch (err) {
    throw new Error("Could not fetch default resume.");
  }

  if (!defaultResume || "error" in defaultResume) {
    throw new Error(defaultResume?.error ?? "No default resume found.");
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
      <Box as="section" mb={10} w="100%" textAlign="center">
        <VStack gap={2} align="center">
          <Image
            src={defaultResume.headshot?.url}
            alt={
              defaultResume.headshot?.alt ??
              `${defaultResume.name} profile picture`
            }
            objectFit="cover"
          />

          <Text fontSize="5xl" fontWeight="bold" lineHeight="1">
            {defaultResume.name}
          </Text>

          <Text
            fontSize="md"
            fontWeight="semibold"
            color="var(--color-accent-alt)"
          >
            {defaultResume.title}
          </Text>

          <HStack gap={2}>
            <IoIosMail size="1.2rem" aria-hidden />
            <Link
              href={`mailto:${defaultResume.email}`}
              fontSize="sm"
              fontWeight="semibold"
              _hover={{ textDecoration: "underline" }}
              aria-label={`Email ${defaultResume.email}`}
              color="inherit"
            >
              {defaultResume.email}
            </Link>
          </HStack>

          <HStack gap={4}>
            {defaultResume.githubUrl && (
              <Link
                href={defaultResume.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                color="var(--color-accent-alt)"
              >
                <SiGithub size="1.5rem" />
              </Link>
            )}
            {defaultResume.linkedinUrl && (
              <Link
                href={defaultResume.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                color="var(--color-accent-alt)"
              >
                <SiLinkedin size="1.5rem" />
              </Link>
            )}
            {defaultResume.website && (
              <Link
                href={defaultResume.website}
                target="_blank"
                rel="noopener noreferrer"
                fontSize="sm"
                fontWeight="semibold"
                textDecoration="underline"
                color="var(--color-accent-alt)"
              >
                <IoIosGlobe size="1.5rem" />
              </Link>
            )}
          </HStack>

          {defaultResume.summary ? (
            <Text mt={2} fontSize="sm" maxW="600px" textAlign="center">
              {defaultResume.summary}
            </Text>
          ) : null}
        </VStack>
      </Box>

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
