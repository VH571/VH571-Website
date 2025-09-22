"use client";
import * as React from "react";
import { useState } from "react";
import { Link as ExtLink } from "@/models/project";
import { SectionMode } from "@/components/Section";
import { InlineLink } from "./Utilities";
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
import {
  HeaderSection,
  EducationSection,
  ExperienceSection,
  ExtracurricularSection,
  SkillsSection,
  VolunteerSection,
  CertificationsSection,
  AwardsSection,
} from "./ResumeSection";
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

type SectionKey =
  | "header"
  | "education"
  | "experience"
  | "skills"
  | "extracurricular"
  | "volunteer"
  | "certifications"
  | "awards";

function useSectionModes(initial?: Partial<Record<SectionKey, SectionMode>>) {
  const [modes, setModes] = React.useState<Record<SectionKey, SectionMode>>({
    header: "view",
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
      header: mode,
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
export type HeaderData = {
  name: string;
  title?: string;
  email: string;
  headshot?: { url: string; alt?: string } | null;
  githubUrl?: string;
  linkedinUrl?: string;
  website?: string;
  summary?: string;
};
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
  const initialHeader: HeaderData = {
    name: resume.name ?? "",
    title: resume.title ?? undefined,
    email: resume.email ?? "",
    headshot: resume.headshot ?? null,
    githubUrl: resume.githubUrl ?? undefined,
    linkedinUrl: resume.linkedinUrl ?? undefined,
    website: resume.website ?? undefined,
    summary: resume.summary ?? undefined,
  };

  const [header, setHeader] = useState<HeaderData>(initialHeader);

  const [education, setEducation] = useState<Education[]>(
    resume.education ?? []
  );

  const [experience, setExperience] = useState<Experience[]>(
    resume.experience ?? []
  );

  const [extracurricular, setExtracurricular] = useState<Extracurricular[]>(
    resume.extracurriculars ?? []
  );

  const [technicalSkills, setTechnicalSkills] =
    useState<TechnicalSkills | null>(resume.technicalSkills ?? null);

  const [volunteerWork, setVolunteerWork] = useState<VolunteerWork[]>(
    resume.volunteerWork ?? []
  );

  const [certifications, setCertifications] = useState<Certification[]>(
    resume.certifications ?? []
  );

  const [awards, setAwards] = useState<Award[]>(resume.awards ?? []);

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
            <Box w="full" maxW={"920px"} mx="auto">
              <Drawer.Header
                as="header"
                top={0}
                px={{ base: 3, md: 5 }}
                borderBottom="1px solid"
                borderColor="blackAlpha.200"
              >
                <HeaderSection
                  mode={modes.header}
                  onChangeMode={setMode("header")}
                  header={header}
                  onSave={(next) => setHeader(next[0] ?? initialHeader)}
                  onCancel={() => setMode("header")("view")}
                  canEdit
                />
              </Drawer.Header>

              <Drawer.Body px={{ base: 3, md: 5 }} py={{ base: 3, md: 4 }}>
                <Stack gap={10}>
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

                  <VolunteerSection
                    mode={modes.volunteer}
                    onChangeMode={setMode("volunteer")}
                    volunteerWork={volunteerWork}
                    onSave={(next) => {
                      setVolunteerWork(next);
                    }}
                    onCancel={() => setMode("volunteer")("view")}
                    canEdit
                  />

                  <CertificationsSection
                    mode={modes.certifications}
                    onChangeMode={setMode("certifications")}
                    certifications={certifications}
                    onSave={(next) => setCertifications(next)}
                    onCancel={() => setMode("certifications")("view")}
                    canEdit
                  />

                  <AwardsSection
                    mode={modes.awards}
                    onChangeMode={setMode("awards")}
                    awards={awards}
                    onSave={(next) => setAwards(next)}
                    onCancel={() => setMode("awards")("view")}
                    canEdit
                  />
                </Stack>
              </Drawer.Body>
            </Box>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Box>
  );
}
