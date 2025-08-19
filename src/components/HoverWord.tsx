import React from "react";
import { Box, VStack, Text, TextProps  } from "@chakra-ui/react";

type Props = {
  jp: string;
  en: string;
  jpLineHeight : TextProps["lineHeight"];
};

export function HoverWord({ jp, en, jpLineHeight = 1}: Props) {
  const jpChar = Array.from(jp);
  return (
    <Box
      position={"relative"}
      display="inline-block"
      cursor="pointer"
      _hover={{
        "& [data-jp]": { opacity: 0},
        "& [data-en]": { opacity: 1, pointerEvents: "auto" },
      }}
    >
      <VStack
        data-jp
        gap={"0"}
        opacity={1}
        transition="opacity 150ms ease-in-out"
        fontSize={"4rem"}
      >
        {jpChar.map((ch, i) => (
          <Text as="span" key={i} display={"inline-block"} lineHeight={jpLineHeight}> 
            {ch}
          </Text>
        ))}
      </VStack>
      <Text
        data-en
        display={"inline-block"}
        lineHeight={"1"}
        position={"absolute"}
        top={"50%"}
        right={"0px"}
        pointerEvents="none"
        opacity={0}
        transition="opacity 150ms ease-in-out"
        backdropFilter={"blur(1px)"}
      >
        {en}
      </Text>
    </Box>
  );
}
