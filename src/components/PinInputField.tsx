"use client";

import * as React from "react";
import {
  Field,
  HStack,
  PinInput,
  type PinInputRootProps,
} from "@chakra-ui/react";
import { Controller, type Control, type FieldError } from "react-hook-form";

type PinInputFieldProps = {
  name: string;
  control: Control<any>;
  label?: string;
  error?: FieldError;
  length?: number;
  otp?: boolean;
  autoFocus?: boolean;
  onComplete?: (code: string) => void;
  pinInputProps?: Omit<PinInputRootProps, "value" | "onValueChange">;
};

export function PinInputField({
  name,
  control,
  label = "Verification Code",
  error,
  length = 6,
  otp = true,
  autoFocus = true,
  onComplete,
  pinInputProps,
}: PinInputFieldProps) {
  const firstRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (autoFocus) {
      const id = requestAnimationFrame(() => firstRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
  }, [autoFocus]);

  const indices = React.useMemo(
    () => Array.from({ length }, (_, i) => i),
    [length]
  );

  return (
    <Field.Root invalid={!!error}>
      {label && <Field.Label>{label}</Field.Label>}

      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const value: string[] = Array.isArray(field.value)
            ? field.value.slice(0, length)
            : Array(length).fill("");

          return (
            <HStack>
              <PinInput.Root
                value={value}
                onValueChange={(details) => {
                  field.onChange(details.value);
                  if (
                    onComplete &&
                    details.value.every(Boolean) &&
                    details.value.length === length
                  ) {
                    onComplete(details.value.join(""));
                  }
                }}
                otp={otp}
                {...pinInputProps}
              >
                <PinInput.HiddenInput />
                <PinInput.Control>
                  {indices.map((i) => (
                    <PinInput.Input
                      key={i}
                      index={i}
                      ref={i === 0 ? firstRef : undefined}
                    />
                  ))}
                </PinInput.Control>
              </PinInput.Root>
            </HStack>
          );
        }}
      />

      <Field.ErrorText>{error?.message}</Field.ErrorText>
    </Field.Root>
  );
}
