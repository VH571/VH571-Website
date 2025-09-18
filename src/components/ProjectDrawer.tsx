import { Button, CloseButton, Drawer, Portal } from "@chakra-ui/react";
import { Project } from "@/models/project";

export default function ProjectPortal({ project }: { project: Project }) {
  return (
    <Portal>
      <Drawer.Backdrop />
      <Drawer.Positioner padding="4">
        <Drawer.Content rounded="md">
          <Drawer.Header>
            <Drawer.Title>Drawer Title</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
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
  );
}
