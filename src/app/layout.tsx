import type { Metadata } from "next";
import "./globals.css";
import { Provider } from "@/components/ui/provider";
import Navbar from "@/components/Navbar";
import { Box, Flex } from "@chakra-ui/react";

export const metadata: Metadata = {
  title: "571's Website",
  description: "Victor's website to show off some of his skills.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={"website"} suppressHydrationWarning lang="en">
      <body>
        <Provider>
          <Flex font={"var(--font-sans)"} h="100dvh" overflow="hidden">
            <Box
              as="aside"
              flex="0 0 auto"
              position="sticky"
              top="0"
              h="100dvh"
              w="200px"
            >
              <Navbar />
            </Box>
            <Box as="main" flex="1 1 auto" minW="0" h="100dvh" overflowY="auto">
              {children}
            </Box>
          </Flex>
        </Provider>
      </body>
    </html>
  );
}
