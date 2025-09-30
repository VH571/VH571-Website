"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Controller, useForm } from "react-hook-form";
import {
  Stack,
  Field,
  Input,
  Button,
  Alert,
  HStack,
  PinInput,
  Show,
  Heading,
  Text,
} from "@chakra-ui/react";

type FormValues = {
  username: string;
  password: string;
  totp?: string[]; // <-- array for PinInput
};

type Preflight = { ok: boolean; needsTotp?: boolean; ticket?: string };

export function SignInForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [needsTotp, setNeedsTotp] = useState(false);
  const [ticket, setTicket] = useState<string | undefined>(undefined);
  const firstTotpRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    control, // <-- get control
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      username: "",
      password: "",
      totp: Array(6).fill(""), // <-- array default
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError("");

    if (!needsTotp) {
      const res = await fetch("/api/public/auth/verify-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
        }),
      });

      if (!res.ok) {
        setServerError("Invalid credentials.");
        return;
      }
      const data = (await res.json()) as Preflight;

      if (!data.ok) {
        setServerError("Invalid credentials.");
        return;
      }

      if (data.needsTotp) {
        setNeedsTotp(true);
        setTicket(data.ticket);
        setServerError("Two-factor authentication code required.");
        setTimeout(() => firstTotpRef.current?.focus(), 0);
        return;
      }

      const r = await signIn("credentials", {
        redirect: false,
        username: values.username,
        password: values.password,
      });
      if (r?.error) {
        setServerError("Invalid credentials.");
        return;
      }
      router.push("/admin");
      router.refresh();
      return;
    }

    const totpStr = (values.totp ?? []).join("");

    const r2 = await signIn("credentials", {
      redirect: false,
      username: values.username,
      password: values.password,
      totp: totpStr,
      ticket,
    });

    if (r2?.error) {
      setServerError("Invalid two-factor authentication code.");
      return;
    }
    router.push("/admin");
    router.refresh();
  });

  return (
    <form onSubmit={onSubmit}>
      <Stack gap="5" maxW="sm" w="100%" mx="auto">
        <Heading size="md" textAlign="center">
          {needsTotp ? "Two-Factor Verification" : "Admin Sign In"}
        </Heading>
        <Text textAlign="center" color="fg.muted">
          {needsTotp
            ? "Enter the 6-digit code from your authenticator app."
            : "Enter your username and password to continue."}
        </Text>

        {serverError && (
          <Alert.Root status="error" borderRadius="md" colorPalette={"brand"}>
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Description>{serverError}</Alert.Description>
            </Alert.Content>
          </Alert.Root>
        )}

        <Show when={!needsTotp}>
          <Stack gap="4">
            <Field.Root invalid={!!errors.username}>
              <Field.Label>Username</Field.Label>
              <Input
                autoComplete="username"
                {...register("username", { required: "Username is required" })}
              />
              <Field.ErrorText>{errors.username?.message}</Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={!!errors.password}>
              <Field.Label>Password</Field.Label>
              <Input
                type="password"
                autoComplete="current-password"
                {...register("password", { required: "Password is required" })}
              />
              <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
            </Field.Root>
          </Stack>
        </Show>

        <Show when={needsTotp} fallback={null}>
          <Stack gap="4">
            <Field.Root>
              <Field.Label>Username</Field.Label>
              <Input readOnly pointerEvents="none" {...register("username")} />
            </Field.Root>

            <Field.Root>
              <Field.Label>Password</Field.Label>
              <Input
                type="password"
                readOnly
                pointerEvents="none"
                {...register("password")}
              />
            </Field.Root>

            <Field.Root invalid={!!errors.totp}>
              <Field.Label>Two-Factor Code</Field.Label>
              <Controller
                name="totp"
                control={control}
                render={({ field }) => (
                  <HStack>
                    <PinInput.Root
                      value={field.value ?? Array(6).fill("")}
                      onValueChange={(details) => field.onChange(details.value)}
                      otp
                    >
                      <PinInput.HiddenInput />
                      <PinInput.Control>
                        <PinInput.Input index={0} ref={firstTotpRef} />
                        <PinInput.Input index={1} />
                        <PinInput.Input index={2} />
                        <PinInput.Input index={3} />
                        <PinInput.Input index={4} />
                        <PinInput.Input index={5} />
                      </PinInput.Control>
                    </PinInput.Root>
                  </HStack>
                )}
              />
              <Field.ErrorText>{errors.totp?.message as any}</Field.ErrorText>
            </Field.Root>
          </Stack>
        </Show>

        <Button
          type="submit"
          colorPalette="brand"
          w="full"
          loading={isSubmitting}
          loadingText={needsTotp ? "Verifying…" : "Signing in…"}
          spinnerPlacement="start"
        >
          {needsTotp ? "Verify Code" : "Sign In"}
        </Button>
      </Stack>
    </form>
  );
}
