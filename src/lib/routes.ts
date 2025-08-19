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
  [/^\/project\/[^/]+$/, "PROJECT"],
];

export function getRouteLabel(pathname: string): RouteLabel {
  const clean = pathname.replace(/\/+$/, "") || "/";
  if (STATIC_ROUTES[clean]) return STATIC_ROUTES[clean];

  for (const [re, label] of DYNAMIC_PATTERNS) {
    if (re.test(clean)) return label;
  }
  return "Not Found";
}
