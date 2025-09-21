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
import type { Resume } from "@/models/resume";
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
import { Education } from "@/models/resume";
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

export default function ResumePortal({
  resume,
  containerRef,
  bodyRef,
}: {
  resume: Resume;
  containerRef?: React.RefObject<HTMLElement> | null;
  bodyRef: React.RefObject<HTMLDivElement>;
}) {
  const [mode, setMode] = useState<SectionMode>("view");
  const [education, setEducation] = useState<Education[]>(
    resume.education ?? []
  );

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
            <Box minW={{ md: "404px", lg: "920px" }} maxW={"920px"} mx="auto">
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

              {/* Body */}
              <Drawer.Body px={{ base: 3, md: 5 }} py={{ base: 3, md: 4 }}>
                <Stack gap={0}>
                  <EducationSection
                    mode={mode}
                    education={education}
                    onChangeMode={setMode}
                    onCancel={() => {
                      // no-op; Section resets draft for us
                    }}
                    onSave={(next) => {
                      setEducation(next); // persist to state (or call your API here)
                    }}
                    canEdit
                  />
                  <ExperienceSection experience={resume.experience} />
                  <SkillsSection technicalSkills={resume.technicalSkills} />
                  <ExtracurricularSection
                    extracurricular={resume.extracurriculars}
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
