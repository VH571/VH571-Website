"use client";
import { useState, useEffect } from "react";
import { TagInput } from "./TagInput";
import { IoMdTrash } from "react-icons/io";
import { Section, SectionMode } from "./Section";
import { SectionHeader, fmtMY } from "./Utilities";
import {
  Box,
  Text,
  VStack,
  Link,
  List,
  ListItem,
  HStack,
  IconButton,
  Input,
  SimpleGrid,
  Field,
  Button,
  Textarea,
  Heading,
  Image,
  Checkbox,
} from "@chakra-ui/react";
import {
  Education,
  Extracurricular,
  TechnicalSkills,
  Experience,
  VolunteerWork,
  Certification,
  Award,
} from "@/models/resume";
import { ImageUpload, DraftImage } from "./ImageUploader";
import { uploadImage, deleteImageByUrl } from "@/lib/imageService";
import React from "react";
import { HeaderData } from "./ResumeDrawer";

export function HeaderSection({
  mode,
  header,
  onSave,
  onCancel,
  onChangeMode,
  canEdit,
}: {
  mode: SectionMode;
  header: HeaderData;
  onSave?: (next: HeaderData[]) => void | Promise<void>;
  onCancel?: () => void;
  onChangeMode?: (m: SectionMode) => void;
  canEdit?: boolean;
}) {
  const [pending, setPending] = useState<DraftImage | null>(null);
  const editStartUrlRef = React.useRef<string | null>(null);
  const [imgError, setImgError] = useState<string | null>(null);

  useEffect(() => {
    if (
      (mode === "edit" || mode === "create") &&
      editStartUrlRef.current === null
    ) {
      editStartUrlRef.current = header.headshot?.url ?? null;
    }
    if (mode === "view") {
      editStartUrlRef.current = null;
      setPending(null);
      setImgError(null);
    }
  }, [mode, header.headshot?.url]);

  const contacts = [
    header.githubUrl ? { url: header.githubUrl, label: "GitHub" } : null,
    header.linkedinUrl ? { url: header.linkedinUrl, label: "LinkedIn" } : null,
    header.website ? { url: header.website, label: "Website" } : null,
  ].filter(Boolean) as { url: string; label: string }[];

  return (
    <Section<HeaderData>
      mode={mode}
      data={[header]}
      canAdd={false}
      canEdit={canEdit}
      emptyItem={() => ({
        name: "",
        title: "",
        email: "",
        headshot: null,
        githubUrl: "",
        linkedinUrl: "",
        website: "",
        summary: "",
      })}
      onSave={async (next) => {
        const curr = next[0] ?? header;
        const updated: HeaderData = { ...curr };

        try {
          if (pending) {
            const oldUrl = editStartUrlRef.current;
            if (oldUrl) {
              await deleteImageByUrl(oldUrl);
            }
            const img = await uploadImage(pending.file, {
              alt: pending.alt,
              width: pending.width || undefined,
              height: pending.height || undefined,
            });
            updated.headshot = img;
          }

          await onSave?.([updated]);

          setPending(null);
          setImgError(null);
          editStartUrlRef.current = null;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
          setImgError(
            e?.message || "Failed to save headshot. Please try again."
          );
          throw e;
        }
      }}
      onCancel={() => {
        setPending(null);
        setImgError(null);
        onCancel?.();
      }}
      onChangeMode={onChangeMode}
      renderViewItem={(item, index) => (
        <Box key={index}>
          <HStack align="center" gap={4} minW={0}>
            {item.headshot?.url && (
              <Image
                src={item.headshot.url}
                alt={item.headshot.alt ?? `${item.name} headshot`}
                boxSize="7em"
                objectFit="cover"
                borderRadius="full"
              />
            )}
            <Box minW={0} css={{ overflowWrap: "anywhere" }}>
              <Heading
                as="h3"
                size="md"
                lineHeight="short"
                letterSpacing="wide"
              >
                {item.name}
                {item.isDefault && (
                  <Text
                    as="span"
                    ml={2}
                    px={2}
                    py={0.5}
                    fontSize="xs"
                    borderRadius="md"
                    bg="green.50"
                    color="green.700"
                  >
                    Default
                  </Text>
                )}
              </Heading>

              {item.title ? (
                <Text fontSize="sm" color="fg.muted">
                  {item.title}
                </Text>
              ) : null}
              <Text mt={1}>
                <Text as="span" fontWeight="bold">
                  Email:
                </Text>{" "}
                <Link href={`mailto:${item.email}`} textDecoration="none">
                  {item.email}
                </Link>
              </Text>
              <HStack mt={2} gap={2} flexWrap="wrap">
                {contacts.length ? (
                  contacts.map((l, i) => (
                    <Link
                      key={`${l.url}-${i}`}
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      textDecoration="underline"
                      color={"var(--color-accent)"}
                      fontSize="sm"
                      mr={3}
                    >
                      {l.label}
                    </Link>
                  ))
                ) : (
                  <Text color="fg.muted" fontSize="sm">
                    No external links.
                  </Text>
                )}
              </HStack>
            </Box>
          </HStack>

          <Box
            mt={3}
            borderLeft="3px solid"
            borderColor="var(--color-accent)"
            pl={4}
          >
            {item.summary?.trim() ? (
              <Text lineHeight="tall">{item.summary.trim()}</Text>
            ) : (
              <Text color="fg.muted" fontStyle="italic">
                No summary provided.
              </Text>
            )}
          </Box>
        </Box>
      )}
      renderEditItem={(item, index, update) => {
        const preview = pending?.previewUrl || item.headshot?.url || "";
        return (
          <Box
            key={index}
            w="100%"
            borderLeft="3px solid"
            borderColor="var(--color-accent)"
            pl={4}
            pb={3}
            position="relative"
          >
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={3} mt={2}>
              <VStack gridColumn="1 / -1" gap={3}>
                <HStack w="100%" align="center" gap={3}>
                  <VStack mx="auto">
                    <Box
                      w="10em"
                      h="10em"
                      overflow="hidden"
                      borderRadius="full"
                      borderWidth="1px"
                      borderColor={imgError ? "red.500" : "border"}
                    >
                      {preview ? (
                        <Image
                          src={preview}
                          alt={pending?.alt ?? item.headshot?.alt ?? "Headshot"}
                          objectFit="cover"
                          w="100%"
                          h="100%"
                        />
                      ) : null}
                    </Box>

                    <ImageUpload
                      maxFiles={1}
                      onSelected={(drafts) => {
                        const d = drafts[0];
                        if (!d) return;
                        setPending(d);
                        setImgError(null);
                      }}
                    />

                    {imgError && (
                      <Text fontSize="sm" color="red.500" mt={1}>
                        {imgError}
                      </Text>
                    )}

                    <Text fontSize="xs" color="gray.500" mt={1}>
                      Replacing the photo will remove the current one from
                      storage on Save.
                    </Text>
                  </VStack>
                </HStack>
                <Checkbox.Root
                  size="sm"
                  checked={!!item.isDefault}
                  onCheckedChange={(d) => update(0, { isDefault: !!d.checked })}
                  mb={2}
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control>
                    <Checkbox.Indicator />
                  </Checkbox.Control>
                  <Checkbox.Label>Make this my default resume</Checkbox.Label>
                </Checkbox.Root>
              </VStack>

              <Field.Root required>
                <Field.Label>
                  Name <Field.RequiredIndicator />
                </Field.Label>
                <Input
                  value={item.name ?? ""}
                  placeholder="Your name"
                  onChange={(e) => update(0, { name: e.target.value })}
                />
              </Field.Root>

              <Field.Root>
                <Field.Label>Title</Field.Label>
                <Input
                  value={item.title ?? ""}
                  placeholder="e.g., Software Engineer"
                  onChange={(e) => update(0, { title: e.target.value })}
                />
              </Field.Root>

              <Field.Root required>
                <Field.Label>
                  Email <Field.RequiredIndicator />
                </Field.Label>
                <Input
                  value={item.email ?? ""}
                  placeholder="you@example.com"
                  onChange={(e) => update(0, { email: e.target.value })}
                />
              </Field.Root>

              <Box />

              <SimpleGrid
                columns={{ base: 1, md: 3 }}
                gap={3}
                gridColumn="1 / -1"
              >
                <Field.Root>
                  <Field.Label>GitHub URL</Field.Label>
                  <Input
                    value={item.githubUrl ?? ""}
                    placeholder="https://github.com/your-handle"
                    onChange={(e) => update(0, { githubUrl: e.target.value })}
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label>LinkedIn URL</Field.Label>
                  <Input
                    value={item.linkedinUrl ?? ""}
                    placeholder="https://linkedin.com/in/your-handle"
                    onChange={(e) => update(0, { linkedinUrl: e.target.value })}
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label>Website</Field.Label>
                  <Input
                    value={item.website ?? ""}
                    placeholder="https://your-site.com"
                    onChange={(e) => update(0, { website: e.target.value })}
                  />
                </Field.Root>
              </SimpleGrid>

              <Field.Root gridColumn="1 / -1">
                <Field.Label>Summary</Field.Label>
                <Textarea
                  value={item.summary ?? ""}
                  placeholder="Short professional summary"
                  onChange={(e) => update(0, { summary: e.target.value })}
                  h={{ base: "5em", md: "6.5em" }}
                  resize="vertical"
                />
              </Field.Root>
            </SimpleGrid>
          </Box>
        );
      }}
    />
  );
}

