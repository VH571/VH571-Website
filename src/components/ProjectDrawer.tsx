"use client";

import * as React from "react";
import { useState } from "react";
import { Project, Link as ExtLink, ImageURL } from "@/models/project";
import { SectionMode } from "./Section";
import { patchProjectPartial } from "@/lib/projectService"; // implement if not present
import {
  Box,
  Drawer,
  Portal,
  Heading,
  CloseButton,
  Stack,
} from "@chakra-ui/react";
import { ProjectSection } from "./ProjectSection";
type ProjectPortalProps = {
  project: Project;
  containerRef?: React.RefObject<HTMLElement> | null;
  bodyRef: React.RefObject<HTMLDivElement>;
};

export default function ProjectPortal({
  project,
  containerRef,
  bodyRef,
}: ProjectPortalProps) {
  if (!containerRef) return null;
  const [mode, setMode] = useState<SectionMode>("view");
  const [currentProject, setCurrentProject] = useState<Project>(project);

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
            <Box w="full" maxW="920px" mx="auto">
              <Drawer.CloseTrigger asChild>
                <CloseButton size="sm" />
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

                      const partial: Partial<Project> = {
                        name: next.name,
                        role: next.role,
                        tech: next.tech ?? [],
                        description: next.description ?? "",
                        achievements: next.achievements ?? [],
                        links: next.links ?? [],
                        screenshots: next.screenshots ?? [],
                      };

                      await patchProjectPartial(currentProject._id, partial);
                      setCurrentProject({ ...currentProject, ...partial });
                      setMode("view");
                    }}
                    onCancel={() => setMode("view")}
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
