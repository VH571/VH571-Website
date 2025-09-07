"use client";

import { Center, Spinner, VStack, Text } from "@chakra-ui/react";

export default function Loading() {
  return (
    <Center h="100vh" w="100%">
      <VStack>
        <Spinner size="xl" borderWidth="4px" />
        <Text mt={2} color="gray.500">Loading resume…</Text>
      </VStack>
    </Center>
  );
}
