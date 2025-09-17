"use client";
import {
  Box,
  Image,
  Card,
  Button,
  Link as ChakraLink,
  SimpleGrid,
  HStack,
  Tag,
} from "@chakra-ui/react";
import "@/styles/bootstrap-carousel.scss";
import { Project } from "@/models/project";
import { GrFormNext, GrFormPrevious} from "react-icons/gr";
import Carousel from "react-bootstrap/Carousel";
import "@/styles/bootstrap-carousel.scss";
import React, { useState, useMemo } from "react";
import NextLink from "next/link";
export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Card.Root maxW="md" variant={"subtle"} overflow={"hidden"} bg={"none"}>
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
        nextIcon={<GrFormNext color="var(--color-accent)" size="2rem"/>}
        prevIcon={<GrFormPrevious color="var(--color-accent)" size="2rem"/>}
      >
        {pages.map((pageItems, pageIdx) => {
          const padCount = itemsPerPage - pageItems.length;
          return (
            <Carousel.Item key={`page-${pageIdx}`}>
              <SimpleGrid
                columns={{ md: 1, lg: 2, xl: 3 }}
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
