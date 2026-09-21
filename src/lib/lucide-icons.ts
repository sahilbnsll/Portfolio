import * as LucideIcons from "lucide-react";

export function toPascalCase(str: string): string {
  return str
    .replace(/[-_]([a-z0-9])/gi, (_, c) => c.toUpperCase())
    .replace(/^[a-z]/, (c) => c.toUpperCase());
}

export function resolveIconName(name: string): string | null {
  if (!name) return null;
  const aliasMap: Record<string, string> = {
    externalLink: "ExternalLink",
    "external-link": "ExternalLink",
  };

  const resolved = aliasMap[name] || toPascalCase(name);
  if (resolved in LucideIcons && typeof (LucideIcons as Record<string, unknown>)[resolved] !== "undefined") {
    return resolved;
  }

  return null;
}

export function isSupportedIconName(name: string): boolean {
  return resolveIconName(name) !== null;
}
