"use client";
import React, { useState } from "react";
import NextLink from "next/link";
import { Project } from "@/models/project";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";
import {
  Box,
  Image,
  Card,
  Button,
  Link as ChakraLink,
  SimpleGrid,
  HStack,
  IconButton,
  Pagination,
  ButtonGroup,
  VStack,
  Tag,
  Text,
} from "@chakra-ui/react";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Card.Root
      maxW="md"
      variant={"elevated"}
      overflow={"hidden"}
      bg={"none"}
    >
      <Image
        src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?..."
        alt="Green double couch with wooden legs"
        h="175px"
        w="full"
        objectFit="cover"
      />

      <Card.Body gap="2">
        <Card.Title color={"var(--color-fg)"}>{project.name}</Card.Title>
        <Card.Description
          display="-webkit-box"
          overflow="hidden"
          textOverflow="ellipsis"
          style={{
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2,
          }}
          color="gray.500"
        >
          {project.description
            ? project.description
            : "No description available"}
        </Card.Description>
        <HStack>
          {project.tech && project.tech.length > 0 ? (
            project.tech.map((item, i) => (
              <Tag.Root
                key={i}
                size="sm"
                textOverflow="ellipsis"
                variant="subtle"
                bg="var(--color-fg)"
                color="var(--palette-seashell)"
              >
                <Tag.Label>{item}</Tag.Label>
              </Tag.Root>
            ))
          ) : (
            <span style={{ fontSize: "0.75rem", color: "var(--color-fg)" }}>
              No tech listed
            </span>
          )}
        </HStack>
      </Card.Body>

      <Card.Footer gap="2">
        <ChakraLink as={NextLink} href={`/portfolio/${project._id}`}>
          <Button
            variant="ghost"
            color={"var(--color-accent)"}
            borderColor={"var(--color-accent)"}
            _hover={{ bg: "var(--color-accent)", color: "var(--color-bg)" }}
          >
            View Project
          </Button>
        </ChakraLink>

        {project.links?.[0] && (
          <ChakraLink
            href={project.links[0].url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button bg={"var(--color-accent)"} color={"var(--color-bg)"}>
              {project.links[0].label ?? "Visit"}
            </Button>
          </ChakraLink>
        )}
      </Card.Footer>
    </Card.Root>
  );
}

export function ProjectGrid({ projects }: { projects: Project[] }) {
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  const startRange = (page - 1) * itemsPerPage;
  const endRange = startRange + itemsPerPage;
  const visibleItems = projects.slice(startRange, endRange);

  if (!projects?.length) {
    return <Box>No projects found.</Box>;
  }

  return (
    <VStack gap ={4}>
      <SimpleGrid columns={{ md: 1, lg: 2, xl: 3 }} gap={7} gridAutoRows="1fr">
        {visibleItems.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}
        {Array.from({ length: itemsPerPage - visibleItems.length }).map(
          (_, i) => (
            <Box key={`empty-${i}`} visibility="hidden" />
          )
        )}
      </SimpleGrid>

      <Pagination.Root
        count={projects.length}
        pageSize={itemsPerPage}
        page={page}
        onPageChange={(e) => setPage(e.page)}
      >
        <ButtonGroup size="sm" justifyContent={"center"} alignItems={"center"}>
          <Pagination.PrevTrigger asChild>
            <IconButton>
              <FaCaretLeft />
            </IconButton>
          </Pagination.PrevTrigger>
          <Pagination.PageText format="long" />
          <Pagination.NextTrigger asChild>
            <IconButton>
              <FaCaretRight />
            </IconButton>
          </Pagination.NextTrigger>
        </ButtonGroup>
      </Pagination.Root>
    </VStack>
  );
}
