import { Box, Link, Text } from "@chakra-ui/react";
import { Link as ExtLink } from "@/models/project";

export function fmtMY(s?: string) {
  if (!s) return undefined;
  const d = new Date(s);
  return Number.isNaN(d.valueOf())
    ? s
    : d
        .toLocaleString("en-US", { month: "short", year: "numeric" })
        .toUpperCase();
}

type SectionHeaderProps = {
  jp: string;
  en: string;
};
export function formatLabelFromUrl(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function InlineLink({ link }: { link: ExtLink }) {
  const label = link.label?.trim() || formatLabelFromUrl(link.url);
  return (
    <Link
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      textDecoration="underline"
      color={"var(--color-accent)"}
      fontSize="sm"
      mr={3}
    >
      {label}
    </Link>
  );
}

export function SectionHeader({ jp, en }: SectionHeaderProps) {
  return (
    <Box
      borderBottom="2px solid"
      borderColor={"var(--color-accent)"}
      pb={2}
      w="100%"
      lineHeight={"1"}
    >
      <Text fontSize="lg" color={"var(--color-accent-alt)"}>
        {jp}
      </Text>
      <Text
        fontWeight="bold"
        fontSize="clamp(1.5rem,1.8rem,2.15rem)"
        textTransform="uppercase"
        letterSpacing="wider"
      >
        {en}
      </Text>
    </Box>
  );
}
