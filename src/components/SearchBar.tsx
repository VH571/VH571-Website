import React, { useMemo, useState, useEffect } from "react";
import { Box, Input, InputGroup, Kbd } from "@chakra-ui/react";
import { IoMdSearch } from "react-icons/io";
import { Project } from "@/models/project";
import { Resume } from "@/models/resume";

type Props = {
  value: string;
  onChange: (q: string) => void;
  placeholder?: string;
};

function extractStringsFromUnknown(u: unknown): string[] {
  const out: string[] = [];
  const walk = (v: unknown) => {
    if (typeof v === "string") out.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object")
      Object.values(v as Record<string, unknown>).forEach(walk);
  };
  walk(u);
  return out;
}

export function useDebounced<T>(value: T, delay = 200) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export function filterResumes(resumes: Resume[], q: string) {
  const term = q.trim().toLowerCase();
  if (!term) return resumes;
  return resumes.filter((r) => {
    const skills = extractStringsFromUnknown(r.technicalSkills ?? []).join(" ");
    const haystack = [
      r.name,
      r.title,
      r.summary ?? "",
      r.email,
      r.githubUrl ?? "",
      r.linkedinUrl ?? "",
      r.website ?? "",
      skills,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(term);
  });
}

export function filterProjects(projects: Project[], q: string) {
  const term = q.trim().toLowerCase();
  if (!term) return projects;
  return projects.filter((p) => {
    const haystack = [
      p.name,
      p.role,
      p.description ?? "",
      (p.tech ?? []).join(" "),
      (p.achievements ?? []).join(" "),
      (p.links ?? []).map((l) => `${l.label ?? ""} ${l.url}`).join(" "),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(term);
  });
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search…",
}: Props) {
  return (
    <InputGroup startElement={<IoMdSearch />} endElement={<Kbd>Enter</Kbd>}>
      <Input
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search"
      />
    </InputGroup>
  );
}
