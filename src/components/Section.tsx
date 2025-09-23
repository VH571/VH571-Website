"use client";
import { ReactNode, useMemo, useState } from "react";
import {
  Box,
  HStack,
  VStack,
  IconButton,
  Button,
  Text,
  Show,
  Menu,
  useBreakpointValue,
  Drawer,
  CloseButton,
} from "@chakra-ui/react";
import {
  MdOutlineEdit,
  MdOutlineEditOff,
  MdOutlineAdd,
  MdOutlineSaveAs,
  MdOutlineSave,
  MdOutlineCancel,
  MdOutlineClose,
  MdOutlineMenu,
} from "react-icons/md";
export type SectionMode = "view" | "edit" | "create";

export type SectionProps<T> = {
  mode: SectionMode;
  title?: ReactNode;
  data: T[];
  emptyItem?: () => T;
  canAdd?: boolean;
  onSave?: (next: T[]) => void | Promise<void>;
  onCancel?: () => void;
  onChangeMode?: (m: SectionMode) => void;
  renderViewItem: (item: T, index: number) => ReactNode;
  renderEditItem: (
    item: T,
    index: number,
    update: (index: number, patch: Partial<T>) => void,
    remove: (index: number) => void
  ) => ReactNode;
  canEdit?: boolean;
};

export function Section<T>({
  mode,
  title,
  data,
  canAdd = true,
  canEdit = true,
  emptyItem,
  onSave,
  onCancel,
  onChangeMode,
  renderViewItem,
  renderEditItem,
}: SectionProps<T>) {
  const isMutable = canEdit && (mode === "edit" || mode === "create");

  const [draft, setDraft] = useState<T[]>(
    isMutable && mode === "create"
      ? emptyItem
        ? [emptyItem()]
        : []
      : (data ?? [])
  );

  const items = isMutable ? draft : data;

  const update = (index: number, patch: Partial<T>) => {
    setDraft((prev) =>
      prev.map((it, i) => (i === index ? { ...it, ...patch } : it))
    );
  };

  const remove = (index: number) => {
    setDraft((prev) => prev.filter((_, i) => i !== index));
  };

  const add = () => {
    if (!emptyItem) return;
    setDraft((prev) => [...prev, emptyItem()]);
  };

  const handleEditClick = () => {
    if (canEdit) onChangeMode?.("edit");
  };

  const handleCancel = () => {
    setDraft(data);
    onCancel?.();
    onChangeMode?.("view");
  };

  const handleSave = async () => {
    await onSave?.(draft);
    onChangeMode?.("view");
  };
  const isDesktop = useBreakpointValue<true | false>({ base: false, lg: true });

  return (
    <Box as="section" display="inline-block" w="100%">
      <Box position="relative" mb={3} zIndex={100}>
        <Box w="100%">{title}</Box>
        {canEdit && (
          <Show
            when={isDesktop}
            fallback={
              <Box position="absolute" top={0} right={0}>
                <Menu.Root size="md" variant={"subtle"}>
                  <Menu.Trigger asChild>
                    <IconButton aria-label="Actions" size="sm" variant="ghost">
                      <MdOutlineMenu />
                    </IconButton>
                  </Menu.Trigger>

                  <Menu.Positioner>
                    <Menu.Content bg={"bg"}>
                      {mode === "view" && canEdit && onChangeMode && (
                        <Box>
                          <Menu.Item value="edit" onSelect={handleEditClick}>
                            <MdOutlineEdit />
                            Edit
                          </Menu.Item>
                        </Box>
                      )}

                      {isMutable && (
                        <>
                          <Menu.Item value="save" onSelect={handleSave}>
                            <MdOutlineSave />
                            Save
                          </Menu.Item>
                          {canAdd && emptyItem && (
                            <Menu.Item value="add" onSelect={add}>
                              <MdOutlineAdd />
                              Add
                            </Menu.Item>
                          )}

                          <Menu.Separator />

                          <Menu.Item value="cancel" onSelect={handleCancel}>
                            <MdOutlineClose />
                            Cancel
                          </Menu.Item>
                        </>
                      )}
                    </Menu.Content>
                  </Menu.Positioner>
                </Menu.Root>
              </Box>
            }
          >
            <HStack top={0} right={0} position="absolute" gap={2}>
              {mode === "view" && canEdit && onChangeMode && (
                <IconButton
                  aria-label="Edit"
                  size="sm"
                  variant="ghost"
                  onClick={handleEditClick}
                >
                  <MdOutlineEdit />
                </IconButton>
              )}

              {isMutable && (
                <>
                  <Button
                    aria-label="Save"
                    size="sm"
                    onClick={handleSave}
                    variant="ghost"
                  >
                    <MdOutlineSave />
                    Save
                  </Button>

                  {canAdd && emptyItem && (
                    <Button
                      aria-label="Add"
                      onClick={add}
                      size="sm"
                      variant="ghost"
                    >
                      <MdOutlineAdd />
                      Add
                    </Button>
                  )}

                  <Button
                    aria-label="Cancel"
                    onClick={handleCancel}
                    size="sm"
                    variant="ghost"
                  >
                    <MdOutlineClose />
                    Cancel
                  </Button>
                </>
              )}
            </HStack>
          </Show>
        )}
      </Box>

      <VStack align="stretch" gap={3}>
        {items?.map((item, index) =>
          isMutable
            ? renderEditItem(item, index, update, remove)
            : renderViewItem(item, index)
        )}

        {!items?.length && (
          <Text color="gray.500" fontStyle="italic">
            {mode === "view" ? "No items." : "Start by adding an item."}
          </Text>
        )}
      </VStack>
    </Box>
  );
}
