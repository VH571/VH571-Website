import { Button, CloseButton, Drawer, Portal, Box } from "@chakra-ui/react";
import { Resume } from "@/models/resume";

export default function ResumePortal({
  resume,
  containerRef,
}: {
  resume: Resume;
  containerRef?: React.RefObject<HTMLElement> | null;
}) {
  return (
    <Box>
      {containerRef && (
        <Portal container={containerRef ?? ""}>
          <Drawer.Backdrop />
          <Drawer.Positioner position="absolute" w="100%" >
            <Drawer.Content
              w="95%"
              bg={"var(--color-seashell)"}
              mx={"auto"}
              my={"auto"}
            >
              <Drawer.Header>
                <Drawer.Title>{resume.name}</Drawer.Title>
              </Drawer.Header>
              <Drawer.Body>
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
