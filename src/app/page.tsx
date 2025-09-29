import { Box } from "@chakra-ui/react";
import OceanViewer from "@/components/OceanViewer";

export default async function Home() {
  return (
    <Box height={"100%"}>
      <OceanViewer height="100%" />
    </Box>
  );
}
