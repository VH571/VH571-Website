"use client";

import {
  Box,
  Image,
  Text,
  Card,
  Button,
  Link as ChakraLink,
  SimpleGrid,
  HStack,
  Tag,
  VStack,
  Icon,
  Heading,
  IconButton,
  Input,
  Field,
  Textarea,
} from "@chakra-ui/react";
import { IoMdTrash } from "react-icons/io";
import { TagInput } from "./TagInput";
import "@/styles/bootstrap-carousel.scss";
import { Project, ImageURL } from "@/models/project";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import Carousel from "react-bootstrap/Carousel";
import "@/styles/bootstrap-carousel.scss";
import React, { useState, useMemo, useEffect, useRef } from "react";
import NextLink from "next/link";
import { HiFolder, HiOutlineExternalLink } from "react-icons/hi";
import { ImageCarousel } from "./ImageCarousel";
import { Section, SectionMode } from "./Section";
import { ImageUpload, DraftImage } from "./ImageUploader";
import { uploadImage, deleteImageByUrl } from "@/lib/imageService";

function AccentBlock({
  title,
  subtitle,
  children,
}: {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <Box borderLeft="3px solid" borderColor="var(--color-accent)" pl={4}>
      {title && (
        <Heading size="md" mb={1} color="var(--color-fg)">
          {title}
        </Heading>
      )}
      {subtitle && (
        <Text
          mt={-1}
          mb={2}
          color="var(--color-accent-alt)"
          fontWeight="semibold"
        >
          {subtitle}
        </Text>
      )}
      {children}
    </Box>
  );
}
const isHttp = (u: string) => /^https?:\/\//i.test(u);

