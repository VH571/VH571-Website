"use client";
import { Project } from "@/models/project";
import {
  Box,
  Text,
  Link as ChakraLink,
  List,
  ListItem,
  Image,
  Card,
  Avatar,
  Button,
  useBreakpointValue,
  SimpleGrid,
  VisuallyHidden,
  HStack,
  Heading,
  IconButton,
} from "@chakra-ui/react";
import React from "react";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Card.Root width="320px" variant={"elevated"}>
      <Card.Body gap="2">
        <Avatar.Root size="lg" shape="rounded">
          <Avatar.Image src="https://picsum.photos/200/300" />
          <Avatar.Fallback name="Nue Camp" />
        </Avatar.Root>
        <Card.Title mt="2">Nue Camp</Card.Title>
        <Card.Description>
          This is the card body. Lorem ipsum dolor sit amet, consectetur
          adipiscing elit. Curabitur nec odio vel dui euismod fermentum.
          Curabitur nec odio vel dui euismod fermentum.
        </Card.Description>
      </Card.Body>
      <Card.Footer justifyContent="flex-end">
        <Button variant="outline">View</Button>
        <Button>Join</Button>
      </Card.Footer>
    </Card.Root>
  );
}

export function ProjectGrid({ projects }: { projects: Project[] }) {
  const itemsPerPage = 6;
  const pages = React.useMemo<Project[][]>(() => {
    const out: Project[][] = [];
    for (let i = 0; i < projects.length; i += itemsPerPage) {
      out.push(projects.slice(i, i + itemsPerPage));
    }
    return out.length ? out : [[]];
  }, [projects]);

  const [pageIndex, setPageIndex] = React.useState(0);
  const pageCount = pages.length;

  React.useEffect(() => {
    if (pageIndex > pageCount - 1) setPageIndex(0);
  }, [pageCount, pageIndex]);

  const prev = () => setPageIndex((p) => Math.max(0, p - 1));
  const next = () => setPageIndex((p) => Math.min(pageCount - 1, p + 1));
  const goTo = (i: number) => setPageIndex(i);

  if (!projects?.length) {
    return <Box>No projects found.</Box>;
  }

  return (
    <Box>
      <HStack justify="space-between" mb={3}>
        <HStack>
          <IconButton
            aria-label="Previous page"
            onClick={prev}
            disabled={pageIndex === 0}
            size="sm"
            variant="ghost"
          >
            {" "}
          </IconButton>
          <IconButton
            aria-label="Next page"
            onClick={next}
            disabled={pageIndex === pageCount - 1}
            size="sm"
            variant="ghost"
          ></IconButton>
        </HStack>
      </HStack>

      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={4}>
        {pages[pageIndex].map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </SimpleGrid>

      <HStack
        justify="center"
        gap={2}
        mt={3}
        role="tablist"
        aria-label="Pagination"
      >
        {Array.from({ length: pageCount }).map((_, i) => (
          <Button
            key={i}
            onClick={() => goTo(i)}
            role="tab"
            aria-label={`Go to page ${i + 1}`}
            aria-current={i === pageIndex ? "true" : "false"}
            variant="ghost"
            w="8px"
            h="8px"
            minW="8px"
            borderRadius="full"
            bg={i === pageIndex ? "gray.900" : "gray.300"}
            _hover={{ bg: i === pageIndex ? "gray.900" : "gray.400" }}
            p={0}
          >
            <VisuallyHidden>{`Page ${i + 1}`}</VisuallyHidden>
          </Button>
        ))}
      </HStack>
    </Box>
  );
}
