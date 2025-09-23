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
    <html lang="en" suppressHydrationWarning>
      <body>
        <Provider>
          <Flex font={"var(--font-sans)"} h="100%">
            <Box
              as="aside"
              flex="0 0 auto"
              position="sticky"
              top="0"
              w="200px"
              h="100%"
            >
              <Navbar />
            </Box>
            <Box as="main" flex="1" h="100%" overflowY="auto">
              {children}
            </Box>
          </Flex>
        </Provider>
      </body>
    </html>
  );
}