export function ProjectSection({
  mode,
  project,
  onSave,
  onCancel,
  onChangeMode,
  canEdit,
}: {
  mode: SectionMode;
  project: Project;
  onSave?: (next: Project) => void | Promise<void>;
  onCancel?: () => void;
  onChangeMode?: (m: SectionMode) => void;
  canEdit?: boolean;
}) {
  const [shots, setShots] = useState<ImageURL[]>(project.screenshots ?? []);
  const [pendingDrafts, setPendingDrafts] = useState<DraftImage[]>([]);
  const [pendingDeletes, setPendingDeletes] = useState<string[]>([]);
  const [imgError, setImgError] = useState<string | null>(null);
  const draftUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    if (mode === "view") {
      draftUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
      draftUrlsRef.current = [];
      setPendingDrafts([]);
      setPendingDeletes([]);
      setImgError(null);
      setShots(project.screenshots ?? []);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, project._id]);

  useEffect(() => {
    draftUrlsRef.current = pendingDrafts.map((d) => d.previewUrl);
  }, [pendingDrafts]);

  function handleAddDrafts(ds: DraftImage[]) {
    setImgError(null);
    setPendingDrafts((prev) => [...prev, ...ds]);
  }

  function removeExisting(url: string) {
    setShots((prev) => prev.filter((img) => img.url !== url));
    setPendingDeletes((prev) => (prev.includes(url) ? prev : [...prev, url]));
  }

  function removeDraft(idx: number) {
    setPendingDrafts((prev) => {
      const next = [...prev];
      URL.revokeObjectURL(next[idx].previewUrl);
      next.splice(idx, 1);
      return next;
    });
  }
  const data = [project];
  const handleSave = async (nextArr: Project[]) => {
    const curr = nextArr[0] ?? project;
    const updated: Project = { ...curr };

    try {
      setImgError(null);

      const uploaded: ImageURL[] = [];
      for (const d of pendingDrafts) {
        const img = await uploadImage(d.file, {
          alt: d.alt,
          width: d.width || undefined,
          height: d.height || undefined,
        });
        uploaded.push(img);
      }

      for (const url of pendingDeletes) {
        try {
          await deleteImageByUrl(url);
        } catch (err) {
          setImgError(
            err instanceof Error
              ? err.message
              : "Images failed to delete from storage"
          );
        }
      }

      updated.screenshots = [...shots, ...uploaded];

      await onSave?.(updated);

      pendingDrafts.forEach((d) => URL.revokeObjectURL(d.previewUrl));
      setPendingDrafts([]);
      setPendingDeletes([]);
      setImgError(null);
    } catch (e: unknown) {
      setImgError(
        e instanceof Error ? e.message : "Failed to save screenshots"
      );
      throw e;
    }
  };

  return (
    <Section<Project>
      mode={mode}
      data={data}
      canAdd={false}
      canEdit={canEdit}
      emptyItem={(): Project => ({
        _id: "",
        name: "",
        role: "",
        tech: [],
        description: "",
        achievements: [],
        links: [],
        screenshots: [],
      })}
      onSave={handleSave}
      onCancel={() => {
        pendingDrafts.forEach((d) => URL.revokeObjectURL(d.previewUrl));
        setPendingDrafts([]);
        setPendingDeletes([]);
        setImgError(null);
        setShots(project.screenshots ?? []);
        onCancel?.();
      }}
      onChangeMode={onChangeMode}
      renderViewItem={(p, index) => {
        const primaryLink = Array.isArray(p.links) ? p.links[0] : undefined;
        return (
          <Box key={index}>
            <VStack align={"start"}>
              <VStack gap={0} align={"start"}>
                <Heading size="lg" color="var(--color-fg)" title={p.name}>
                  {p.name}
                </Heading>
                {p.role ? (
                  <Text
                    mt={1}
                    color="var(--color-accent-alt)"
                    fontWeight="semibold"
                  >
                    {p.role}
                  </Text>
                ) : null}
              </VStack>

              {Array.isArray(p.screenshots) && p.screenshots.length > 0 ? (
                <AccentBlock>
                  <Box
                    border="1px solid"
                    borderColor="blackAlpha.200"
                    borderRadius="md"
                    overflow="hidden"
                    maxW={{ base: "40rem", md: "auto" }}
                  >
                    <ImageCarousel name={p.name} screenshots={p.screenshots} />
                  </Box>
                </AccentBlock>
              ) : (
                <AccentBlock>
                  <Text fontStyle="italic" color="gray.500" fontSize="sm">
                    No screenshots available.
                  </Text>
                </AccentBlock>
              )}

              <AccentBlock title="Description">
                {p.description ? (
                  <Text color="gray.700" fontSize="sm" whiteSpace="pre-wrap">
                    {p.description}
                  </Text>
                ) : (
                  <Text fontStyle="italic" color="gray.500" fontSize="sm">
                    No description available.
                  </Text>
                )}
              </AccentBlock>

              <AccentBlock title="Tech Stack">
                {Array.isArray(p.tech) && p.tech.length > 0 ? (
                  <HStack flexWrap="wrap" gap={2}>
                    {p.tech.map((t, i) => (
                      <Tag.Root
                        key={`${t}-${i}`}
                        size="sm"
                        variant="subtle"
                        bg="blackAlpha.50"
                        color="var(--color-fg)"
                        border="1px solid"
                        borderColor="blackAlpha.200"
                      >
                        <Tag.Label>{t}</Tag.Label>
                      </Tag.Root>
                    ))}
                  </HStack>
                ) : (
                  <Text fontSize="sm" color="gray.500" fontStyle="italic">
                    No tech listed.
                  </Text>
                )}
              </AccentBlock>

              <AccentBlock title="Achievements">
                {Array.isArray(p.achievements) && p.achievements.length > 0 ? (
                  <Box as="ul" pl={4} color="gray.700">
                    {p.achievements.map((a, i) => (
                      <Text as="li" key={`${a}-${i}`} fontSize="sm">
                        {a}
                      </Text>
                    ))}
                  </Box>
                ) : (
                  <Text fontSize="sm" color="gray.500" fontStyle="italic">
                    No achievements listed.
                  </Text>
                )}
              </AccentBlock>

              <AccentBlock>
                <HStack flexWrap="wrap" gap={3}>
                  {Array.isArray(p.links) && p.links.length > 0 ? (
                    p.links.map((l, i) => (
                      <ChakraLink
                        as={NextLink}
                        key={`${l.url}-${i}`}
                        href={l.url}
                        {...(isHttp(l.url) ? { isExternal: true } : {})}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          color="var(--color-accent)"
                          borderColor="var(--color-accent)"
                          _hover={{
                            bg: "var(--color-accent)",
                            color: "var(--color-bg)",
                          }}
                        >
                          {l.label ?? "Open Link"}
                        </Button>
                      </ChakraLink>
                    ))
                  ) : (
                    <Text fontSize="sm" color="gray.500" fontStyle="italic">
                      No links provided.
                    </Text>
                  )}
                  {primaryLink && (
                    <ChakraLink
                      href={primaryLink.url}
                      {...(isHttp(primaryLink.url) ? { isExternal: true } : {})}
                    >
                      <Button
                        size="sm"
                        bg="var(--color-accent)"
                        color="var(--color-bg)"
                        _hover={{ opacity: 0.9 }}
                      >
                        {primaryLink.label ?? "Visit"}
                      </Button>
                    </ChakraLink>
                  )}
                </HStack>
              </AccentBlock>
              {!canEdit && (
                <ChakraLink as={NextLink} href="/portfolio" mx={"auto"}>
                  <Button
                    size="sm"
                    variant="ghost"
                    color="var(--color-accent)"
                    _hover={{
                      bg: "var(--color-accent)",
                      color: "var(--color-bg)",
                    }}
                  >
                    Back to Portfolio
                  </Button>
                </ChakraLink>
              )}
            </VStack>
          </Box>
        );
      }}
      renderEditItem={(item, index, update) => (
        <Box key={index} w="100%" mt={"44px"} position="relative">
          <HStack justify="space-between" align="start">
            <Field.Root required>
              <Field.Label>
                Project Name <Field.RequiredIndicator />
              </Field.Label>
              <Input
                value={item.name ?? ""}
                placeholder="Project name"
                onChange={(e) => update(index, { name: e.target.value })}
              />
            </Field.Root>
          </HStack>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={3} mt={2}>
            <Field.Root required>
              <Field.Label>
                Role <Field.RequiredIndicator />
              </Field.Label>
              <Input
                value={item.role ?? ""}
                placeholder="e.g., Frontend Engineer"
                onChange={(e) => update(index, { role: e.target.value })}
              />
            </Field.Root>

            <Field.Root>
              <Field.Label>Tech</Field.Label>
              <TagInput
                values={item.tech ?? []}
                placeholder="Add a tech…"
                onChange={(next) => update(index, { tech: next })}
              />
            </Field.Root>

            <Field.Root gridColumn="1 / -1">
              <Field.Label>Description</Field.Label>
              <Textarea
                value={item.description ?? ""}
                placeholder="Brief overview of the project"
                onChange={(e) => update(index, { description: e.target.value })}
                h={{ base: "6em", md: "6em" }}
                resize="vertical"
              />
            </Field.Root>

            <Field.Root gridColumn="1 / -1">
              <Field.Label>Achievements</Field.Label>
              <VStack align="stretch" gap={2} mt={1} w="100%">
                {(item.achievements ?? []).map((achievement, j) => (
                  <HStack key={j} align="start">
                    <Textarea
                      flex="1"
                      value={achievement}
                      placeholder="Impact, metric, or key result"
                      onChange={(e) => {
                        const achievements = [...(item.achievements ?? [])];
                        achievements[j] = e.target.value;
                        update(index, { achievements });
                      }}
                      h={{ base: "3em", sm: "5em" }}
                      resize="none"
                    />
                    <IconButton
                      aria-label="Remove achievement"
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        const achievements = (item.achievements ?? []).filter(
                          (_, k) => k !== j
                        );
                        update(index, { achievements });
                      }}
                    >
                      <IoMdTrash />
                    </IconButton>
                  </HStack>
                ))}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    update(index, {
                      achievements: [...(item.achievements ?? []), ""],
                    })
                  }
                >
                  + Add Achievement
                </Button>
              </VStack>
            </Field.Root>

            <Field.Root gridColumn="1 / -1">
              <Field.Label>Links</Field.Label>
              <VStack align="stretch" gap={2} mt={1} w="100%">
                {(item.links ?? []).map((link, j) => (
                  <HStack key={j} align="start" gap={2}>
                    <Input
                      flex="1"
                      placeholder="Label"
                      value={link.label ?? ""}
                      onChange={(e) => {
                        const links = [...(item.links ?? [])];
                        links[j] = {
                          ...(links[j] ?? { label: "", url: "" }),
                          label: e.target.value,
                        };
                        update(index, { links });
                      }}
                    />
                    <Input
                      flex="2"
                      placeholder="https://example.com"
                      value={link.url ?? ""}
                      onChange={(e) => {
                        const links = [...(item.links ?? [])];
                        links[j] = {
                          ...(links[j] ?? { label: "", url: "" }),
                          url: e.target.value,
                        };
                        update(index, { links });
                      }}
                    />
                    <IconButton
                      aria-label="Remove link"
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        const links = (item.links ?? []).filter(
                          (_, k) => k !== j
                        );
                        update(index, { links });
                      }}
                    >
                      <IoMdTrash />
                    </IconButton>
                  </HStack>
                ))}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    update(index, {
                      links: [...(item.links ?? []), { label: "", url: "" }],
                    })
                  }
                >
                  + Add Link
                </Button>
              </VStack>
            </Field.Root>

            <Field.Root gridColumn="1 / -1">
              <Field.Label>Screenshots</Field.Label>

              <VStack align="stretch" gap={2} mt={2}>
                <Text fontWeight="semibold">Existing</Text>
                <SimpleGrid columns={{ base: 2, md: 3 }} gap={3}>
                  {shots.map((img, j) => (
                    <Box key={`${img.url}-${j}`} position="relative">
                      <Image
                        src={img.url}
                        alt={img.alt ?? `screenshot-${j}`}
                        objectFit="cover"
                        w="100%"
                        aspectRatio={16 / 9}
                      />
                      <IconButton
                        aria-label="Remove screenshot"
                        size="sm"
                        variant="solid"
                        position="absolute"
                        top={2}
                        right={2}
                        onClick={() => removeExisting(img.url)}
                      >
                        <IoMdTrash />
                      </IconButton>
                    </Box>
                  ))}
                </SimpleGrid>
                {!shots.length && (
                  <Text color="fg.muted">None kept (add new below).</Text>
                )}
              </VStack>

              <VStack align="stretch" gap={2} mt={4}>
                <Text fontWeight="semibold">Add</Text>
                <ImageUpload maxFiles={10} onSelected={handleAddDrafts} />

                {pendingDrafts.length > 0 && (
                  <Box>
                    <Text fontWeight="semibold" mt={3} mb={2}>
                      Pending (to be uploaded on Save)
                    </Text>
                    <SimpleGrid columns={{ base: 2, md: 3 }} gap={3}>
                      {pendingDrafts.map((d, j) => (
                        <Box key={`${d.previewUrl}-${j}`} position="relative">
                          <Image
                            src={d.previewUrl}
                            alt={d.alt || "new screenshot"}
                            objectFit="cover"
                            w="100%"
                            aspectRatio={16 / 9}
                          />
                          <IconButton
                            aria-label="Remove pending screenshot"
                            size="sm"
                            variant="solid"
                            position="absolute"
                            top={2}
                            right={2}
                            onClick={() => removeDraft(j)}
                          >
                            <IoMdTrash />
                          </IconButton>
                        </Box>
                      ))}
                    </SimpleGrid>
                  </Box>
                )}

                {imgError && (
                  <Text color="red.500" mt={2}>
                    {imgError}
                  </Text>
                )}
              </VStack>
            </Field.Root>
          </SimpleGrid>
        </Box>
      )}
    />
  );
}

