"use client";

import {
  Button,
  CloseButton,
  Dialog,
  Portal,
  Text,
  HStack,
} from "@chakra-ui/react";

export function ConfirmDeleteDialog({
  trigger,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
}: {
  trigger: React.ReactNode;
  onConfirm: () => void | Promise<void>;
  title?: string;
  description?: string;
}) {
  return (
    <Dialog.Root role="alertdialog">
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content background="bg" colorPalette="brand">
            <Dialog.Header>
              <Dialog.Title>{title}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Text>{description}</Text>
            </Dialog.Body>
            <Dialog.Footer>
              <HStack gap={2}>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </Dialog.ActionTrigger>
                <Dialog.ActionTrigger asChild>
                  <Button
                    colorPalette="red"
                    onClick={async () => {
                      await onConfirm();
                    }}
                  >
                    Delete
                  </Button>
                </Dialog.ActionTrigger>
              </HStack>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
