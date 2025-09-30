"use client";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  HStack,
  Stack,
  Text,
  Card,
  Field,
  PinInput,
  Spinner,
} from "@chakra-ui/react";
import { QrCode } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";

export default function Security2FA() {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [otpauth, setOtpauth] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [loadingAction, setLoadingAction] = useState<
    "status" | "setup" | "verify" | "disable" | null
  >(null);

  useEffect(() => {
    const load = async () => {
      setLoadingAction("status");
      try {
        const res = await fetch("/api/auth/session");
        const data = await res.json();
        setEnabled(!!data?.user?.twoFAEnabled);
      } catch {
        setEnabled(false);
      } finally {
        setLoadingAction(null);
      }
    };
    load();
  }, []);

  const startSetup = async () => {
    if (enabled) {
      toaster.create({
        title: "Already enabled",
        description: "Two-factor authentication is already on.",
        type: "info",
        closable: true,
      });
      return;
    }
    setLoadingAction("setup");
    try {
      const res = await fetch("/api/admin/2fa/setup", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 409) {
          setEnabled(true);
          setOtpauth(null);
          setSecret(null);
          toaster.create({
            title: "Already enabled",
            description: "No need to set up again.",
            type: "info",
          });
          return;
        }
        throw new Error(data?.error || "Failed to start 2FA setup");
      }
      setOtpauth(data.otpauth);
      setSecret(data.secretBase32 ?? null);
      toaster.create({
        title: "2FA setup started",
        description: "Scan the QR code with your authenticator app.",
        type: "info",
        closable: true,
      });
    } catch (e: any) {
      toaster.create({
        title: "Setup failed",
        description: e.message,
        type: "error",
        closable: true,
      });
    } finally {
      setLoadingAction(null);
    }
  };

  const verify = async () => {
    setLoadingAction("verify");
    try {
      const res = await fetch("/api/admin/2fa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Invalid code");
      setEnabled(true);
      setOtpauth(null);
      setSecret(null);
      setCode("");
      toaster.create({
        title: "2FA enabled",
        description: "Sign-ins now require TOTP.",
        type: "success",
      });
    } catch (e: any) {
      toaster.create({
        title: "Verification failed",
        description: e.message,
        type: "error",
      });
    } finally {
      setLoadingAction(null);
    }
  };

  const disable2FA = async () => {
    setLoadingAction("disable");
    try {
      const res = await fetch("/api/admin/2fa/disable", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to disable 2FA");
      setEnabled(false);
      setOtpauth(null);
      setSecret(null);
      setCode("");
      toaster.create({
        title: "2FA disabled",
        description: "TOTP is no longer required.",
        type: "info",
      });
    } catch (e: any) {
      toaster.create({
        title: "Disable failed",
        description: e.message,
        type: "error",
      });
    } finally {
      setLoadingAction(null);
    }
  };

  if (enabled === null) {
    return (
      <Box maxW="520px">
        <Stack gap={4} align="center">
          <Spinner size="lg" />
          <Text color="fg.muted">Checking 2FA status…</Text>
        </Stack>
      </Box>
    );
  }

  return (
    <Box maxW="520px">
      <Stack gap={5}>
        <Text fontSize="xl" fontWeight="bold">
          Two-Factor Authentication (TOTP)
        </Text>

        <HStack>
          <Text fontSize="sm" color="fg.muted">
            Status: {enabled ? "Enabled" : "Disabled"}
          </Text>
          {loadingAction === "status" && <Spinner size="sm" />}{" "}
        </HStack>

        {!enabled && !otpauth && (
          <Button
            colorPalette="brand"
            loading={loadingAction === "setup"}
            loadingText="Starting…"
            onClick={startSetup}
            disabled={loadingAction === "status"}
          >
            Enable 2FA
          </Button>
        )}

        {!enabled && otpauth && (
          <Card.Root>
            <Card.Body>
              <Stack align="center" gap={4}>
                <Text fontSize="sm" color="fg.muted">
                  Scan this QR with Google/Microsoft Authenticator, 1Password,
                  or Authy.
                </Text>

                <QrCode.Root
                  value={otpauth}
                  size="xl"
                  colorPalette="brand"
                  pixelSize={4}
                >
                  <QrCode.Frame>
                    <QrCode.Pattern />
                  </QrCode.Frame>
                  <QrCode.DownloadTrigger
                    fileName="yourapp-2fa.png"
                    mimeType="image/png"
                    asChild
                  >
                    <Button variant="outline" size="sm" w="full" mt={3}>
                      Download QR
                    </Button>
                  </QrCode.DownloadTrigger>
                </QrCode.Root>

                <Field.Root>
                  <Field.Label>Enter 6-digit code</Field.Label>
                  <HStack>
                    <PinInput.Root
                      otp
                      onValueChange={(d) => setCode(d.valueAsString)}
                    >
                      <PinInput.HiddenInput />
                      <PinInput.Control>
                        <PinInput.Input index={0} />
                        <PinInput.Input index={1} />
                        <PinInput.Input index={2} />
                        <PinInput.Input index={3} />
                        <PinInput.Input index={4} />
                        <PinInput.Input index={5} />
                      </PinInput.Control>
                    </PinInput.Root>
                  </HStack>
                </Field.Root>

                <HStack>
                  <Button
                    colorPalette="brand"
                    loading={loadingAction === "verify"}
                    loadingText="Verifying…"
                    onClick={verify}
                    disabled={code.length !== 6}
                  >
                    Verify & Turn On
                  </Button>
                  <Button
                    variant="ghost"
                    colorPalette="brand"
                    onClick={() => {
                      setOtpauth(null);
                      setSecret(null);
                      setCode("");
                    }}
                  >
                    Cancel
                  </Button>
                </HStack>

                {secret && (
                  <Box w="100%">
                    <Text fontWeight="medium">Manual entry (if QR fails)</Text>
                    <Box
                      mt={2}
                      p={2}
                      rounded="md"
                      bg="blackAlpha.50"
                      fontFamily="mono"
                      wordBreak="break-all"
                    >
                      {secret}
                    </Box>
                  </Box>
                )}
              </Stack>
            </Card.Body>
          </Card.Root>
        )}

        {enabled && (
          <HStack>
            <Button
              colorPalette="brand"
              variant="outline"
              onClick={disable2FA}
              loading={loadingAction === "disable"}
              loadingText="Disabling…"
            >
              Disable 2FA
            </Button>
          </HStack>
        )}
      </Stack>
    </Box>
  );
}
