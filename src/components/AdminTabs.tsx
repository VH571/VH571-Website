"use client";
import { useState, useMemo, useRef } from "react";
import { Project } from "@/models/project";
import { Resume } from "@/models/resume";
import { Box, Text, VStack, Drawer, Button, HStack } from "@chakra-ui/react";
import SearchBar, {
  useDebounced,
  filterProjects,
  filterResumes,
} from "./SearchBar";
import ResumePortal from "./ResumeDrawer";
import ProjectPortal from "./ProjectDrawer";

export function ResumeTab({ resumeList }: { resumeList: Resume[] }) {
  const [q, setQ] = useState("");
  const dq = useDebounced(q, 250);
  const containerRef = useRef<HTMLElement>(null!);
  const filtered = useMemo(
    () => filterResumes(resumeList, dq),
    [resumeList, dq]
  );

  return (
    <Box
      w={"100%"}
      ref={(el: HTMLDivElement | null) => {
        if (el) containerRef.current = el;
      }}
    >
      <Box maxW={"50%"} minW={"350px"} mx={"auto"}>
        <SearchBar value={q} onChange={setQ} placeholder="Search resumes…" />
        <Text fontSize="sm">
          Showing {filtered.length} of {resumeList.length}
        </Text>
        <VStack align="stretch" gap={2} mt={3}>
          {filtered.map((r) => (
            <Box key={r._id} p={3} borderWidth="1px" borderRadius="md">
              <HStack>
                <VStack gap={"none"} align={"start"}>
                  <Text fontWeight="semibold">{r.name}</Text>
                  <Text fontSize="sm" color="gray.600">
                    {r.title}
                  </Text>
                </VStack>
                <Box marginLeft={"auto"}>
                  <Drawer.Root>
                    <Drawer.Trigger asChild>
                      <Button variant="outline" size="sm">
                        Open Resume
                      </Button>
                    </Drawer.Trigger>
                    <ResumePortal resume={r} containerRef={containerRef} />
                  </Drawer.Root>
                </Box>
              </HStack>
            </Box>
          ))}
        </VStack>
      </Box>
    </Box>
  );
}

export function ProjectTab({ projectList }: { projectList: Project[] }) {
  const [q, setQ] = useState("");
  const dq = useDebounced(q, 250);
  const containerRef = useRef<HTMLElement>(null!);
  const drawerBodyRef = useRef<HTMLDivElement>(null!);
  const filtered = useMemo(
    () => filterProjects(projectList, dq),
    [projectList, dq]
  );

  return (
    <Box
      ref={(el: HTMLDivElement | null) => {
        if (el) containerRef.current = el;
      }}
      w={"100%"}
    >
      <Box position="relative" maxW="50%" minW="350px" mx="auto">
        <SearchBar value={q} onChange={setQ} placeholder="Search projects…" />
        <Text fontSize="sm">
          Showing {filtered.length} of {projectList.length}
        </Text>

        <VStack align="stretch" gap={2} mt={3}>
          {filtered.map((p) => (
            <Box key={p._id} p={3} borderWidth="1px" borderRadius="md">
              <HStack>
                <VStack gap="none" align="start">
                  <Text fontWeight="semibold">{p.name}</Text>
                  <Text fontSize="sm" color="gray.600">
                    {p.role}
                  </Text>
                </VStack>
                <Box marginLeft="auto">
                  <Drawer.Root
                    onOpenChange={({ open }) => {
                      if (open)
                        containerRef.current?.scrollTo({
                          top: 0,
                          behavior: "smooth",
                        });
                    }}
                  >
                    <Drawer.Trigger asChild>
                      <Button variant="outline" size="sm">
                        Open Project
                      </Button>
                    </Drawer.Trigger>
                    <ProjectPortal
                      project={p}
                      containerRef={containerRef}
                      bodyRef={drawerBodyRef}
                    />
                  </Drawer.Root>
                </Box>
              </HStack>
            </Box>
          ))}
        </VStack>
      </Box>
    </Box>
  );
}
