"use client";

import {
  Box,
  Drawer,
  Portal,
  Heading,
  Text,
  Stack,
  HStack,
  Link,
  CloseButton,
  Image,
  VStack,
} from "@chakra-ui/react";
import * as React from "react";
import { useState } from "react";
import {
  Education,
  Extracurricular,
  TechnicalSkills,
  Experience,
  VolunteerWork,
  Certification,
  Award,
  Resume,
} from "@/models/resume";
import { Link as ExtLink } from "@/models/project";
import { SectionMode } from "@/components/Section";
import {
  EducationSection,
  ExperienceSection,
  ExtracurricularSection,
  SkillsSection,
  VolunteerSection,
  CertificationsSection,
  AwardsSection,
} from "./ResumeSection";
function formatLabelFromUrl(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function InlineLink({ link }: { link: ExtLink }) {
  const label = link.label?.trim() || formatLabelFromUrl(link.url);
  return (
    <Link
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      textDecoration="underline"
      color={"var(--color-accent)"}
      fontSize="sm"
      mr={3}
    >
      {label}
    </Link>
  );
}
type SectionKey =
  | "education"
  | "experience"
  | "skills"
  | "extracurricular"
  | "volunteer"
  | "certifications"
  | "awards";

function useSectionModes(initial?: Partial<Record<SectionKey, SectionMode>>) {
  const [modes, setModes] = React.useState<Record<SectionKey, SectionMode>>({
    education: "view",
    experience: "view",
    skills: "view",
    extracurricular: "view",
    volunteer: "view",
    certifications: "view",
    awards: "view",
    ...(initial ?? {}),
  });

  const setMode = (key: SectionKey) => (mode: SectionMode) =>
    setModes((m) => ({ ...m, [key]: mode }));

  const setAll = (mode: SectionMode) =>
    setModes({
      education: mode,
      experience: mode,
      skills: mode,
      extracurricular: mode,
      volunteer: mode,
      certifications: mode,
      awards: mode,
    });

  return { modes, setMode, setAll };
}

export default function ResumePortal({
  resume,
  containerRef,
  bodyRef,
}: {
  resume: Resume;
  containerRef?: React.RefObject<HTMLElement> | null;
  bodyRef: React.RefObject<HTMLDivElement>;
}) {
  const { modes, setMode } = useSectionModes();

  const [education, setEducation] = useState<Education[]>(
    resume.education ?? []
  );
  const [experience, setExperience] = useState<Experience[]>(
    resume.experience ?? []
  );
  const [extracurricular, setExtracurricular] = useState<Extracurricular[]>(
    resume.experience ?? []
  );
  const [technicalSkills, setTechnicalSkills] =
    useState<TechnicalSkills | null>(resume.technicalSkills ?? null);

  if (!containerRef) return null;
  const contactLinks: ExtLink[] = [
    resume.githubUrl ? { url: resume.githubUrl, label: "GitHub" } : null,
    resume.linkedinUrl ? { url: resume.linkedinUrl, label: "LinkedIn" } : null,
    resume.website ? { url: resume.website, label: "Website" } : null,
  ].filter(Boolean) as ExtLink[];

  return (
    <Box>
      <Portal container={containerRef ?? ""}>
        <Drawer.Backdrop bg="blackAlpha.600" />
        <Drawer.Positioner position="absolute" w="100%" p={{ base: 3, md: 5 }}>
          <Drawer.Content
            ref={bodyRef}
            role="dialog"
            aria-labelledby="resume-title"
            maxW="960px"
            mx="auto"
            minH="320px"
            maxH="960px"
            overflow="auto"
            bg="bg"
          >
            <Box minW={{ md: "404px", lg: "404px" }} maxW={"920px"} mx="auto">
              <Drawer.Header
                as="header"
                top={0}
                zIndex={1}
                px={{ base: 3, md: 5 }}
                py={{ base: 3, md: 5 }}
                borderBottom="1px solid"
                borderColor="blackAlpha.200"
              >
                <VStack alignItems="left" w={"100%"}>
                  <Box
                    display="grid"
                    gridTemplateColumns={{ base: "1fr", md: "auto 1fr" }}
                    columnGap={6}
                    rowGap={3}
                    pr={{ md: 8 }}
                    position="relative"
                  >
                    <HStack align="center" gap={4} minW={0}>
                      {resume.headshot?.url ? (
                        <Image
                          src={resume.headshot.url}
                          alt={resume.headshot.alt ?? `${resume.name} headshot`}
                          boxSize="64px"
                          objectFit="cover"
                          borderRadius="full"
                        />
                      ) : null}
                      <Box minW={0} css={{ overflowWrap: "anywhere" }}>
                        <Heading
                          id="resume-title"
                          as="h2"
                          size="md"
                          lineHeight="short"
                          letterSpacing="wide"
                        >
                          {resume.name}
                        </Heading>
                        <Text fontSize="sm" color="fg.muted">
                          {resume.title}
                        </Text>
                        {/* Email */}
                        <Text mt={1}>
                          <Text as="span" fontWeight="bold">
                            Email:
                          </Text>{" "}
                          <Link
                            href={`mailto:${resume.email}`}
                            textDecoration={"none"}
                          >
                            {resume.email}
                          </Link>
                        </Text>
                        {/* External links */}
                        <HStack mt={2} gap={2} flexWrap="wrap">
                          {contactLinks.length ? (
                            contactLinks.map((l, i) => (
                              <InlineLink link={l} key={`${l.url}-${i}`} />
                            ))
                          ) : (
                            <Text color="fg.muted" fontSize="sm">
                              No external links.
                            </Text>
                          )}
                        </HStack>
                      </Box>
                    </HStack>

                    {/* Close button */}
                    <Drawer.CloseTrigger asChild>
                      <CloseButton
                        position="absolute"
                        top="0"
                        right="0"
                        size="sm"
                        borderRadius="0"
                        _focusVisible={{
                          boxShadow: "0 0 0 2px var(--color-accent)",
                        }}
                      />
                    </Drawer.CloseTrigger>
                  </Box>

                  <Box
                    mt={3}
                    borderLeft="3px solid"
                    borderColor="var(--color-accent)"
                    pl={4}
                  >
                    {resume.summary?.trim() ? (
                      <Text lineHeight="tall">{resume.summary.trim()}</Text>
                    ) : (
                      <Text color="fg.muted" fontStyle="italic">
                        No summary provided.
                      </Text>
                    )}
                  </Box>
                </VStack>
              </Drawer.Header>

              <Drawer.Body px={{ base: 3, md: 5 }} py={{ base: 3, md: 4 }}>
                <Stack gap={0}>
                  <EducationSection
                    mode={modes.education}
                    onChangeMode={setMode("education")}
                    education={education}
                    onSave={(next) => {
                      setEducation(next);
                    }}
                    onCancel={() => {
                      setMode("education")("view");
                    }}
                    canEdit
                  />

                  <ExperienceSection
                    mode={modes.experience}
                    onChangeMode={setMode("experience")}
                    experience={experience}
                    onSave={(next) => {
                      setExperience(next);
                    }}
                    onCancel={() => setMode("experience")("view")}
                    canEdit
                  />

                  <SkillsSection
                    mode={modes.skills}
                    onChangeMode={setMode("skills")}
                    technicalSkills={technicalSkills}
                    onSave={(next) => {
                      setTechnicalSkills(next[0] ?? null);
                    }}
                    onCancel={() => setMode("skills")("view")}
                    canEdit
                  />
                  <ExtracurricularSection
                    mode={modes.extracurricular}
                    onChangeMode={setMode("extracurricular")}
                    extracurricular={extracurricular}
                    onSave={(next) => {
                      setExtracurricular(next);
                    }}
                    onCancel={() => setMode("extracurricular")("view")}
                    canEdit
                  />
                  <VolunteerSection volunteerWork={resume.volunteerWork} />
                  <CertificationsSection
                    certifications={resume.certifications}
                  />
                  <AwardsSection awards={resume.awards} />
                </Stack>
              </Drawer.Body>
            </Box>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Box>
  );
}
