"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import { Project } from "@/models/project";
import {
  Box,
  Text,
  VStack,
  Drawer,
  Button,
  HStack,
  IconButton,
  Alert,
  CloseButton,
} from "@chakra-ui/react";
import { IoMdTrash } from "react-icons/io";
import SearchBar, {
  useDebounced,
  filterProjects,
  filterResumes,
} from "./SearchBar";
import ProjectPortal from "./ProjectPortal";
import PaginationItems from "./PaginationItem";
import {
  getAllResumes,
  makeNewResume,
  deleteResumeByID,
  CreateResume,
} from "@/lib/resumeService";
import {
  getAllProjects,
  deleteProjectByID,
  makeNewproject,
} from "@/lib/projectService";
import { Resume } from "@/models/resume";
import ResumePortal from "./ResumePortal";
import { ConfirmDeleteDialog } from "./ConfirmDelete";

const newProjectCreate = (): Omit<Project, "_id"> => ({
  name: "Untitled Project",
  role: "Role",
  tech: [],
  description: "",
  achievements: [],
  links: [],
  screenshots: [],
});

const PLACEHOLDER_HEADSHOT_URL = "/images/default-headshot.png";
export const newResumeTemplate = (): CreateResume => ({
  name: "Untitled Resume",
  title: "Title",
  email: "email@example.com",
  headshot: { url: PLACEHOLDER_HEADSHOT_URL, alt: "Placeholder headshot" },
  githubUrl: "",
  linkedinUrl: "",
  website: "",
  summary: "",
  technicalSkills: {
    languages: [],
    frameworks: [],
    databases: [],
    tools: [],
    other: [],
  },
  education: [],
  extracurriculars: [],
  projects: [],
  experience: [],
  volunteerWork: [],
  certifications: [],
  awards: [],
  isDefault: false,
});

type Banner = {
  kind: "success" | "error" | "info";
  title?: string;
  message: string;
} | null;

