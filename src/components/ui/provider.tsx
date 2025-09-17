"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ColorModeProvider } from "@/components/ui/color-mode";
import { system } from "@/styles/theme"
export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider value={system} >
      <ColorModeProvider>{children}</ColorModeProvider>
    </ChakraProvider>
  );
}
