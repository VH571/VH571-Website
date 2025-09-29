"use client";

import { useEffect, useState } from "react";
import { Button, FileUpload, HStack, VStack, Alert } from "@chakra-ui/react";
import { HiUpload } from "react-icons/hi";

export type DraftImage = {
  file: File;
  alt: string;
  width: number;
  height: number;
  previewUrl: string;
};

type Item = {
  file: File;
  alt: string;
  width?: number;
  height?: number;
  previewUrl: string;
};

export function ImageUpload({
  maxFiles = 1,
  onSelected,
}: {
  maxFiles?: number;
  onSelected?: (drafts: DraftImage[]) => void;
}) {
  const [items, setItems] = useState<Item[]>([]);
  const [globalError, setGlobalError] = useState<string | null>(null);

  function makePreview(file: File) {
    return URL.createObjectURL(file);
  }
  function revoke(url?: string) {
    if (url) URL.revokeObjectURL(url);
  }
  function getDimensions(
    file: File
  ): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const blobUrl = URL.createObjectURL(file);
      const img = new window.Image();
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
        URL.revokeObjectURL(blobUrl);
      };
      img.onerror = (e) => {
        URL.revokeObjectURL(blobUrl);
        reject(e);
      };
      img.src = blobUrl;
    });
  }

  useEffect(() => {
    return () => {
      items.forEach((it) => revoke(it.previewUrl));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleAccept(details: unknown) {
    setGlobalError(null);
    const accepted =
      (details as { files?: File[] })?.files?.filter(
        (f): f is File => f instanceof File
      ) ?? [];

    if (!accepted.length) return;

    const drafts: DraftImage[] = [];
    const newItems: Item[] = [];

    for (const f of accepted.slice(0, maxFiles)) {
      const previewUrl = makePreview(f);
      try {
        const { width, height } = await getDimensions(f);
        drafts.push({ file: f, alt: f.name, width, height, previewUrl });
        newItems.push({ file: f, alt: f.name, width, height, previewUrl });
      } catch {
        drafts.push({ file: f, alt: f.name, width: 0, height: 0, previewUrl });
        newItems.push({ file: f, alt: f.name, previewUrl });
      }
    }

    setItems((prev) => [...prev, ...newItems]);
    onSelected?.(drafts);
  }

  function handleReject(details: unknown) {
    const firstMessage = (details as { errors?: { message?: string }[] })
      ?.errors?.[0]?.message;
    setGlobalError(firstMessage || "File was rejected");
  }

  return (
    <VStack align="stretch" gap={0}>
      <FileUpload.Root
        maxFiles={maxFiles}
        accept={{ "image/*": [] }}
        onFileAccept={handleAccept}
        onFileReject={handleReject}
      >
        <FileUpload.HiddenInput name="images" />
        <FileUpload.Trigger asChild>
          <Button variant="outline" w="100%">
            <HiUpload />
            Choose image{maxFiles > 1 ? "s" : ""}
          </Button>
        </FileUpload.Trigger>
      </FileUpload.Root>

      {globalError && (
        <Alert.Root status="error" colorPalette="brand">
          <Alert.Indicator />
          <Alert.Content>
            <HStack gap={1}>
              <Alert.Title>Error:</Alert.Title>
              <Alert.Description>{globalError}</Alert.Description>
            </HStack>
          </Alert.Content>
        </Alert.Root>
      )}
    </VStack>
  );
}
