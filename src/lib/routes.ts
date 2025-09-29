export type RouteLabel =
  | "HOME"
  | "PORTFOLIO"
  | "RESUME"
  | "PROJECT"
  | "Not Found";

type StaticMap = Record<string, RouteLabel>;

const STATIC_ROUTES: StaticMap = {
  "/": "HOME",
  "/portfolio": "PORTFOLIO",
  "/resume": "RESUME",
};

const DYNAMIC_PATTERNS: Array<[RegExp, RouteLabel]> = [
  [/^\/portfolio\/[^/]+$/, "PROJECT"],
  [/^\/project\/[^/]+$/, "PROJECT"],
];

function normalize(pathname: string) {
  const p = pathname.split("?")[0].split("#")[0].replace(/\/+$/, "");
  return p || "/";
}

export function getRouteLabel(pathname: string): RouteLabel {
  const clean = normalize(pathname);
  if (STATIC_ROUTES[clean]) return STATIC_ROUTES[clean];

  for (const [re, label] of DYNAMIC_PATTERNS) {
    if (re.test(clean)) return label;
  }
  return "Not Found";
}
export function getBaseUrl() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}
