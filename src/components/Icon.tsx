import React, { lazy, Suspense, useMemo } from "react";
import { LucideProps } from "lucide-react";
import dynamicIconImports from "lucide-react/dynamicIconImports";
import { resolveIconName } from "@/lib/lucide-icons";

const fallback = <div style={{ background: "#ddd", width: 24, height: 24 }} />;

interface IconProps extends Omit<LucideProps, "ref"> {
  name: string;
}

const Icon = ({ name, ...props }: IconProps) => {
  const iconName = resolveIconName(name);
  const LucideIcon = useMemo(() => {
    if (!iconName) {
      return null;
    }

    return lazy(dynamicIconImports[iconName]);
  }, [iconName]);

  if (!LucideIcon) {
    return fallback;
  }

  return (
    <Suspense fallback={fallback}>
      <LucideIcon {...props} />
    </Suspense>
  );
};

export default Icon;
