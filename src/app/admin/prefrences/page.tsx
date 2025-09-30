import Security2FA from "@/components/Security2FA";
import { Box } from "@chakra-ui/react";

export default function Prefrences() {
  return (
    <Box
      w={"100%"}
      h={"100%"}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Security2FA />
    </Box>
  );
}
