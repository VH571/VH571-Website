import {
  Box,
  Drawer,
  Portal,
  Heading,
  Text,
  Stack,
  Wrap,
  HStack,
  Link,
  Tag,
  CloseButton,
  Button,
  Image,
  VisuallyHidden,
  BoxProps,
} from "@chakra-ui/react";
import { HiOutlineExternalLink } from "react-icons/hi";
import * as React from "react";
import { Project } from "@/models/project";
import { useRouter } from "next/router";
import { ImageCarousel } from "./ImageCarousel";

type SectionProps = { title: string; children: React.ReactNode };
const Section = ({ title, children, ...rest }: SectionProps & BoxProps) => {
  return (
    <Box {...rest}>
      <Heading as="h3" size="sm" letterSpacing="wide" mb={1}>
        {title}
      </Heading>
      {children}
    </Box>
  );
};

function Muted({ children }: { children: React.ReactNode }) {
  return (
    <Text opacity={0.72} fontStyle="italic">
      {children}
    </Text>
  );
}

export default function ProjectPortal({
  project,
  containerRef,
  bodyRef,
}: {
  project: Project;
  containerRef?: React.RefObject<HTMLElement> | null;
  bodyRef: React.RefObject<HTMLDivElement>;
}) {
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
            <Drawer.Header
              as="header"
              top={0}
              zIndex={1}
              px={{ base: 3, md: 5 }}
              py={{ base: 3, md: 5 }}
              borderBottom="1px solid"
              borderColor="blackAlpha.200"
            >
              <Box pr={8}>
                <Heading
                  id="project-title"
                  as="h2"
                  size="md"
                  lineHeight="short"
                  letterSpacing="wide"
                >
                  {project.name}
                </Heading>
                <Text mt={1} fontSize="sm" color="fg.muted">
                  {project.role}
                </Text>
              </Box>

              <Drawer.CloseTrigger asChild>
                <CloseButton
                  position="absolute"
                  top="10px"
                  right="10px"
                  size="sm"
                  borderRadius="0"
                  _focusVisible={{
                    boxShadow: "0 0 0 2px var(--color-accent)",
                  }}
                />
              </Drawer.CloseTrigger>
            </Drawer.Header>

            <Drawer.Body
              borderBottom="1px solid"
              borderColor={"var(--color-accent)"}
              px={{ base: 3, md: 5 }}
              py={{ base: 3, md: 4 }}
            >
              {project.screenshots?.length ? (
                <Box maxW="500px" mx={"auto"}>
                  <ImageCarousel
                    name={project.name}
                    screenshots={project.screenshots}
                  />
                </Box>
              ) : null}

              <Stack gap={1}>
                {/* About Section */}
                <Section
                  title="About"
                  mt={3}
                  borderLeft="3px solid"
                  borderColor="var(--color-accent)"
                  pl={4}
                >
                  {project.description?.trim() ? (
                    <Text>{project.description.trim()}</Text>
                  ) : (
                    <Muted>No description provided.</Muted>
                  )}
                </Section>
                {/* Tech Section */}
                <Section
                  title="Tech"
                  mt={3}
                  borderLeft="3px solid"
                  borderColor="var(--color-accent)"
                  pl={4}
                >
                  {(() => {
                    const techClean = Array.isArray(project.tech)
                      ? project.tech.filter((t) => t && t.trim().length > 0)
                      : [];

                    return techClean.length > 0 ? (
                      <Text>{techClean.join(" • ")}</Text>
                    ) : (
                      <Muted>No tech listed.</Muted>
                    );
                  })()}
                </Section>

                {/* Achivements */}
                <Section
                  title="Key Achievements"
                  mt={3}
                  borderLeft="3px solid"
                  borderColor="var(--color-accent)"
                  pl={4}
                >
                  {project.achievements?.length ? (
                    <Stack as="ul" gap={2} pl={5} lineHeight="shorter">
                      {project.achievements.map((a, i) => (
                        <Box as="li" key={i}>
                          {a}
                        </Box>
                      ))}
                    </Stack>
                  ) : (
                    <Muted>No achievements added yet.</Muted>
                  )}
                </Section>
                {/* Links */}
                <Section
                  title="Links"
                  mt={3}
                  borderLeft="3px solid"
                  borderColor="var(--color-accent)"
                  pl={4}
                >
                  {project.links?.length ? (
                    <HStack gap={1}>
                      {project.links.map((l, i) => {
                        const label =
                          l.label?.trim() ||
                          (() => {
                            try {
                              return new URL(l.url).hostname.replace(
                                /^www\./,
                                ""
                              );
                            } catch {
                              return l.url;
                            }
                          })();

                        return (
                          <Tag.Root
                            key={`${l.url}-${i}`}
                            asChild
                            borderRadius="0px"
                            _hover={{
                              bg: "var(--color-accent)",
                              color: "var(--color-seashell)",
                            }}
                            height="30px"
                            p={"2"}
                          >
                            <Tag.Label>
                              <Link
                                href={l.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <VisuallyHidden>Open </VisuallyHidden>
                                {label}
                                <HiOutlineExternalLink />
                              </Link>
                            </Tag.Label>
                          </Tag.Root>
                        );
                      })}
                    </HStack>
                  ) : (
                    <Muted>No external links.</Muted>
                  )}
                </Section>
              </Stack>
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Box>
  );
}
