import { ReactNode, useMemo, useState } from "react";
import {
  Box,
  HStack,
  VStack,
  IconButton,
  Button,
  Text,
} from "@chakra-ui/react";
import {
  MdOutlineEdit,
  MdOutlineEditOff,
  MdOutlineAdd,
  MdOutlineSaveAs,
  MdOutlineSave,
  MdOutlineCancel,
} from "react-icons/md";
export type SectionMode = "view" | "edit" | "create";

type SectionProps<T> = {
  mode: SectionMode; // "view" | "edit" | "create"
  title?: ReactNode; // header node (can be your SectionHeader)
  data: T[]; // incoming items
  emptyItem?: () => T; // default new item (for create / add)
  canAdd?: boolean; // show "Add" in edit/create
  onSave?: (next: T[]) => void | Promise<void>;
  onCancel?: () => void;
  onChangeMode?: (m: SectionMode) => void; // optional (e.g., to flip from view->edit)
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
  emptyItem,
  canAdd = true,
  onSave,
  onCancel,
  onChangeMode,
  renderViewItem,
  renderEditItem,
  canEdit = true,
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
    setDraft(data); // reset
    onCancel?.();
    onChangeMode?.("view");
  };

  const handleSave = async () => {
    await onSave?.(draft);
    onChangeMode?.("view");
  };

  return (
    <Box as="section" mb={10} display="inline-block" w="100%">
      {/* Header row */}
      <HStack justify="space-between" mb={3}>
        <Box>{title}</Box>
        <HStack>
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
              {canAdd && emptyItem && (
                <Button size="sm" onClick={add}>
                  <MdOutlineAdd />
                  Add
                </Button>
              )}
              <IconButton
                aria-label="Cancel"
                size="sm"
                variant="outline"
                onClick={handleCancel}
              >
                <MdOutlineCancel />
              </IconButton>
              <IconButton
                aria-label="Save"
                size="sm"
                variant="solid"
                onClick={handleSave}
              >
                <MdOutlineSave />
              </IconButton>
            </>
          )}
        </HStack>
      </HStack>

      {/* Items */}
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
