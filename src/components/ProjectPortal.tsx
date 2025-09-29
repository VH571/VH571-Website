"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { Project } from "@/models/project";
import { SectionMode } from "./Section";
import { patchProjectPartial, makeNewproject } from "@/lib/projectService";
import { Box, Drawer, Portal, CloseButton, Stack } from "@chakra-ui/react";
import { ProjectSection } from "./ProjectSection";

type SaveAs = "patch" | "create";

type ProjectPortalProps = {
  project: Project;
  containerRef?: React.RefObject<HTMLElement> | null;
  bodyRef: React.RefObject<HTMLDivElement>;
  saveAs?: SaveAs;
  onSaved?: (project: Project) => void | Promise<void>;
};

function normalizeForSave(next: Project): Omit<Project, "_id"> {
  const trimStr = (s?: string) => (s ?? "").trim();
  const arrTrim = (a?: string[]) =>
    (a ?? []).map((x) => x.trim()).filter(Boolean);

  const tech = Array.from(new Set(arrTrim(next.tech)));
  const achievements = arrTrim(next.achievements);

  const links = (next.links ?? [])
    .map((l) => ({
      label: trimStr(l.label),
      url: trimStr(l.url),
    }))
    .filter((l) => !!l.url);

  const screenshots = (next.screenshots ?? []).filter((s) => !!trimStr(s.url));

  return {
    name: trimStr(next.name),
    role: trimStr(next.role),
    tech,
    description: trimStr(next.description),
    achievements,
    links,
    screenshots,
  };
}

export default function ProjectPortal({
  project,
  containerRef,
  bodyRef,
  saveAs = "patch",
  onSaved,
}: ProjectPortalProps) {
  const [mode, setMode] = useState<SectionMode>(
    project?._id ? "view" : "create"
  );
  const [currentProject, setCurrentProject] = useState<Project>(project);

  useEffect(() => {
    setCurrentProject(project);
    setMode(project?._id ? "view" : "create");
  }, [project]);

  if (!containerRef) return null;

  return (
    <Box>
      <Portal container={containerRef ?? ""}>
        <Drawer.Backdrop bg="blackAlpha.600" />
        <Drawer.Positioner position="absolute" w="100%" p={{ base: 3, md: 5 }}>
          <Drawer.Content
            ref={bodyRef}
            role="dialog"
            aria-labelledby="project-title"
            maxW="960px"
            mx="auto"
            minH="320px"
            maxH="960px"
            overflow="auto"
            bg="bg"
          >
            <Drawer.Header />
            <Drawer.CloseTrigger
              mx="24px"
              my="8px"
              asChild
              position="absolute"
              top="0"
              right="0"
            >
              <CloseButton size="lg" />
            </Drawer.CloseTrigger>

            <Drawer.Body>
              <Stack gap={10}>
                <ProjectSection
                  mode={mode}
                  onChangeMode={setMode}
                  project={currentProject}
                  canEdit
                  onSave={async (nextList) => {
                    const next =
                      (Array.isArray(nextList) ? nextList[0] : nextList) ??
                      currentProject;

                    const payload = normalizeForSave(next);

                    let saved: Project;
                    if (saveAs === "create" || !currentProject._id) {
                      saved = await makeNewproject(payload);
                    } else {
                      await patchProjectPartial(currentProject._id, payload);
                      saved = { ...currentProject, ...payload };
                    }

                    setCurrentProject(saved);
                    setMode("view");
                    await onSaved?.(saved);
                  }}
                  onCancel={() => setMode("view")}
                />
              </Stack>
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Box>
  );
}