export default function ProjectCard({ project }: { project: Project }) {
  const primaryLink = project.links?.[0];
  return (
    <Card.Root
      as="article"
      maxW="420px"
      bg="transparent"
      shadow="none"
      border="0"
      overflow="visible"
      _hover={{}}
    >
      <VStack align="stretch" gap={3}>
        <Box borderLeft="3px solid" borderColor="var(--color-accent)" pl={4}>
          {project.screenshots?.[0] ? (
            <Image
              src={project.screenshots[0].url}
              alt={`${project.name} cover`}
              w="full"
              h="180px"
              objectFit="cover"
              borderRadius="md"
              border="1px solid"
              borderColor="blackAlpha.200"
              mb={3}
            />
          ) : (
            <Box
              h="8px"
              w="56px"
              borderRadius="full"
              bg="var(--color-accent)"
              opacity={0.25}
              mb={3}
            />
          )}

          <HStack align="center" gap={2} mb={1}>
            <Icon as={HiFolder} color="var(--color-accent)" />
            <Text
              as="h3"
              fontSize="lg"
              fontWeight="bold"
              color="var(--color-fg)"
              title={project.name}
            >
              {project.name}
            </Text>
          </HStack>

          <Text
            fontSize="sm"
            color="gray.600"
            display="-webkit-box"
            overflow="hidden"
            textOverflow="ellipsis"
            minH={"42px"}
            style={{
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3,
            }}
          >
            {project.description?.trim() || "No description available"}
          </Text>

          <HStack mt={3} gap={2} wrap="wrap">
            {project.tech?.length ? (
              project.tech.slice(0, 6).map((t, i) => (
                <Tag.Root
                  key={`${t}-${i}`}
                  size="sm"
                  variant="subtle"
                  bg="blackAlpha.50"
                  color="var(--color-fg)"
                  border="1px solid"
                  borderColor="blackAlpha.200"
                >
                  <Tag.Label>{t}</Tag.Label>
                </Tag.Root>
              ))
            ) : (
              <Text fontSize="xs" color="gray.500">
                No tech listed
              </Text>
            )}
          </HStack>
        </Box>

        <HStack justify="space-between">
          <ChakraLink as={NextLink} href={`/portfolio/${project._id}`}>
            <Button
              variant="ghost"
              size="sm"
              px={3}
              color="var(--color-accent)"
              _hover={{ bg: "var(--color-accent)", color: "var(--color-bg)" }}
            >
              View Project
            </Button>
          </ChakraLink>

          {primaryLink && (
            <ChakraLink
              href={primaryLink.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="sm"
                px={3}
                variant="outline"
                borderColor="var(--color-accent)"
                color="var(--color-accent)"
                _hover={{ bg: "var(--color-accent)", color: "var(--color-bg)" }}
              >
                {primaryLink.label ?? "Visit"}
                <HiOutlineExternalLink />
              </Button>
            </ChakraLink>
          )}
        </HStack>
      </VStack>
    </Card.Root>
  );
}

export function ProjectCarousel({ projects }: { projects: Project[] }) {
  const itemsPerPage = 6;

  const pages = useMemo(() => {
    if (!projects?.length) return [];
    const out: Project[][] = [];
    for (let i = 0; i < projects.length; i += itemsPerPage) {
      out.push(projects.slice(i, i + itemsPerPage));
    }
    return out;
  }, [projects]);

  const [active, setActive] = useState(0);

  if (!projects?.length) {
    return <Box>No projects come back later!</Box>;
  }

  return (
    <Box
      css={{
        "& .carousel": {
          position: "relative",
          paddingBottom: "56px",
        },
        "& .carousel-indicators": {
          bottom: "12px",
          margin: 0,
        },
        "& .carousel-indicators [data-bs-target]": {
          backgroundColor: "var(--color-accent)",
          opacity: 0.45,
        },
        "& .carousel-indicators .active": {
          opacity: 1,
        },
        "& .carousel-control-prev, & .carousel-control-next": {
          zIndex: 100,
          top: "auto",
          bottom: "12px",
          transform: "none",
          width: "auto",
          padding: "8px 8px",
          opacity: 1,
        },
        "& .visually-hidden": { display: "none" },
      }}
    >
      <Carousel
        activeIndex={active}
        onSelect={(idx) => setActive(idx as number)}
        interval={null}
        slide
        wrap={false}
        nextIcon={<GrFormNext color="var(--color-accent)" size="2rem" />}
        prevIcon={<GrFormPrevious color="var(--color-accent)" size="2rem" />}
      >
        {pages.map((pageItems, pageIdx) => {
          const padCount = itemsPerPage - pageItems.length;
          return (
            <Carousel.Item key={`page-${pageIdx}`}>
              <SimpleGrid
                columns={{ sm: 1, md: 2, xl: 3 }}
                gap={7}
                gridAutoRows="1fr"
              >
                {pageItems.map((project) => (
                  <ProjectCard key={project._id} project={project} />
                ))}
                {padCount > 0 &&
                  Array.from({ length: padCount }).map((_, i) => (
                    <Box key={`pad-${pageIdx}-${i}`} visibility="hidden" />
                  ))}
              </SimpleGrid>
            </Carousel.Item>
          );
        })}
      </Carousel>
    </Box>
  );
}