export function ResumeTab({ resumeList }: { resumeList: Resume[] }) {
  const [resumes, setResumes] = useState<Resume[]>(resumeList ?? []);
  const [q, setQ] = useState("");
  const dq = useDebounced(q, 250);
  const filtered = useMemo(() => filterResumes(resumes, dq), [resumes, dq]);

  const containerRef = useRef<HTMLElement>(null!);
  const drawerBodyRef = useRef<HTMLDivElement>(null!);

  const [banner, setBanner] = useState<Banner>(null);
  const [lastCreatedId, setLastCreatedId] = useState<string | null>(null);
  const [active, setActive] = useState<Resume | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const fresh = await getAllResumes();
      setResumes(fresh ?? []);
    } catch {}
  }, []);

  async function handleCreate() {
    try {
      const serverResume = await makeNewResume(newResumeTemplate());
      setResumes((prev) => [serverResume, ...prev]);
      setLastCreatedId(serverResume._id);
      setBanner({
        kind: "success",
        title: "Created",
        message: "New resume created. Open it to edit.",
      });
      containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e: unknown) {
      setBanner({
        kind: "error",
        title: "Could not create resume",
        message: e instanceof Error ? e.message : "Please try again.",
      });
    }
  }

  async function handleDelete(r: Resume) {
    const prev = resumes;
    setResumes((list) => list.filter((x) => x._id !== r._id));
    try {
      await deleteResumeByID(r._id);
      setBanner({
        kind: "success",
        title: "Deleted",
        message: "Resume deleted.",
      });
    } catch (e: unknown) {
      setResumes(prev);
      setBanner({
        kind: "error",
        title: "Delete failed",
        message: e instanceof Error ? e.message : "Please try again.",
      });
    }
  }

  const alertStatus =
    banner?.kind === "error"
      ? "error"
      : banner?.kind === "success"
        ? "success"
        : "info";

  return (
    <Box
      w="100%"
      ref={(el: HTMLDivElement | null) => {
        if (el) containerRef.current = el;
      }}
    >
      <Box maxW="50%" minW="350px" mx="auto">
        {banner && (
          <Alert.Root
            status={alertStatus}
            colorPalette="brand"
            position={"absolute"}
            bottom={0}
            right={0}
            w={"350px"}
          >
            <Alert.Indicator />
            <Alert.Content>
              <HStack justify="space-between" align="start" w="100%">
                <VStack align="start" gap={0}>
                  {banner.title && <Alert.Title>{banner.title}</Alert.Title>}
                  <Alert.Description>{banner.message}</Alert.Description>
                </VStack>
                <CloseButton onClick={() => setBanner(null)} />
              </HStack>
            </Alert.Content>
          </Alert.Root>
        )}

        <HStack justify="space-between" align="end" mb={2}>
          <Box flex="1">
            <SearchBar
              value={q}
              onChange={setQ}
              placeholder="Search resumes…"
            />
          </Box>
          <Button onClick={handleCreate} variant="solid" ml={3}>
            + New Resume
          </Button>
        </HStack>

        <Text fontSize="sm" mb={2}>
          Showing {filtered.length} of {resumes.length}
        </Text>

        <PaginationItems pageSize={9} itemsProps={{ minH: "700px" }}>
          {filtered.map((r) => (
            <Box
              key={r._id}
              p={3}
              my="7px"
              borderWidth="1px"
              borderRadius="md"
              bg={r._id === lastCreatedId ? "blackAlpha.50" : undefined}
            >
              <HStack>
                <VStack gap="none" align="start">
                  <Text fontWeight="semibold">
                    {r.name || "Untitled Resume"}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    {r.title}
                  </Text>
                </VStack>

                <HStack marginLeft="auto" gap={2}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setActive(r);
                      setDrawerOpen(true);
                      containerRef.current?.scrollTo({
                        top: 0,
                        behavior: "smooth",
                      });
                    }}
                  >
                    Open Resume
                  </Button>

                  <ConfirmDeleteDialog
                    trigger={
                      <IconButton
                        aria-label="Delete Resume"
                        size="sm"
                        variant="outline"
                      >
                        <IoMdTrash />
                      </IconButton>
                    }
                    title={`Delete ${r.name || "this project"}?`}
                    description="This cannot be undone and will permanently remove the project."
                    onConfirm={() => handleDelete(r)}
                  />
                </HStack>
              </HStack>
            </Box>
          ))}
        </PaginationItems>
      </Box>

      <Drawer.Root
        open={drawerOpen}
        onOpenChange={({ open }) => {
          setDrawerOpen(open);
          if (!open) {
            const idToKeep = active?._id;
            setActive(null);
            setTimeout(() => {
              void refresh();
              if (idToKeep && idToKeep === lastCreatedId) {
                setLastCreatedId(idToKeep);
              }
            }, 0);
          }
        }}
      >
        {active && (
          <ResumePortal
            resume={active}
            containerRef={containerRef}
            bodyRef={drawerBodyRef}
          />
        )}
      </Drawer.Root>
    </Box>
  );
}

