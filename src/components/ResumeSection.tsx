import { Box, Text, VStack, Link, List, ListItem } from "@chakra-ui/react";
import {
  Education,
  Extracurricular,
  TechnicalSkills,
  Experience,
  VolunteerWork,
  Certification,
  Award,
} from "@/models/resume";

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

export function EducationSection({ education }: Props) {
  if (!education?.length) return null;
  return (
    <Box
      as="section"
      mb={10}
      display="inline-block"
      w="100%"
      //verticalAlign="top"
    >
      <SectionHeader jp="エジュケーション" en="Education" />

      <VStack align="start" gap={2}>
        {education?.map((item, index) => (
          <Box
            key={index}
            w="100%"
            borderLeft="3px solid"
            borderColor="var(--color-accent)"
            pl={4}
          >
            <Text fontSize="lg" fontWeight="bold" letterSpacing="1px">
              {item.institution}
            </Text>

            <Text
              fontSize="md"
              fontWeight="semibold"
              color={"var(--color-accent-alt)"}
            >
              {item.degree} {item.fieldOfStudy ? `in ${item.fieldOfStudy}` : ""}
            </Text>

            <Text fontSize="sm" fontWeight="bold">
              {[
                item.location,
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
          </Box>
        ))}
      </VStack>
    </Box>
  );
}

export function ExperienceSection({ experience }: Props) {
  if (!experience?.length) return null;
  return (
    <Box
      as="section"
      mb={10}
      display="inline-block"
      w="100%"
      //verticalAlign="top"
    >
      <SectionHeader jp="エクスペリエンス" en="Experience" />
      <VStack align="start" gap={2}>
        {experience.map((item, index) => (
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
                item.location,
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
        ))}
      </VStack>
    </Box>
  );
}

export function ExtracurricularSection({ extracurricular }: Props) {
  if (!extracurricular?.length) return null;
  return (
    <Box
      as="section"
      mb={10}
      display="inline-block"
      w="100%"
      //verticalAlign="top"
    >
      <SectionHeader jp="エクストラカリキュラー" en="Extra Curriculars" />
      <VStack align="start" gap={2}>
        {extracurricular.map((item, index) => (
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
                fmtMY(item.startDate),
                item.endDate ? fmtMY(item.endDate) : "Present",
              ]
                .filter(Boolean)
                .join(" – ")}
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
        ))}
      </VStack>
    </Box>
  );
}

export function SkillsSection({ technicalSkills }: Props) {
  if (!technicalSkills) return null;

  const skillCategories = [
    { label: "Languages", items: technicalSkills.languages },
    { label: "Frameworks", items: technicalSkills.frameworks },
    { label: "Databases", items: technicalSkills.databases },
    { label: "Tools", items: technicalSkills.tools },
    { label: "Other", items: technicalSkills.other },
  ].filter((category) => category.items?.length);

  return (
    <Box as="section" 
      mb={10} 
      w="100%" 
      //verticalAlign="top"
      >
      <SectionHeader jp="テクニカルスキル" en="Technical Skills" />
      <VStack align="start" gap={2}>
        <Box borderLeft="3px solid" borderColor="var(--color-accent)" pl={4}>
          {skillCategories.map((category, index) => (
            <Box key={index} w="100%">
              <Text fontSize="lg" fontWeight="bold">
                {category.label}
              </Text>
              <Text fontSize="sm" color={"var(--color-accent-alt)"}>
                {category.items?.join(" • ")}
              </Text>
            </Box>
          ))}
        </Box>
      </VStack>
    </Box>
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
                item.location,
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
      //display="inline-block"
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
