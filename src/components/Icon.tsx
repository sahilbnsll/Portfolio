import React from "react";
import * as LucideIcons from "lucide-react";
import { LucideProps } from "lucide-react";
import { resolveIconName } from "@/lib/lucide-icons";

const fallback = <div style={{ background: "#ddd", width: 24, height: 24 }} />;

interface IconProps extends Omit<LucideProps, "ref"> {
  name: string;
}

const Icon = ({ name, ...props }: IconProps) => {
  const iconName = resolveIconName(name);
  if (!iconName) {
    return fallback;
  }

  const IconComponent = (LucideIcons as Record<string, unknown>)[iconName] as React.ComponentType<LucideProps> | undefined;

  if (!IconComponent || (typeof IconComponent !== "function" && typeof IconComponent !== "object")) {
    return fallback;
  }

  return <IconComponent {...props} />;
};

export default Icon;
