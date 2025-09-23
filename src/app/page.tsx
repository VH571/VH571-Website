import { Box } from "@chakra-ui/react";
import ModelViewer from "@/components/ModelView";
import OceanViewer from "@/components/OceanViewer";
import { Resume } from "@/models/resume";
import { getDefaultResume } from "@/lib/resumeService";

type ResumeResult = Resume | { error: string } | null;

export default async function Home() {
  let defaultResume: ResumeResult = null;
  try {
    defaultResume = await getDefaultResume();
  } catch (err) {
    throw new Error(`Could not fetch default resume: error ${err}`);
  }

  if (!defaultResume || "error" in defaultResume) {
    throw new Error(defaultResume?.error ?? "No default resume found.");
  }

  return (
    <Box height={"100%"}>
      <OceanViewer height="100%" />
    </Box>
  );
}
