import { Button, CloseButton, Drawer, Portal, Box } from "@chakra-ui/react";
import { Resume } from "@/models/resume";

export default function ResumePortal({
  resume,
  containerRef,
  bodyRef,
}: {
  resume: Resume;
  containerRef?: React.RefObject<HTMLElement> | null;
  bodyRef?: React.RefObject<HTMLDivElement>;
}) {
  return (
    <Box>
      {containerRef && (
        <Portal container={containerRef ?? ""}>
          <Drawer.Backdrop />
          <Drawer.Positioner position="absolute" w="100%" padding={"20px"}>
            <Drawer.Content
              w="95%"
              bg={"var(--color-seashell)"}
              mx={"auto"}
              minH={"320px"}
              maxH={"940px"}
              minW={"320px"}
              maxW={"940px"}
              ref={bodyRef}
              overflow={"scroll"}
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
