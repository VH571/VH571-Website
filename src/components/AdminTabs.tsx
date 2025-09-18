"use client";
import { useState, useMemo } from "react";
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
  const filtered = useMemo(
    () => filterResumes(resumeList, dq),
    [resumeList, dq]
  );

  return (
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
                  <ResumePortal resume={r} />
                </Drawer.Root>
              </Box>
            </HStack>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}

export function ProjectTab({ projectList }: { projectList: Project[] }) {
  const [q, setQ] = useState("");
  const dq = useDebounced(q, 250);

  const filtered = useMemo(
    () => filterProjects(projectList, dq),
    [projectList, dq]
  );
  return (
    <Box maxW={"50%"} minW={"350px"} mx={"auto"}>
      <SearchBar value={q} onChange={setQ} placeholder="Search projects…" />
      <Text fontSize="sm">
        Showing {filtered.length} of {projectList.length}
      </Text>
      <VStack align="stretch" gap={2} mt={3}>
        {filtered.map((p) => (
          <Box key={p._id} p={3} borderWidth="1px" borderRadius="md">
            <Text fontWeight="semibold">{p.name}</Text>
            <Text fontSize="sm" color="gray.600">
              {p.role}
            </Text>
            <Drawer.Root>
              <Drawer.Trigger asChild>
                <Button variant="outline" size="sm">
                  Open Project
                </Button>
              </Drawer.Trigger>
              <ProjectPortal project={p} />
            </Drawer.Root>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}
