import type { Metadata } from "next";
import "./globals.css";
import { Provider } from "@/components/ui/provider";
import Navbar from "@/components/Navbar";
import { Box, Flex } from "@chakra-ui/react";

export const metadata: Metadata = {
  title: "Victor Herrera",
  description: "Victor's website to show off some of his skills.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <body>
        <Provider>
          <Flex font={"var(--font-sans)"} height = {"100dhv"} overflow={"hidden"}>
            <Box as={"aside"} flex={"0 0 auto"} position={"sticky"} top={"0"} height={"100dvh"} width={"25dvh"}>
              <Navbar/>
            </Box>
            <Box as={"main"} flex={"1 1 auto"} minWidth={"0"} height={"100dvh"} overflowY={"auto"}> 
              {children}
            </Box>
          </Flex>
          
        </Provider>
      </body>
    </html>
  );
}
