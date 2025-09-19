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
      <Heading as="h3" size="sm" letterSpacing="wide" mb={2}>
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
              position="sticky"
              top={0}
              zIndex={1}
              borderBottom="1px solid"
              borderColor={"var(--color-accent)"}
              px={{ base: 3, md: 5 }}
              py={{ base: 2, md: 3 }}
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

              <Box
                display="grid"
                gridTemplateColumns={{ base: "1fr", md: "1fr 280px" }}
                gap={{ base: 4, md: 6 }}
                alignItems="start"
              >
                <Stack gap={4}>
                  {/* About Section */}
                  <Section title="About">
                    {project.description?.trim() ? (
                      <Text>{project.description.trim()}</Text>
                    ) : (
                      <Muted>No description provided.</Muted>
                    )}
                  </Section>
                  {/* Tech Section */}
                  <Section title="Tech">
                    {project.tech?.length ? (
                      <Wrap gap="6px">
                        {project.tech.map((t, i) => (
                          <Tag.Root
                            key={`${t}-${i}`}
                            variant="subtle"
                            border="1px solid"
                            borderColor="border"
                            borderRadius="0"
                            px={2}
                            py={1}
                          >
                            <Tag.Label fontSize="sm" letterSpacing="wide">
                              {t}
                            </Tag.Label>
                          </Tag.Root>
                        ))}
                      </Wrap>
                    ) : (
                      <Muted>No technologies listed.</Muted>
                    )}
                  </Section>
                  {/* Achivements */}
                  <Section title="Key Achievements">
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
                  <Section title="Links">
                    {project.links?.length ? (
                      <HStack gap={2}>
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
                              borderRadius="2px"
                              _hover={{
                                bg: "var(--color-accent)",
                                color: "var(--color-seashell)",
                              }}
                              height="36px"
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
                                </Link>
                              </Tag.Label>
                              <Tag.EndElement>
                                <HiOutlineExternalLink />
                              </Tag.EndElement>
                            </Tag.Root>
                          );
                        })}
                      </HStack>
                    ) : (
                      <Muted>No external links.</Muted>
                    )}
                  </Section>
                </Stack>
              </Box>
            </Drawer.Body>

            <Drawer.Footer
              borderBottom="1px solid"
              borderColor={"var(--color-accent)"}
              px={{ base: 3, md: 5 }}
              py={{ base: 2, md: 3 }}
            />
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Box>
  );
}
