import { Button, CloseButton, Drawer, Portal, Box } from "@chakra-ui/react";
import { Project } from "@/models/project";

export default function ProjectPortal({
  project,
  containerRef,
  bodyRef,
}: {
  project: Project;
  containerRef?: React.RefObject<HTMLElement> | null;
  bodyRef: React.RefObject<HTMLDivElement>;
}) {
  return (
    <Box>
      {containerRef && (
        <Portal container={containerRef ?? ""}>
          <Drawer.Backdrop />
          <Drawer.Positioner position="absolute" w="100%">
            <Drawer.Content
              w="95%"
              bg={"var(--color-seashell)"}
              mx={"auto"}
              my={"auto"}
              ref={bodyRef}
            >
              <Drawer.Header>
                <Drawer.Title>{project.name}</Drawer.Title>
              </Drawer.Header>
              <Drawer.Body >
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </Drawer.Body>
              <Drawer.Footer>
                <Button variant="outline">Cancel</Button>
                <Button>Save</Button>
              </Drawer.Footer>
              <Drawer.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Drawer.CloseTrigger>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      )}
    </Box>
  );
}
