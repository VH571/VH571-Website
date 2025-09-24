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
} from "@chakra-ui/react";
import "@/styles/bootstrap-carousel.scss";
import { Project } from "@/models/project";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import Carousel from "react-bootstrap/Carousel";
import "@/styles/bootstrap-carousel.scss";
import React, { useState, useMemo } from "react";
import NextLink from "next/link";
import { HiFolder, HiOutlineExternalLink } from "react-icons/hi";
import { ImageCarousel } from "./ImageCarousel";
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
    return <Box>No projects found.</Box>;
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

export function ProjectSection({ p }: { p: Project }) {
  const primaryLink = Array.isArray(p.links) ? p.links[0] : undefined;

  return (
    <VStack
      px={{ base: 4, md: 8 }}
      py={8}
      maxW="3xl"
      mx="auto"
      align="stretch"
      gap={4}
    >
      <AccentBlock>
        <Heading size="lg" color="var(--color-fg)" title={p.name}>
          {p.name}
        </Heading>
        {p.role ? (
          <Text mt={1} color="var(--color-accent-alt)" fontWeight="semibold">
            {p.role}
          </Text>
        ) : null}
      </AccentBlock>

      {Array.isArray(p.screenshots) && p.screenshots.length > 0 ? (
        <AccentBlock>
          <Box
            border="1px solid"
            borderColor="blackAlpha.200"
            borderRadius="md"
            overflow="hidden"
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
      <ChakraLink as={NextLink} href="/portfolio" mx={"auto"}>
        <Button
          size="sm"
          variant="ghost"
          color="var(--color-accent)"
          _hover={{ bg: "var(--color-accent)", color: "var(--color-bg)" }}
        >
          Back to Portfolio
        </Button>
      </ChakraLink>
    </VStack>
  );
}
