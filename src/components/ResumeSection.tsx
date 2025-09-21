"use client";
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
  Editable,
  Checkbox,
  Button,
  Textarea,
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
import { IoMdTrash } from "react-icons/io";
import { Section, SectionMode } from "./Section";
import { InlineEditableText } from "./InLineEditable";

const fmtMY = (s?: string) => {
  if (!s) return undefined;
  const d = new Date(s);
  return Number.isNaN(d.valueOf())
    ? s
    : d
        .toLocaleString("en-US", { month: "short", year: "numeric" })
        .toUpperCase();
};
type SectionHeaderProps = {
  jp: string;
  en: string;
};
export function SectionHeader({ jp, en }: SectionHeaderProps) {
  return (
    <Box
      borderBottom="2px solid"
      borderColor={"var(--color-accent)"}
      pb={2}
      w="100%"
      lineHeight={"1"}
    >
      <Text fontSize="lg" color={"var(--color-accent-alt)"}>
        {jp}
      </Text>
      <Text
        fontWeight="bold"
        fontSize="4xl"
        textTransform="uppercase"
        letterSpacing="wider"
      >
        {en}
      </Text>
    </Box>
  );
}

type Props = {
  education?: Education[];
  extracurricular?: Extracurricular[];
  technicalSkills?: TechnicalSkills;
  experience?: Experience[];
  volunteerWork?: VolunteerWork[];
  certifications?: Certification[];
  awards?: Award[];
};

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
                <Field.HelperText>Format: YYYY-MM</Field.HelperText>
              </Field.Root>

              <Field.Root>
                <Field.Label>End Date</Field.Label>
                <Input
                  type="month"
                  value={item.endDate ?? ""}
                  onChange={(e) => update(index, { endDate: e.target.value })}
                />
                <Field.HelperText>
                  Format: YYYY-MM (empty = Present)
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
      /* ---------- VIEW MODE ---------- */
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
      /* ---------- EDIT MODE ---------- */
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
                <Field.HelperText>Format: YYYY-MM</Field.HelperText>
              </Field.Root>

              <Field.Root>
                <Field.Label>End Date</Field.Label>
                <Input
                  type="month"
                  value={item.endDate ?? ""}
                  onChange={(e) => update(index, { endDate: e.target.value })}
                />
                <Field.HelperText>
                  Format: YYYY-MM (empty = Present)
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
      renderViewItem={(item) => (
        <Box
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
      renderEditItem={(item, _index, update ) => {
        const setAt = (arr: string[] | undefined, idx: number, val: string) => {
          const next = [...(arr ?? [])];
          next[idx] = val;
          return next;
        };
        const removeAt = (arr: string[] | undefined, idx: number) =>
          (arr ?? []).filter((_, i) => i !== idx);
        const addOne = (arr: string[] | undefined) => [...(arr ?? []), ""];

        const rows: Array<{
          key: keyof TechnicalSkills;
          label: string;
          value: string[] | undefined;
        }> = [
          { key: "languages", label: "Languages", value: item.languages },
          { key: "frameworks", label: "Frameworks", value: item.frameworks },
          { key: "databases", label: "Databases", value: item.databases },
          { key: "tools", label: "Tools", value: item.tools },
          { key: "other", label: "Other", value: item.other },
        ];

        return (
          <Box
            w="100%"
            borderLeft="3px solid"
            borderColor="var(--color-accent)"
            pl={4}
            pb={3}
          >
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={3} mt={2}>
              {rows.map(({ key, label, value }) => (
                <Field.Root
                  key={String(key)}
                  gridColumn={{ base: "1 / -1", md: "auto" }}
                >
                  <Field.Label>{label}</Field.Label>

                  <VStack align="stretch" gap={2} mt={1} w="100%">
                    {(value ?? []).map((skill, j) => (
                      <HStack key={j} align="start">
                        <Input
                          flex="1"
                          value={skill}
                          placeholder={`${label.slice(0, -1)} (e.g., TypeScript)`}
                          onChange={(e) =>
                            update(0, {
                              [key]: setAt(value, j, e.target.value),
                            } as Partial<TechnicalSkills>)
                          }
                        />
                        <IconButton
                          aria-label={`Remove ${label} item`}
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            update(0, {
                              [key]: removeAt(value, j),
                            } as Partial<TechnicalSkills>)
                          }
                        >
                          <IoMdTrash />
                        </IconButton>
                      </HStack>
                    ))}

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        update(0, {
                          [key]: addOne(value),
                        } as Partial<TechnicalSkills>)
                      }
                    >
                      + Add {label.slice(0, -1)}
                    </Button>
                  </VStack>
                </Field.Root>
              ))}
            </SimpleGrid>
          </Box>
        );
      }}
    />
  );
}

export function VolunteerSection({ volunteerWork }: Props) {
  if (!volunteerWork?.length) return null;
  return (
    <Box
      as="section"
      mb={10}
      display="inline-block"
      w="100%"
      //verticalAlign="top"
    >
      <SectionHeader jp="ボランティアワーク" en="Volunteer Work" />

      <VStack align="start" gap={2}>
        {volunteerWork.map((item, index) => (
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
        ))}
      </VStack>
    </Box>
  );
}

export function CertificationsSection({ certifications }: Props) {
  if (!certifications?.length) return null;
  return (
    <Box
      as="section"
      mb={10}
      display="inline-block"
      w="100%"
      //verticalAlign="top"
    >
      <SectionHeader jp="サーティフィケーション" en="Certifications" />
      <VStack align="start" gap={2}>
        {certifications.map((item, index) => (
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
                ? `Credential ID: ${item.credentialId} ·  ${fmtMY(
                    item.issueDate
                  )}`
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
        ))}
      </VStack>
    </Box>
  );
}

export function AwardsSection({ awards }: Props) {
  if (!awards?.length) return null;
  return (
    <Box
      as="section"
      mb={10}
      display="inline-block"
      w="100%"
      //verticalAlign="top"
    >
      <SectionHeader jp="アワード" en="Awards" />

      <VStack align="start" gap={2}>
        {awards.map((item, index) => (
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
        ))}
      </VStack>
    </Box>
  );
}
