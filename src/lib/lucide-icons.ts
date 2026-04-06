import dynamicIconImports from "lucide-react/dynamicIconImports";

const iconAliases = {
  externalLink: "external-link",
} as const;

export type DynamicIconName = keyof typeof dynamicIconImports;

export function resolveIconName(name: string): DynamicIconName | null {
  const aliasMap = iconAliases as Record<string, DynamicIconName>;
  const resolved = aliasMap[name] ?? name;

  if (resolved in dynamicIconImports) {
    return resolved as DynamicIconName;
  }

  return null;
}

export function isSupportedIconName(name: string): boolean {
  return resolveIconName(name) !== null;
}
