"use client";

import ArchitectureDiagram from "@/components/ArchitectureDiagram";
import CICDPipeline from "@/components/CICDPipeline";

type SectionProps = {
  withHeading?: boolean;
};

export function ArchitectureSection({ withHeading = true }: SectionProps) {
  return (
    <div className="space-y-4">
      {withHeading ? (
        <h2 className="font-serif text-2xl font-bold">System Architecture</h2>
      ) : null}
      <p className="text-sm text-muted-foreground">
        Interactive architecture map — click any component to inspect decisions.
      </p>
      <ArchitectureDiagram />
    </div>
  );
}

export function PipelineSection({ withHeading = true }: SectionProps) {
  return (
    <div className="space-y-4">
      {withHeading ? (
        <h2 className="font-serif text-2xl font-bold">Deployment Pipeline</h2>
      ) : null}
      <p className="text-sm text-muted-foreground">
        Production CI/CD flow — click any stage for implementation details.
      </p>
      <CICDPipeline />
    </div>
  );
}
