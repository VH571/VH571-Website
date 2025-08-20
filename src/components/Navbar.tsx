"use client";
import Link from "next/link";
import { Box, VStack, Text, HStack } from "@chakra-ui/react";
import { HoverWord } from "./HoverWord";
import { usePathname } from "next/navigation";
import { getRouteLabel } from "@/lib/routes";
export default function Navbar() {
  const pathname = usePathname();
  const label = getRouteLabel(pathname);
  return (
    <Box
      bg={"var(--color-seashell)"}
      h={"full"}
      w="full"
      fontWeight={"bold"}
      fontSize={"2.5rem"}
    >
      <VStack h="full">
        <Box flex={1} w="full" maxH="125px" minH="110px" position="relative">
          <Box
            position="absolute"
            inset={0}
            bg={`
              repeating-linear-gradient(
                -45deg,
                var(--color-lapis) 0,
                var(--color-lapis) 20px,
                transparent 20px,
                transparent 22px
              )
            `}
            opacity={0.2}
            zIndex={0}
          />
          <Box
            position="relative"
            alignItems={"center"}
            display={"flex"}
            justifyContent={"center"}
            width={"100%"}
            height={"100%"}
            zIndex={1}
            color="var(--color-error)"
          >
            <VStack lineHeight={1}>
              <Text fontWeight={"Bolder"} fontSize="clamp(1.9rem, 2vw, 1.9rem)">
                {label}
              </Text>
              <Text fontWeight="bold" fontSize="1rem">
                VICTOR HERRERA
              </Text>
            </VStack>
          </Box>
        </Box>

        <VStack w="full" color="var(--color-lapis)" my="5px" align="flex-end">
          <HStack align="flex-start" gap={"8"}>
            <Text
              fontSize="0.9rem"
              color="red"
              writingMode="vertical-rl"
              textOrientation="sideways"
              height={"90%"}
              pointerEvents={"none"}
              maxH={"750px"}
            >
              SOFTWARE ENGINEER / FULL STACK DEVELOPER \ BASED IN SOUTHERN
              CALIFORNIA / MADE WITH A CREATIVE MIND / LAST UPDATE: FALL 2025 \
              © 2025 VICTOR HERRERA ALL RIGHTS RESERVED
            </Text>
            <VStack marginRight={"30px"}>
              <Link href={"/"}>
                <HoverWord jp="ホーム" en="Home" jpLineHeight=".6" />
              </Link>
              <Box
                borderRadius="100%"
                borderWidth="5px"
                borderColor="var(--color-error)"
                width="24px"
                height="24px"
              />
              <Link href={"/portfolio"}>
                <HoverWord
                  jp="ポートフォリオ"
                  en="Portfolio"
                  jpLineHeight=".9"
                />
              </Link>
              <Box
                borderRadius="100%"
                borderWidth="5px"
                borderColor="var(--color-error)"
                width="24px"
                height="24px"
              />
              <Link href={"/resume"}>
                <HoverWord jp="履歴書" en="Resume" jpLineHeight="1" />
              </Link>
            </VStack>
          </HStack>
        </VStack>
      </VStack>
    </Box>
  );
}
