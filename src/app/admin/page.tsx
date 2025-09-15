import {
  Center,
  VStack,
  Text,
  Tabs,
  useBreakpointValue,
} from "@chakra-ui/react";
import { getAllResumes } from "@/lib/resumeService";
import { Resume } from "@/models/resume";
import { LuFileUser, LuFileCode } from "react-icons/lu";
import { color } from "three/tsl";
type ResumesLst = Resume | { error: string } | null;

export default async function Admin() {
  let defaultResume: ResumesLst = null;
  try {
    defaultResume = await getAllResumes();
  } catch (err) {
    throw new Error(`Could not fetch resumes. ${err}`);
  }

  if (!defaultResume || "error" in defaultResume) {
    throw new Error(defaultResume?.error ?? "No resumes found.");
  }
  return (
    <Tabs.Root defaultValue="resumes" variant={"line"} size={"lg"}
    style={{
    "--tabs-indicator-shadow": "var(--color-accent)",
    "--tabs-indicator-bg": "var(--color-accent)",
  } as React.CSSProperties}>
      <Tabs.List >
        <Tabs.Trigger value="resumes" >
          <LuFileUser />
          Resumes
        </Tabs.Trigger>
        <Tabs.Trigger value="projects">
          <LuFileCode />
          Projects
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="resumes">Manage your team members</Tabs.Content>
      <Tabs.Content value="projects">Manage your projects</Tabs.Content>
    </Tabs.Root>
  );
}
