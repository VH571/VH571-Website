"use client";

import {
  Editable,
  Input,
  Textarea,
  IconButton,
  HStack,
  Box,
} from "@chakra-ui/react";
import { LuCheck, LuPencilLine, LuX } from "react-icons/lu";
import { ReactNode } from "react";

export function InlineEditableText({
  value,
  onChange,
  placeholder,
  activationMode = "dblclick",
  size = "md",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  activationMode?: "dblclick" | "focus" | "click";
  size?: "sm" | "md" | "lg";
}) {
  return (
    <Editable.Root
      defaultValue={value}
      activationMode={activationMode}
      onValueChange={(v) => onChange(v.value)}
    >
      <Editable.Preview />
      <Editable.Input asChild>
        <Input size={size} placeholder={placeholder} />
      </Editable.Input>
      <Editable.Control>
        <HStack gap={1}>
          <Editable.EditTrigger asChild>
            <IconButton variant="ghost" size="xs" aria-label="Edit">
              <LuPencilLine />
            </IconButton>
          </Editable.EditTrigger>
          <Editable.CancelTrigger asChild>
            <IconButton variant="outline" size="xs" aria-label="Cancel">
              <LuX />
            </IconButton>
          </Editable.CancelTrigger>
          <Editable.SubmitTrigger asChild>
            <IconButton variant="outline" size="xs" aria-label="Save">
              <LuCheck />
            </IconButton>
          </Editable.SubmitTrigger>
        </HStack>
      </Editable.Control>
    </Editable.Root>
  );
}