export function EducationSection({
  mode,
  education,
  onSave,
  onCancel,
  onChangeMode,
  canEdit,
}: {
  mode: SectionMode;
  education: Education[];
  onSave?: (next: Education[]) => void | Promise<void>;
  onCancel?: () => void;
  onChangeMode?: (m: SectionMode) => void;
  canEdit?: boolean;
}) {
  return (
    <Section<Education>
      mode={mode}
      title={<SectionHeader jp="エジュケーション" en="Education" />}
      data={education}
      canAdd
      canEdit={canEdit}
      emptyItem={(): Education => ({
        institution: "",
        degree: "",
        fieldOfStudy: "",
        startDate: "",
        endDate: "",
        location: "",
      })}
      onSave={onSave}
      onCancel={onCancel}
      onChangeMode={onChangeMode}
      renderViewItem={(item, index) => (
        <Box
          key={index}
          w="100%"
          borderLeft="3px solid"
          borderColor="var(--color-accent)"
          pl={4}
        >
          <Text fontSize="lg" fontWeight="bold">
            {item.institution}
          </Text>

          <Text
            fontSize="md"
            fontWeight="semibold"
            color={"var(--color-accent-alt)"}
          >
            {item.degree}
            {item.fieldOfStudy ? ` in ${item.fieldOfStudy}` : ""}
          </Text>

          <Text fontSize="sm" fontWeight="bold">
            {[
              [
                fmtMY(item.startDate),
                item.endDate ? fmtMY(item.endDate) : "Present",
              ]
                .filter(Boolean)
                .join(" – "),
              item.location,
            ]
              .filter(Boolean)
              .join(" · ")}
          </Text>
        </Box>
      )}
      renderEditItem={(item, index, update, remove) => (
        <Box
          key={index}
          w="100%"
          borderLeft="3px solid"
          borderColor="var(--color-accent)"
          pl={4}
          pb={3}
          position={"relative"}
        >
          <HStack justify="space-between" align="start">
            <Field.Root required>
              <Field.Label>
                Institution <Field.RequiredIndicator />
              </Field.Label>
              <Input
                resize={"vertical"}
                value={item.institution ?? ""}
                placeholder="Institution"
                onChange={(e) => update(index, { institution: e.target.value })}
              />
            </Field.Root>

            <IconButton
              position={"absolute"}
              aria-label="Remove education"
              variant="ghost"
              size="sm"
              onClick={() => remove(index)}
              top={-3}
              right={0}
            >
              <IoMdTrash />
            </IconButton>
          </HStack>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={3} mt={2}>
            <Field.Root required>
              <Field.Label>
                Degree <Field.RequiredIndicator />
              </Field.Label>
              <Input
                value={item.degree ?? ""}
                placeholder="Degree (e.g., B.S.)"
                onChange={(e) => update(index, { degree: e.target.value })}
              />
            </Field.Root>

            <Field.Root required>
              <Field.Label>
                Field of Study <Field.RequiredIndicator />
              </Field.Label>
              <Input
                value={item.fieldOfStudy ?? ""}
                placeholder="Field of study"
                onChange={(e) =>
                  update(index, { fieldOfStudy: e.target.value })
                }
              />
            </Field.Root>

            <SimpleGrid
              columns={{ base: 1, md: 3 }}
              gap={3}
              gridColumn="1 / -1"
            >
              <Field.Root required>
                <Field.Label>
                  Start Date <Field.RequiredIndicator />
                </Field.Label>
                <Input
                  type="month"
                  value={item.endDate}
                  onChange={(e) => update(index, { startDate: e.target.value })}
                />
                <Field.HelperText>Format: YYYY-MM-DD</Field.HelperText>
              </Field.Root>

              <Field.Root>
                <Field.Label>End Date</Field.Label>
                <Input
                  type="month"
                  value={item.endDate}
                  onChange={(e) => update(index, { endDate: e.target.value })}
                />
                <Field.HelperText>
                  Format: YYYY-MM-DD (empty = Present)
                </Field.HelperText>
              </Field.Root>

              <Field.Root>
                <Field.Label>Location</Field.Label>
                <Input
                  value={item.location ?? ""}
                  placeholder="Location"
                  onChange={(e) => update(index, { location: e.target.value })}
                />
              </Field.Root>
            </SimpleGrid>
          </SimpleGrid>
        </Box>
      )}
    />
  );
}
export function ExperienceSection({
  mode,
  experience,
  onSave,
  onCancel,
  onChangeMode,
  canEdit,
}: {
  mode: SectionMode;
  experience: Experience[];
  onSave?: (next: Experience[]) => void | Promise<void>;
  onCancel?: () => void;
  onChangeMode?: (m: SectionMode) => void;
  canEdit?: boolean;
}) {
  return (
    <Section<Experience>
      mode={mode}
      title={<SectionHeader jp="エクスペリエンス" en="Experience" />}
      data={experience}
      canAdd
      canEdit={canEdit}
      emptyItem={(): Experience => ({
        company: "",
        role: "",
        startDate: "",
        endDate: "",
        location: "",
        achievements: [],
        tech: [],
        links: [],
      })}
      onSave={onSave}
      onCancel={onCancel}
      onChangeMode={onChangeMode}
      renderViewItem={(item, index) => (
        <Box
          key={index}
          w="100%"
          borderLeft="3px solid"
          borderColor="var(--color-accent)"
          pl={4}
        >
          <Text fontSize="lg" fontWeight="bold">
            {item.company}
          </Text>
          <Text
            fontSize="md"
            fontWeight="semibold"
            color={"var(--color-accent-alt)"}
          >
            {item.role}
          </Text>
          <Text fontSize="sm" fontWeight="bold">
            {[
              [
                fmtMY(item.startDate),
                item.endDate ? fmtMY(item.endDate) : "Present",
              ]
                .filter(Boolean)
                .join(" – "),
              item.location,
            ]
              .filter(Boolean)
              .join(" · ")}
          </Text>

          {item.tech?.length ? (
            <Box>
              <Text fontSize="sm" color={"var(--color-accent-alt)"}>
                <Text as="span" fontWeight="bold">
                  Tech:
                </Text>{" "}
                {item.tech.join(" • ")}
              </Text>
            </Box>
          ) : null}

          {item.achievements?.length ? (
            <List.Root mt={2} gap={1} pl={4}>
              {item.achievements.map((a, j) => (
                <ListItem key={j} fontSize="sm">
                  {a}
                </ListItem>
              ))}
            </List.Root>
          ) : null}

          {item.links?.length ? (
            <Text mt={2} fontSize="xs">
              {item.links.map((l, j) => (
                <Link
                  as={Link}
                  key={j}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  mr={3}
                  textDecoration="underline"
                  color={"var(--color-accent)"}
                >
                  {l.label ?? l.url}
                </Link>
              ))}
            </Text>
          ) : null}
        </Box>
      )}
      renderEditItem={(item, index, update, remove) => (
        <Box
          key={index}
          w="100%"
          borderLeft="3px solid"
          borderColor="var(--color-accent)"
          pl={4}
          pb={3}
          position="relative"
        >
          <HStack justify="space-between" align="start">
            <Field.Root required>
              <Field.Label>
                Company <Field.RequiredIndicator />
              </Field.Label>
              <Input
                value={item.company ?? ""}
                placeholder="Company"
                onChange={(e) => update(index, { company: e.target.value })}
              />
            </Field.Root>

            <IconButton
              position="absolute"
              aria-label="Remove experience"
              variant="ghost"
              size="sm"
              onClick={() => remove(index)}
              top={-3}
              right={0}
            >
              <IoMdTrash />
            </IconButton>
          </HStack>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={3} mt={2}>
            <Field.Root required>
              <Field.Label>
                Role <Field.RequiredIndicator />
              </Field.Label>
              <Input
                value={item.role ?? ""}
                placeholder="Role / Title"
                onChange={(e) => update(index, { role: e.target.value })}
              />
            </Field.Root>

            <Field.Root>
              <Field.Label>Tech (comma-separated)</Field.Label>
              <Input
                value={item.tech?.join(", ") ?? ""}
                placeholder="React, Node, AWS"
                onChange={(e) =>
                  update(index, {
                    tech: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
              />
            </Field.Root>

            <SimpleGrid
              columns={{ base: 1, md: 3 }}
              gap={3}
              gridColumn="1 / -1"
            >
              <Field.Root required>
                <Field.Label>
                  Start Date <Field.RequiredIndicator />
                </Field.Label>
                <Input
                  type="month"
                  value={item.startDate ?? ""}
                  onChange={(e) => update(index, { startDate: e.target.value })}
                />
                <Field.HelperText>Format: YYYY-MM-DD</Field.HelperText>
              </Field.Root>

              <Field.Root>
                <Field.Label>End Date</Field.Label>
                <Input
                  type="month"
                  value={item.endDate ?? ""}
                  onChange={(e) => update(index, { endDate: e.target.value })}
                />
                <Field.HelperText>
                  Format: YYYY-MM-DD (empty = Present)
                </Field.HelperText>
              </Field.Root>

              <Field.Root>
                <Field.Label>Location</Field.Label>
                <Input
                  value={item.location ?? ""}
                  placeholder="Location"
                  onChange={(e) => update(index, { location: e.target.value })}
                />
              </Field.Root>
            </SimpleGrid>

            <Field.Root gridColumn="1 / -1">
              <Field.Label>Achievements</Field.Label>
              <VStack align="stretch" gap={2} mt={1} w={"100%"}>
                {item.achievements?.map((achievement, j) => (
                  <HStack key={j} align="start">
                    <Textarea
                      flex="1"
                      value={achievement}
                      placeholder="Achievement"
                      onChange={(e) => {
                        const achievements = [...item.achievements];
                        achievements[j] = e.target.value;
                        update(index, { achievements });
                      }}
                      h={{ base: "3em", sm: "5em" }}
                      resize={"none"}
                    />
                    <IconButton
                      aria-label="Remove achievement"
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        const achievements = item.achievements.filter(
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

            <SimpleGrid gridColumn="1 / -1">
              <Field.Root gridColumn="1 / -1">
                <Field.Label>Links</Field.Label>

                <VStack align="stretch" gap={2} mt={1} w={"100%"}>
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
            </SimpleGrid>
          </SimpleGrid>
        </Box>
      )}
    />
  );
}
export function ExtracurricularSection({
  mode,
  extracurricular,
  onSave,
  onCancel,
  onChangeMode,
  canEdit,
}: {
  mode: SectionMode;
  extracurricular: Extracurricular[];
  onSave?: (next: Extracurricular[]) => void | Promise<void>;
  onCancel?: () => void;
  onChangeMode?: (m: SectionMode) => void;
  canEdit?: boolean;
}) {
  return (
    <Section<Extracurricular>
      mode={mode}
      title={
        <SectionHeader jp="エクストラカリキュラー" en="Extracurriculars" />
      }
      data={extracurricular}
      canAdd
      canEdit={canEdit}
      emptyItem={() => ({
        company: "",
        role: "",
        startDate: "",
        endDate: "",
        description: "",
        achievements: [],
      })}
      onSave={onSave}
      onCancel={onCancel}
      onChangeMode={onChangeMode}
      renderViewItem={(item, index) => (
        <Box
          key={index}
          w="100%"
          borderLeft="3px solid"
          borderColor="var(--color-accent)"
          pl={4}
        >
          <Text fontSize="lg" fontWeight="bold">
            {item.company}
          </Text>

          <Text
            fontSize="md"
            fontWeight="semibold"
            color={"var(--color-accent-alt)"}
          >
            {item.role}
          </Text>

          <Text fontSize="sm" fontWeight="bold">
            {[
              [
                fmtMY(item.startDate),
                item.endDate ? fmtMY(item.endDate) : "Present",
              ]
                .filter(Boolean)
                .join(" – "),
            ]
              .filter(Boolean)
              .join(" · ")}
          </Text>

          {item.description ? (
            <Text mt={2} fontSize="sm">
              {item.description}
            </Text>
          ) : null}

          {item.achievements?.length ? (
            <List.Root mt={2} gap={1} pl={4}>
              {item.achievements.map((a, j) => (
                <ListItem key={j} fontSize="sm">
                  {a}
                </ListItem>
              ))}
            </List.Root>
          ) : null}
        </Box>
      )}
      renderEditItem={(item, index, update, remove) => (
        <Box
          key={index}
          w="100%"
          borderLeft="3px solid"
          borderColor="var(--color-accent)"
          pl={4}
          pb={3}
          position="relative"
        >
          <HStack justify="space-between" align="start">
            <Field.Root required>
              <Field.Label>
                Organization <Field.RequiredIndicator />
              </Field.Label>
              <Input
                value={item.company ?? ""}
                placeholder="Club / Organization"
                onChange={(e) => update(index, { company: e.target.value })}
              />
            </Field.Root>

            <IconButton
              position="absolute"
              aria-label="Remove extracurricular"
              variant="ghost"
              size="sm"
              onClick={() => remove(index)}
              top={-3}
              right={0}
            >
              <IoMdTrash />
            </IconButton>
          </HStack>

          <SimpleGrid columns={{ base: 2, md: 1 }} gap={3} mt={2}>
            <Field.Root required>
              <Field.Label>
                Role <Field.RequiredIndicator />
              </Field.Label>
              <Input
                value={item.role ?? ""}
                placeholder="Position / Title"
                onChange={(e) => update(index, { role: e.target.value })}
              />
            </Field.Root>

            <Field.Root>
              <Field.Label>Description</Field.Label>
              <Textarea
                value={item.description ?? ""}
                placeholder="Brief description"
                onChange={(e) => update(index, { description: e.target.value })}
                h={{ base: "5em", md: "5em" }}
                resize="vertical"
              />
            </Field.Root>

            <SimpleGrid columns={{ base: 2, md: 2 }} gap={3} gridColumn="1">
              <Field.Root required>
                <Field.Label>
                  Start Date <Field.RequiredIndicator />
                </Field.Label>
                <Input
                  type="month"
                  value={item.startDate ?? ""}
                  onChange={(e) => update(index, { startDate: e.target.value })}
                />
                <Field.HelperText>Format: YYYY-MM-DD</Field.HelperText>
              </Field.Root>

              <Field.Root>
                <Field.Label>End Date</Field.Label>
                <Input
                  type="month"
                  value={item.endDate ?? ""}
                  onChange={(e) => update(index, { endDate: e.target.value })}
                />
                <Field.HelperText>
                  Format: YYYY-MM-DD (empty = Present)
                </Field.HelperText>
              </Field.Root>
              <Box />
            </SimpleGrid>

            <Field.Root gridColumn="1 / -1">
              <Field.Label>Achievements</Field.Label>
              <VStack align="stretch" gap={2} mt={1} w="100%">
                {(item.achievements ?? []).map((achievement, j) => (
                  <HStack key={j} align="start">
                    <Textarea
                      flex="1"
                      value={achievement}
                      placeholder="Achievement"
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
          </SimpleGrid>
        </Box>
      )}
    />
  );
}
export function SkillsSection({
  mode,
  technicalSkills,
  onSave,
  onCancel,
  onChangeMode,
  canEdit,
}: {
  mode: SectionMode;
  technicalSkills: TechnicalSkills | null | undefined;
  onSave?: (next: TechnicalSkills[]) => void | Promise<void>;
  onCancel?: () => void;
  onChangeMode?: (m: SectionMode) => void;
  canEdit?: boolean;
}) {
  if (!technicalSkills) return null;

  const nonEmptyCategories = (s: TechnicalSkills) =>
    [
      { key: "languages", label: "Languages", items: s.languages },
      { key: "frameworks", label: "Frameworks", items: s.frameworks },
      { key: "databases", label: "Databases", items: s.databases },
      { key: "tools", label: "Tools", items: s.tools },
      { key: "other", label: "Other", items: s.other },
    ].filter((c) => c.items?.length);

  return (
    <Section<TechnicalSkills>
      mode={mode}
      title={<SectionHeader jp="テクニカルスキル" en="Technical Skills" />}
      data={[technicalSkills]}
      canAdd={false}
      canEdit={canEdit}
      emptyItem={() => ({
        languages: [],
        frameworks: [],
        databases: [],
        tools: [],
        other: [],
      })}
      onSave={onSave}
      onCancel={onCancel}
      onChangeMode={onChangeMode}
      renderViewItem={(item, index) => (
        <Box
          key={index}
          w="100%"
          borderLeft="3px solid"
          borderColor="var(--color-accent)"
          pl={4}
        >
          {nonEmptyCategories(item).map((category, i) => (
            <Box key={category.key + i} w="100%" mb={2}>
              <Text fontSize="lg" fontWeight="bold">
                {category.label}
              </Text>
              <Text fontSize="sm" color={"var(--color-accent-alt)"}>
                {category.items?.join(" • ")}
              </Text>
            </Box>
          ))}
        </Box>
      )}
      renderEditItem={(item, index, update) => {
        const rows: Array<{
          key: keyof TechnicalSkills;
          label: string;
          value: string[] | undefined;
          placeholder: string;
        }> = [
          {
            key: "languages",
            label: "Languages",
            value: item.languages,
            placeholder: "Add a language…",
          },
          {
            key: "frameworks",
            label: "Frameworks",
            value: item.frameworks,
            placeholder: "Add a framework…",
          },
          {
            key: "databases",
            label: "Databases",
            value: item.databases,
            placeholder: "Add a database…",
          },
          {
            key: "tools",
            label: "Tools",
            value: item.tools,
            placeholder: "Add a tool…",
          },
          {
            key: "other",
            label: "Other",
            value: item.other,
            placeholder: "Add another skill…",
          },
        ];

        return (
          <Box
            key={index}
            w="100%"
            borderLeft="3px solid"
            borderColor="var(--color-accent)"
            pl={4}
            pb={3}
          >
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={3} mt={2}>
              {rows.map(({ key, label, value, placeholder }) => (
                <Field.Root
                  key={String(key)}
                  gridColumn={{ base: "1 / -1", md: "auto" }}
                >
                  <Field.Label>{label}</Field.Label>

                  <TagInput
                    values={value ?? []}
                    placeholder={placeholder}
                    onChange={(next) =>
                      update(0, { [key]: next } as Partial<TechnicalSkills>)
                    }
                  />
                </Field.Root>
              ))}
            </SimpleGrid>
          </Box>
        );
      }}
    />
  );
}
export function VolunteerSection({
  mode,
  volunteerWork,
  onSave,
  onCancel,
  onChangeMode,
  canEdit,
}: {
  mode: SectionMode;
  volunteerWork: VolunteerWork[];
  onSave?: (next: VolunteerWork[]) => void | Promise<void>;
  onCancel?: () => void;
  onChangeMode?: (m: SectionMode) => void;
  canEdit?: boolean;
}) {
  return (
    <Section<VolunteerWork>
      mode={mode}
      title={<SectionHeader jp="ボランティアワーク" en="Volunteer Work" />}
      data={volunteerWork}
      canAdd
      canEdit={canEdit}
      emptyItem={() => ({
        organization: "",
        role: "",
        startDate: "",
        endDate: "",
        location: "",
        links: [],
      })}
      onSave={onSave}
      onCancel={onCancel}
      onChangeMode={onChangeMode}
      renderViewItem={(item, index) => (
        <Box
          key={index}
          w="100%"
          borderLeft="3px solid"
          borderColor="var(--color-accent)"
          pl={4}
        >
          <Text fontSize="lg" fontWeight="bold">
            {item.organization}
          </Text>

          <Text
            fontSize="md"
            fontWeight="semibold"
            color={"var(--color-accent-alt)"}
          >
            {item.role}
          </Text>

          <Text fontSize="sm" fontWeight="bold">
            {[
              [
                fmtMY(item.startDate),
                item.endDate ? fmtMY(item.endDate) : "Present",
              ]
                .filter(Boolean)
                .join(" – "),
              item.location,
            ]
              .filter(Boolean)
              .join(" · ")}
          </Text>

          {item.links?.length ? (
            <Text mt={2} fontSize="xs">
              {item.links.map((l, j) => (
                <Link
                  as={Link}
                  key={j}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  mr={3}
                  textDecoration="underline"
                  color={"var(--color-accent)"}
                >
                  {l.label ?? l.url}
                </Link>
              ))}
            </Text>
          ) : null}
        </Box>
      )}
      renderEditItem={(item, index, update, remove) => (
        <Box
          key={index}
          w="100%"
          borderLeft="3px solid"
          borderColor="var(--color-accent)"
          pl={4}
          pb={3}
          position="relative"
        >
          <HStack justify="space-between" align="start">
            <Field.Root required>
              <Field.Label>
                Organization <Field.RequiredIndicator />
              </Field.Label>
              <Input
                value={item.organization ?? ""}
                placeholder="Organization / Nonprofit"
                onChange={(e) =>
                  update(index, { organization: e.target.value })
                }
              />
            </Field.Root>

            <IconButton
              position="absolute"
              aria-label="Remove volunteer work"
              variant="ghost"
              size="sm"
              onClick={() => remove(index)}
              top={-3}
              right={0}
            >
              <IoMdTrash />
            </IconButton>
          </HStack>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={3} mt={2}>
            <Field.Root required>
              <Field.Label>
                Role <Field.RequiredIndicator />
              </Field.Label>
              <Input
                value={item.role ?? ""}
                placeholder="Volunteer Role / Title"
                onChange={(e) => update(index, { role: e.target.value })}
              />
            </Field.Root>
            <Field.Root>
              <Field.Label>Location</Field.Label>
              <Input
                value={item.location ?? ""}
                placeholder="Location"
                onChange={(e) => update(index, { location: e.target.value })}
              />
            </Field.Root>
            <Box />
            <SimpleGrid
              columns={{ base: 1, md: 2 }}
              gap={3}
              gridColumn="1 / -1"
            >
              <Field.Root required>
                <Field.Label>
                  Start Date <Field.RequiredIndicator />
                </Field.Label>
                <Input
                  type="month"
                  value={item.startDate ?? ""}
                  onChange={(e) => update(index, { startDate: e.target.value })}
                />
                <Field.HelperText>Format: YYYY-MM-DD</Field.HelperText>
              </Field.Root>

              <Field.Root>
                <Field.Label>End Date</Field.Label>
                <Input
                  type="month"
                  value={item.endDate ?? ""}
                  onChange={(e) => update(index, { endDate: e.target.value })}
                />
                <Field.HelperText>
                  Format: YYYY-MM-DD (empty = Present)
                </Field.HelperText>
              </Field.Root>
            </SimpleGrid>
            <SimpleGrid gridColumn="1 / -1">
              <Field.Root gridColumn="1 / -1">
                <Field.Label>Links</Field.Label>

                <VStack align="stretch" gap={2} mt={1} w={"100%"}>
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
            </SimpleGrid>
          </SimpleGrid>
        </Box>
      )}
    />
  );
}
export function CertificationsSection({
  mode,
  certifications,
  onSave,
  onCancel,
  onChangeMode,
  canEdit,
}: {
  mode: SectionMode;
  certifications: Certification[];
  onSave?: (next: Certification[]) => void | Promise<void>;
  onCancel?: () => void;
  onChangeMode?: (m: SectionMode) => void;
  canEdit?: boolean;
}) {
  return (
    <Section<Certification>
      mode={mode}
      title={<SectionHeader jp="サーティフィケーション" en="Certifications" />}
      data={certifications}
      canAdd
      canEdit={canEdit}
      emptyItem={() => ({
        name: "",
        issuer: "",
        issueDate: "",
        credentialId: "",
        credentialUrl: "",
        summary: "",
        links: [],
      })}
      onSave={onSave}
      onCancel={onCancel}
      onChangeMode={onChangeMode}
      renderViewItem={(item, index) => (
        <Box
          key={index}
          w="100%"
          borderLeft="3px solid"
          borderColor="var(--color-accent)"
          pl={4}
        >
          <Text fontSize="lg" fontWeight="bold">
            {item.name}
          </Text>

          <Text
            fontSize="md"
            fontWeight="semibold"
            color={"var(--color-accent-alt)"}
          >
            {item.issuer}
          </Text>

          <Text fontSize="xs">
            {item.credentialId
              ? `Credential ID: ${item.credentialId} · ${fmtMY(item.issueDate)}`
              : fmtMY(item.issueDate)}
          </Text>

          {item.summary ? (
            <Text fontSize="sm" mt={1}>
              {item.summary}
            </Text>
          ) : null}

          {item.links?.length ? (
            <Text mt={2} fontSize="xs">
              {item.links.map((l, j) => (
                <Link
                  as={Link}
                  key={j}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  mr={3}
                  textDecoration="underline"
                  color={"var(--color-accent)"}
                >
                  {l.label ?? l.url}
                </Link>
              ))}
            </Text>
          ) : null}
        </Box>
      )}
      renderEditItem={(item, index, update, remove) => (
        <Box
          key={index}
          w="100%"
          borderLeft="3px solid"
          borderColor="var(--color-accent)"
          pl={4}
          pb={3}
          position="relative"
        >
          <HStack justify="space-between" align="start">
            <Field.Root required>
              <Field.Label>
                Certification Name <Field.RequiredIndicator />
              </Field.Label>
              <Input
                value={item.name ?? ""}
                placeholder="Certificate name"
                onChange={(e) => update(index, { name: e.target.value })}
              />
            </Field.Root>

            <IconButton
              position="absolute"
              aria-label="Remove certification"
              variant="ghost"
              size="sm"
              onClick={() => remove(index)}
              top={-3}
              right={0}
            >
              <IoMdTrash />
            </IconButton>
          </HStack>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={3} mt={2}>
            <Field.Root required>
              <Field.Label>
                Issuer <Field.RequiredIndicator />
              </Field.Label>
              <Input
                value={item.issuer ?? ""}
                placeholder="Issuing organization"
                onChange={(e) => update(index, { issuer: e.target.value })}
              />
            </Field.Root>

            <Field.Root>
              <Field.Label>Summary</Field.Label>
              <Textarea
                value={item.summary ?? ""}
                placeholder="Optional summary"
                onChange={(e) => update(index, { summary: e.target.value })}
                h={{ base: "5em", md: "5em" }}
                resize="vertical"
              />
            </Field.Root>
            <SimpleGrid
              columns={{ base: 1, md: 3 }}
              gap={3}
              gridColumn="1 / -1"
            >
              <Field.Root required>
                <Field.Label>
                  Issue Date <Field.RequiredIndicator />
                </Field.Label>
                <Input
                  type="month"
                  value={item.issueDate ?? ""}
                  onChange={(e) => update(index, { issueDate: e.target.value })}
                />
                <Field.HelperText>Format: YYYY-MM-DD</Field.HelperText>
              </Field.Root>

              <Field.Root>
                <Field.Label>Credential ID</Field.Label>
                <Input
                  value={item.credentialId ?? ""}
                  placeholder="e.g., ABC-12345"
                  onChange={(e) =>
                    update(index, { credentialId: e.target.value })
                  }
                />
              </Field.Root>

              <Field.Root>
                <Field.Label>Credential URL</Field.Label>
                <Input
                  value={item.credentialUrl ?? ""}
                  placeholder="https://verify.example.com/abc"
                  onChange={(e) =>
                    update(index, { credentialUrl: e.target.value })
                  }
                />
              </Field.Root>
            </SimpleGrid>

            <SimpleGrid gridColumn="1 / -1">
              <Field.Root gridColumn="1 / -1">
                <Field.Label>Links</Field.Label>
                <VStack align="stretch" gap={2} mt={1} w={"100%"}>
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
            </SimpleGrid>
          </SimpleGrid>
        </Box>
      )}
    />
  );
}
export function AwardsSection({
  mode,
  awards,
  onSave,
  onCancel,
  onChangeMode,
  canEdit,
}: {
  mode: SectionMode;
  awards: Award[];
  onSave?: (next: Award[]) => void | Promise<void>;
  onCancel?: () => void;
  onChangeMode?: (m: SectionMode) => void;
  canEdit?: boolean;
}) {
  return (
    <Section<Award>
      mode={mode}
      title={<SectionHeader jp="アワード" en="Awards" />}
      data={awards}
      canAdd
      canEdit={canEdit}
      emptyItem={() => ({
        title: "",
        organization: "",
        date: "",
        summary: "",
        links: [],
      })}
      onSave={onSave}
      onCancel={onCancel}
      onChangeMode={onChangeMode}
      renderViewItem={(item, index) => (
        <Box
          key={index}
          w="100%"
          borderLeft="3px solid"
          borderColor="var(--color-accent)"
          pl={4}
        >
          <Text fontSize="lg" fontWeight="bold">
            {item.title}
          </Text>

          {item.organization ? (
            <Text
              fontSize="md"
              fontWeight="semibold"
              color={"var(--color-accent-alt)"}
            >
              {item.organization}
            </Text>
          ) : null}

          <Text fontSize="sm" fontWeight="bold">
            {fmtMY(item.date)}
          </Text>

          {item.summary ? (
            <Text fontSize="sm" mt={1}>
              {item.summary}
            </Text>
          ) : null}

          {item.links?.length ? (
            <Text mt={1} fontSize="xs">
              {item.links.map((l, j) => (
                <Link
                  as={Link}
                  key={j}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  mr={3}
                  textDecoration="underline"
                  color={"var(--color-accent)"}
                >
                  {l.label ?? l.url}
                </Link>
              ))}
            </Text>
          ) : null}
        </Box>
      )}
      renderEditItem={(item, index, update, remove) => (
        <Box
          key={index}
          w="100%"
          borderLeft="3px solid"
          borderColor="var(--color-accent)"
          pl={4}
          pb={3}
          position="relative"
        >
          <HStack justify="space-between" align="start">
            <Field.Root required>
              <Field.Label>
                Award Title <Field.RequiredIndicator />
              </Field.Label>
              <Input
                value={item.title ?? ""}
                placeholder="Award title"
                onChange={(e) => update(index, { title: e.target.value })}
              />
            </Field.Root>

            <IconButton
              position="absolute"
              aria-label="Remove award"
              variant="ghost"
              size="sm"
              onClick={() => remove(index)}
              top={-3}
              right={0}
            >
              <IoMdTrash />
            </IconButton>
          </HStack>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={3} mt={2}>
            <Field.Root>
              <Field.Label>Organization</Field.Label>
              <Input
                value={item.organization ?? ""}
                placeholder="Awarding organization"
                onChange={(e) =>
                  update(index, { organization: e.target.value })
                }
              />
            </Field.Root>

            <Field.Root required>
              <Field.Label>
                Date <Field.RequiredIndicator />
              </Field.Label>
              <Input
                type="month"
                value={item.date ?? ""}
                onChange={(e) => update(index, { date: e.target.value })}
              />
              <Field.HelperText>Format: YYYY-MM-DD</Field.HelperText>
            </Field.Root>

            <Field.Root gridColumn="1 / -1">
              <Field.Label>Summary</Field.Label>
              <Textarea
                value={item.summary ?? ""}
                placeholder="Optional summary"
                onChange={(e) => update(index, { summary: e.target.value })}
                h={{ base: "5em", md: "5em" }}
                resize="vertical"
              />
            </Field.Root>

            <SimpleGrid gridColumn="1 / -1">
              <Field.Root gridColumn="1 / -1">
                <Field.Label>Links</Field.Label>
                <VStack align="stretch" gap={2} mt={1} w={"100%"}>
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
            </SimpleGrid>
          </SimpleGrid>
        </Box>
      )}
    />
  );
}
