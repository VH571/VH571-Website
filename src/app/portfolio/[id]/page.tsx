import NextLink from "next/link";
import { ImageCarousel } from "@/components/ImageCarousel";
import { getProjectByID } from "@/lib/projectService";
import { Project } from "@/models/project";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Link as CLink,
  Tag,
  TagLabel,
  Image,
} from "@chakra-ui/react";

type ProjectResult = Project | { error: string };
type Params = { params: { id: string } };

export default async function PortfolioIDPage({ params }: Params) {
  let project: ProjectResult;
  const { id } = params;
  try {
    project = await getProjectByID(id);
  } catch (err) {
    throw new Error(`Could not fetch Project. ${(err as Error).message}`);
  }

  if (!project || "error" in project) {
    throw new Error(project?.error ?? "Project not found.");
  }
  const p = project as Project;

  return (
    <Box>
      <VStack
        px={{ base: 4, md: 8 }}
        py={8}
        maxW="3xl"
        mx="auto"
        align="stretch"
        gap={3}
      >
        {p.screenshots ? (
          <ImageCarousel name={p.name} screenshots={p.screenshots} />
        ) : (
          <Text fontStyle="italic" color="gray.500" fontSize={"sm"}>
            No screenshots available.
          </Text>
        )}
        <Box>
          <Heading size="lg" color="var(--color-fg)">
            {p.name}
          </Heading>
          <Text mt={1} color="gray.600">
            {p.role}
          </Text>
        </Box>
        <Box>
          <Heading size="md" mb={1} color="var(--color-fg)">
            Description
          </Heading>
          {p.description ? (
            <Text color="gray.700" fontSize={"sm"}>
              {p.description}
            </Text>
          ) : (
            <Text fontStyle="italic" color="gray.500" fontSize={"sm"}>
              No description available.
            </Text>
          )}
        </Box>

        <Box>
          <Heading size="md" mb={1} color="var(--color-fg)">
            Tech Stack
          </Heading>
          {Array.isArray(p.tech) && p.tech.length > 0 ? (
            <HStack flexWrap="wrap" gap={2}>
              {p.tech.map((t, i) => (
                <Tag.Root
                  key={`${t}-${i}`}
                  size="sm"
                  variant="subtle"
                  bg="var(--color-fg)"
                  color="var(--palette-seashell)"
                >
                  <TagLabel>{t}</TagLabel>
                </Tag.Root>
              ))}
            </HStack>
          ) : (
            <Text fontSize="sm" color="gray.500" fontStyle="italic">
              No tech listed.
            </Text>
          )}
        </Box>

        <Box>
          <Heading size="md" mb={1} color="var(--color-fg)">
            Achievements
          </Heading>
          {Array.isArray(p.achievements) && p.achievements.length > 0 ? (
            <VStack as="ul" pl={4} align="start" gap={0} color="gray.700">
              {p.achievements.map((a, i) => (
                <Text as="li" key={`${a}-${i}`} fontSize={"sm"}>
                  {a}
                </Text>
              ))}
            </VStack>
          ) : (
            <Text fontSize="sm" color="gray.500" fontStyle="italic">
              No achievements listed.
            </Text>
          )}
        </Box>

        <HStack flexWrap="wrap" gap={3}>
          {Array.isArray(p.links) && p.links.length > 0 ? (
            p.links.map((l, i) => {
              const isExternal = /^https?:\/\//i.test(l.url);
              return (
                <CLink
                  as={NextLink}
                  key={`${l.url}-${i}`}
                  href={l.url}
                  {...(isExternal ? { isExternal: true } : {})}
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
                </CLink>
              );
            })
          ) : (
            <Text fontSize="sm" color="gray.500" fontStyle="italic">
              No links provided.
            </Text>
          )}

          <CLink as={NextLink} href="/portfolio">
            <Button
              size="sm"
              variant="solid"
              bg={"var(--color-accent)"}
              color={"var(--color-bg)"}
            >
              Back to Portfolio
            </Button>
          </CLink>
        </HStack>
      </VStack>
    </Box>
  );
}
