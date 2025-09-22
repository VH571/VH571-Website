import { HStack, Input, Tag } from "@chakra-ui/react";
import { LuPlus } from "react-icons/lu";
import { useState } from "react";

type TagInputProps = {
  values?: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  allowDuplicates?: boolean;
  icon?: React.ReactNode; // optional Tag.StartElement icon
};

export function TagInput({
  values = [],
  onChange,
  placeholder = "Type and press Enter…",
  allowDuplicates = false,
  icon,
}: TagInputProps) {
  const [draft, setDraft] = useState("");

  const addDraft = () => {
    const v = draft.trim();
    if (!v) return;
    const next = allowDuplicates
      ? [...values, v]
      : Array.from(new Set([...values, v]));
    onChange(next);
    setDraft("");
  };

  const removeAt = (idx: number) =>
    onChange(values.filter((_, i) => i !== idx));

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter" || e.key === "," || e.key === "Tab") {
      e.preventDefault();
      addDraft();
    } else if (e.key === "Backspace" && draft === "" && values.length > 0) {
      removeAt(values.length - 1);
    }
  };

  const onBlur: React.FocusEventHandler<HTMLInputElement> = () => addDraft();

  return (
    <HStack
      
      flexWrap="wrap"
      gap={2}
      px={2}
      py={2}
      borderWidth="1px"
      w={"100%"}
    >
      {values.map((val, i) => (
        <Tag.Root key={`${val}-${i}`}>
          {icon && <Tag.StartElement>{icon}</Tag.StartElement>}
          <Tag.Label>{val}</Tag.Label>
          <Tag.EndElement>
            <Tag.CloseTrigger onClick={() => removeAt(i)} />
          </Tag.EndElement>
        </Tag.Root>
      ))}

      <HStack   gap={1} w={"100%"}>
        <Input
          size="sm"
          placeholder={placeholder}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
          minW="8rem"
        />
      </HStack>
    </HStack>
  );
}
