"use client"
import { useState } from "react";
import { Project } from "@/models/project";
import { Resume } from "@/models/resume";
import { Box } from "@chakra-ui/react";

export function ResumeTab({ resumeList }: { resumeList: Resume[] }) {

  return <Box>Manage your resumes</Box>;
}
export function ProjectTab({ projectList }: { projectList: Project[] }) {
  return <Box>Manage your projects</Box>;
}
