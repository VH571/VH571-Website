"use client";
import * as React from "react";
import { useState } from "react";
import { SectionMode } from "@/components/Section";
import { patchResumeField, patchResumePartial } from "@/lib/resumeService";
import { Box, Drawer, Portal, Stack, CloseButton } from "@chakra-ui/react";
import {
  HeaderSection,
  EducationSection,
  ExperienceSection,
  ExtracurricularSection,
  SkillsSection,
  ProjectsSection,
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
import { ImageURL } from "@/models/project";

type SectionKey =
  | "header"
  | "education"
  | "projects"
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
    projects: "view",
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
      projects: mode,
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
  headshot?: ImageURL | null;
  githubUrl?: string;
  linkedinUrl?: string;
  website?: string;
  summary?: string;
  isDefault?: boolean;
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
    isDefault: resume.isDefault ?? false,
  };

  const [header, setHeader] = useState<HeaderData>(initialHeader);
  const [education, setEducation] = useState<Education[]>(
    resume.education ?? []
  );
  const [projectIds, setProjectIds] = useState<string[]>(
    (resume.projects ?? []).map((p: unknown) => String(p))
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
            scrollbar="hidden"
            bg="bg"
          >
            <Box w="full" maxW="920px" mx="auto">
              <Drawer.Header
                as="header"
                marginTop="10px"
                px={{ base: 3, md: 5 }}
                borderBottom="1px solid"
                borderColor="blackAlpha.200"
              >
                <HeaderSection
                  mode={modes.header}
                  onChangeMode={setMode("header")}
                  header={header}
                  onSave={async (next) => {
                    const h = next[0] ?? initialHeader;
                    const partial: Record<string, unknown> = {
                      name: h.name,
                      title: h.title ?? "",
                      email: h.email,
                      githubUrl: h.githubUrl ?? "",
                      linkedinUrl: h.linkedinUrl ?? "",
                      website: h.website ?? "",
                      summary: h.summary ?? "",
                      headshot: h.headshot ?? null,
                      isDefault: !!h.isDefault,
                    };
                    await patchResumePartial(resume._id, partial);
                    setHeader(h);
                    setMode("header")("view");
                  }}
                  onCancel={() => setMode("header")("view")}
                  canEdit
                />

                <Drawer.CloseTrigger
                  asChild
                  position="absolute"
                  top="0"
                  right="0"
                >
                  <CloseButton size="lg" />
                </Drawer.CloseTrigger>
              </Drawer.Header>

              <Drawer.Body px={{ base: 3, md: 5 }} py={{ base: 3, md: 4 }}>
                <Stack gap={10}>
                  <EducationSection
                    mode={modes.education}
                    onChangeMode={setMode("education")}
                    education={education}
                    onSave={async (next) => {
                      setEducation(next);
                      await patchResumeField(resume._id, "education", next);
                      setMode("education")("view");
                    }}
                    onCancel={() => setMode("education")("view")}
                    canEdit
                  />
                  <ExperienceSection
                    mode={modes.experience}
                    onChangeMode={setMode("experience")}
                    experience={experience}
                    onSave={async (next) => {
                      setExperience(next);
                      await patchResumeField(resume._id, "experience", next);
                      setMode("experience")("view");
                    }}
                    onCancel={() => setMode("experience")("view")}
                    canEdit
                  />
                  <ProjectsSection
                    mode={modes.projects}
                    onChangeMode={setMode("projects")}
                    canEdit
                    selectedIds={projectIds}
                    onSave={async (nextIds) => {
                      await patchResumeField(resume._id, "projects", nextIds);
                      setProjectIds(nextIds);
                      setMode("projects")("view");
                    }}
                    onCancel={() => setMode("projects")("view")}
                  />

                  <SkillsSection
                    mode={modes.skills}
                    onChangeMode={setMode("skills")}
                    technicalSkills={technicalSkills}
                    onSave={async (next) => {
                      const one = next[0] ?? null;
                      setTechnicalSkills(one);
                      await patchResumeField(
                        resume._id,
                        "technicalSkills",
                        one
                      );
                      setMode("skills")("view");
                    }}
                    onCancel={() => setMode("skills")("view")}
                    canEdit
                  />

                  <ExtracurricularSection
                    mode={modes.extracurricular}
                    onChangeMode={setMode("extracurricular")}
                    extracurricular={extracurricular}
                    onSave={async (next) => {
                      setExtracurricular(next);
                      await patchResumeField(
                        resume._id,
                        "extracurriculars",
                        next
                      );
                      setMode("extracurricular")("view");
                    }}
                    onCancel={() => setMode("extracurricular")("view")}
                    canEdit
                  />

                  <VolunteerSection
                    mode={modes.volunteer}
                    onChangeMode={setMode("volunteer")}
                    volunteerWork={volunteerWork}
                    onSave={async (next) => {
                      setVolunteerWork(next);
                      await patchResumeField(resume._id, "volunteerWork", next);
                      setMode("volunteer")("view");
                    }}
                    onCancel={() => setMode("volunteer")("view")}
                    canEdit
                  />

                  <CertificationsSection
                    mode={modes.certifications}
                    onChangeMode={setMode("certifications")}
                    certifications={certifications}
                    onSave={async (next) => {
                      setCertifications(next);
                      await patchResumeField(
                        resume._id,
                        "certifications",
                        next
                      );
                      setMode("certifications")("view");
                    }}
                    onCancel={() => setMode("certifications")("view")}
                    canEdit
                  />

                  <AwardsSection
                    mode={modes.awards}
                    onChangeMode={setMode("awards")}
                    awards={awards}
                    onSave={async (next) => {
                      setAwards(next);
                      await patchResumeField(resume._id, "awards", next);
                      setMode("awards")("view");
                    }}
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