export function ProjectTab({ projectList }: { projectList: Project[] }) {
  const [projects, setProjects] = useState<Project[]>(projectList ?? []);
  const [q, setQ] = useState("");
  const dq = useDebounced(q, 250);

  const containerRef = useRef<HTMLElement>(null!);
  const drawerBodyRef = useRef<HTMLDivElement>(null!);

  const [banner, setBanner] = useState<Banner>(null);
  const [active, setActive] = useState<Project | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [lastCreatedId, setLastCreatedId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const fresh = await getAllProjects();
      setProjects(fresh ?? []);
    } catch {}
  }, []);

  const filtered = useMemo(() => filterProjects(projects, dq), [projects, dq]);

  async function handleCreate() {
    try {
      const serverProject = await makeNewproject(newProjectCreate());

      setProjects((prev) => [serverProject, ...prev]);
      setLastCreatedId(serverProject._id);

      setActive(serverProject);
      containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });

      setBanner({
        kind: "success",
        title: "Created",
        message: "New project created. You can edit it now.",
      });
    } catch (e: unknown) {
      setBanner({
        kind: "error",
        title: "Could not create project",
        message: e instanceof Error ? e.message : "Please try again.",
      });
    }
  }

  async function handleDelete(p: Project) {
    const prev = projects;
    setProjects((list) => list.filter((x) => x._id !== p._id));
    try {
      await deleteProjectByID(p._id);
      setBanner({
        kind: "success",
        title: "Deleted",
        message: "Project deleted.",
      });
    } catch (e: unknown) {
      setProjects(prev);
      setBanner({
        kind: "error",
        title: "Delete failed",
        message: e instanceof Error ? e.message : "Please try again.",
      });
    }
  }

  const alertStatus =
    banner?.kind === "error"
      ? "error"
      : banner?.kind === "success"
        ? "success"
        : "info";

  return (
    <Box
      ref={(el: HTMLDivElement | null) => {
        if (el) containerRef.current = el;
      }}
      w="100%"
    >
      <Box maxW="50%" minW="350px" mx="auto">
        {banner && (
          <Alert.Root
            status={alertStatus}
            mb={3}
            colorPalette="brand"
            position={"absolute"}
            bottom={0}
            right={0}
            w={"350px"}
          >
            <Alert.Indicator />
            <Alert.Content>
              <HStack justify="space-between" align="start" w="100%">
                <VStack align="start" gap={0}>
                  {banner.title && <Alert.Title>{banner.title}</Alert.Title>}
                  <Alert.Description>{banner.message}</Alert.Description>
                </VStack>
                <CloseButton onClick={() => setBanner(null)} />
              </HStack>
            </Alert.Content>
          </Alert.Root>
        )}

        <HStack justify="space-between" align="end" mb={2}>
          <Box flex="1">
            <SearchBar
              value={q}
              onChange={setQ}
              placeholder="Search projects…"
            />
          </Box>
          <Button onClick={handleCreate} variant="solid" ml={3}>
            + New Project
          </Button>
        </HStack>

        <Text fontSize="sm" mb={2}>
          Showing {filtered.length} of {projects.length}
        </Text>

        <PaginationItems pageSize={9} itemsProps={{ minH: "700px" }}>
          {filtered.map((p, index) => (
            <Box
              key={index}
              p={3}
              my="7px"
              borderWidth="1px"
              borderRadius="md"
              bg={p._id === lastCreatedId ? "blackAlpha.50" : undefined}
            >
              <HStack gap={3} align="start">
                <VStack gap="0" align="start">
                  <Text fontWeight="semibold">
                    {p.name || "Untitled Project"}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    {p.role}
                  </Text>
                </VStack>

                <HStack marginLeft="auto" gap={2}>
                  <Drawer.Root
                    onOpenChange={async ({ open }) => {
                      if (open) {
                        setActive(p);
                        containerRef.current?.scrollTo({
                          top: 0,
                          behavior: "smooth",
                        });
                      } else {
                        setActive(null);
                        await refresh();
                      }
                    }}
                    open={active?._id === p._id && drawerOpen}
                  >
                    <Drawer.Trigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setActive(p);
                          setDrawerOpen(true);
                          containerRef.current?.scrollTo({
                            top: 0,
                            behavior: "smooth",
                          });
                        }}
                      >
                        Open Project
                      </Button>
                    </Drawer.Trigger>
                    {active?._id === p._id && (
                      <ProjectPortal
                        project={p}
                        containerRef={containerRef}
                        bodyRef={drawerBodyRef}
                      />
                    )}
                  </Drawer.Root>

                  <ConfirmDeleteDialog
                    trigger={
                      <IconButton
                        aria-label="Delete project"
                        size="sm"
                        variant="outline"
                      >
                        <IoMdTrash />
                      </IconButton>
                    }
                    title={`Delete "${p.name || "this project"}"?`}
                    description="This cannot be undone and will permanently remove the project."
                    onConfirm={() => handleDelete(p)}
                  />
                </HStack>
              </HStack>
            </Box>
          ))}
        </PaginationItems>
      </Box>

      <Drawer.Root
        open={drawerOpen}
        onOpenChange={({ open }) => {
          setDrawerOpen(open);
          if (!open) {
            const idToKeep = active?._id;
            setActive(null);
            setTimeout(() => {
              void refresh();
              if (idToKeep && idToKeep === lastCreatedId) {
                setLastCreatedId(idToKeep);
              }
            }, 0);
          }
        }}
      >
        {active && (
          <ProjectPortal
            project={active}
            containerRef={containerRef}
            bodyRef={drawerBodyRef}
          />
        )}
      </Drawer.Root>
    </Box>
  );
}
