"use client";

import { Center, VStack, Text, Button } from "@chakra-ui/react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Center h="100vh" w="100%">
      <VStack>
        <Text fontSize="lg" fontWeight="bold">Failed to load resume</Text>
        <Text color="gray.500" maxW="480px" textAlign="center">
          {error.message || "Something went wrong."}
        </Text>
        <Button mt={4} onClick={reset} colorScheme="teal">
          Try again
        </Button>
      </VStack>
    </Center>
  );
}
