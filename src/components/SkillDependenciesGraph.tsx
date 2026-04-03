"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import SectionHeader from "./SectionHeader";
import { getToolIcon } from "@/lib/tool-icons";

interface Node {
  id: string;
  category: "language" | "platform" | "tool" | "outcome";
  level?: number;
}

interface Link {
  source: string;
  target: string;
  strength: number;
}

// Short text labels (keeps the visual readable under the icon).
const NODE_TEXT_LABELS: Record<string, string> = {
  "GitHub Actions": "GH Actions",
  "Cost Optimization": "Cost",
  PostgreSQL: "Postgres",
  CloudWatch: "CloudWatch",
  Infrastructure: "Infra",
  Observability: "Obs",
  Automation: "Auto",
};

export default function SkillDependenciesGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 400 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        if (entries[0]) {
          const { width } = entries[0].contentRect;
          setDimensions({ width, height: 400 });
        }
      });
      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
    }
  }, [isClient]);

  useEffect(() => {
    if (!isClient || !svgRef.current || dimensions.width === 0) return;

    const { width, height } = dimensions;

    const nodes: Node[] = [
      // Languages
      { id: "Python", category: "language", level: 85 },
      { id: "Bash", category: "language", level: 75 },
      { id: "HCL", category: "language", level: 90 },
      { id: "Git", category: "tool", level: 90 },

      // Platforms
      { id: "AWS", category: "platform", level: 95 },
      { id: "IAM", category: "platform", level: 80 },
      { id: "Kubernetes", category: "platform", level: 75 },
      { id: "Docker", category: "tool", level: 85 },
      { id: "Supabase", category: "platform", level: 80 },

      // Tools
      { id: "Terraform", category: "tool", level: 95 },
      { id: "CloudWatch", category: "tool", level: 85 },
      { id: "Prometheus", category: "tool", level: 80 },
      { id: "Grafana", category: "tool", level: 80 },
      { id: "GitHub Actions", category: "tool", level: 80 },
      { id: "CI/CD", category: "tool", level: 80 },
      { id: "n8n", category: "tool", level: 85 },
      { id: "Dagster", category: "tool", level: 80 },
      { id: "Jenkins", category: "tool", level: 75 },
      { id: "PostgreSQL", category: "tool", level: 80 },

      // Outcomes
      { id: "Infrastructure", category: "outcome" },
      { id: "Security", category: "outcome" },
      { id: "Cost Optimization", category: "outcome" },
      { id: "Observability", category: "outcome" },
      { id: "Automation", category: "outcome" },
      { id: "DevOps", category: "outcome" },
    ];

    const links: Link[] = [
      { source: "Python", target: "AWS", strength: 0.7 },
      { source: "Python", target: "Dagster", strength: 0.85 },
      { source: "Bash", target: "AWS", strength: 0.6 },
      { source: "HCL", target: "Terraform", strength: 1 },

      // Tools → Platforms
      { source: "Terraform", target: "AWS", strength: 0.9 },
      { source: "Docker", target: "Kubernetes", strength: 0.9 },
      { source: "Docker", target: "AWS", strength: 0.7 },
      { source: "n8n", target: "Supabase", strength: 0.85 },
      { source: "n8n", target: "Docker", strength: 0.7 },

      // → Infrastructure outcome
      { source: "AWS", target: "Infrastructure", strength: 0.95 },
      { source: "Terraform", target: "Infrastructure", strength: 0.95 },
      { source: "Kubernetes", target: "Infrastructure", strength: 0.8 },
      { source: "Docker", target: "Infrastructure", strength: 0.7 },

      // → Security outcome
      { source: "AWS", target: "Security", strength: 0.8 },
      { source: "IAM", target: "Security", strength: 0.95 },
      { source: "Jenkins", target: "Security", strength: 0.6 },

      // → Observability outcome
      { source: "CloudWatch", target: "Observability", strength: 0.9 },
      { source: "Prometheus", target: "Grafana", strength: 0.9 },
      { source: "Prometheus", target: "Observability", strength: 0.9 },
      { source: "Grafana", target: "Observability", strength: 0.9 },

      // → Automation outcome
      { source: "n8n", target: "Automation", strength: 0.95 },
      { source: "Dagster", target: "Automation", strength: 0.85 },
      { source: "GitHub Actions", target: "CI/CD", strength: 0.95 },
      { source: "Git", target: "GitHub Actions", strength: 0.95 },
      { source: "CI/CD", target: "Automation", strength: 0.8 },

      // → Cost Optimization outcome
      { source: "AWS", target: "Cost Optimization", strength: 0.8 },
      { source: "Terraform", target: "Cost Optimization", strength: 0.85 },

      // → DevOps (top-level outcome)
      { source: "Infrastructure", target: "DevOps", strength: 0.95 },
      { source: "Observability", target: "DevOps", strength: 0.85 },
      { source: "Automation", target: "DevOps", strength: 0.9 },
      { source: "Security", target: "DevOps", strength: 0.8 },
      { source: "Cost Optimization", target: "DevOps", strength: 0.75 },
    ];

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // Create simulation
    const simulation = d3
      .forceSimulation(nodes as any)
      .force(
        "link",
        d3
          .forceLink(links as any)
          .id((d: any) => d.id)
          .distance((d: any) => 100 * (2 - d.strength))
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(width < 500 ? 30 : 50));

    // Create links
    const link = svg
      .selectAll("line")
      .data(links as any)
      .enter()
      .append("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", (d: any) => d.strength * 0.6)
      .attr("stroke-width", (d: any) => d.strength * 2);

    // Create nodes
    const node = svg
      .selectAll("circle")
      .data(nodes as any)
      .enter()
      .append("circle")
      .attr("r", function (d: any) {
        // base radii by category
        let base = 20;
        if (d.category === "outcome") base = 35;
        else if (d.category === "platform") base = 28;
        else if (d.category === "tool") base = 24;

        if (width < 500) base *= 0.7;

        // increase radius when label is long (characters)
        const labelLen = String(d.id).length;
        const computed = Math.min(
          60,
          Math.max(base, Math.ceil(labelLen * (width < 500 ? 2 : 4)))
        );
        d.radius = computed; // Store radius in data
        return computed;
      })
      .attr("fill", (d: any) => {
        switch (d.category) {
          case "language":
            return "#3b82f6";
          case "platform":
            return "#10b981";
          case "tool":
            return "#f59e0b";
          case "outcome":
            return "#8b5cf6";
          default:
            return "#6b7280";
        }
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .call(
        d3
          .drag()
          .on("start", (event: any, d: any) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event: any, d: any) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event: any, d: any) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          }) as any
      );

    // Add icon images centered inside nodes.
    const iconImages = svg
      .selectAll("image.icon")
      .data(nodes as any)
      .enter()
      .append("image")
      .attr("class", "icon")
      .attr("href", (d: any) => getToolIcon(d.id)?.url ?? "")
      .attr("width", (d: any) => Math.max(12, Math.round((d.radius ?? 20) * 0.9)))
      .attr("height", (d: any) => Math.max(12, Math.round((d.radius ?? 20) * 0.9)))
      .attr("opacity", (d: any) => (getToolIcon(d.id) ? 0.96 : 0))
      .attr("pointer-events", "none");

    // Add text labels under icon.
    const labels = svg
      .selectAll("text.label")
      .data(nodes as any)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("data-node-id", (d: any) => d.id)
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .attr("font-weight", 600)
      .attr("fill", "#fff")
      .text((d: any) => NODE_TEXT_LABELS[d.id] ?? d.id)
      .attr("font-size", (d: any) =>
        `${Math.max(7, Math.round((d.radius ?? 20) * 0.21))}px`,
      )
      .attr("dy", (d: any) => `${Math.max(14, Math.round((d.radius ?? 20) * 0.7))}px`);

    // Node hover interactivity: highlight hovered node label + connected edges.
    node
      .attr("cursor", "grab")
      .on("mouseenter", (event: any, d: any) => {
        const related = (l: any) =>
          l.source?.id === d.id || l.target?.id === d.id;

        // Don't dim other labels; clicking should never make the rest unreadable.
        labels.attr("opacity", 1);
        link.attr("stroke-opacity", (l: any) =>
          related(l) ? l.strength * 0.9 : l.strength * 0.12,
        );

        d3.select(event.currentTarget)
          .attr("r", d.radius * 1.08)
          .attr("stroke-width", 4);
      })
      .on("mouseleave", () => {
        labels.attr("opacity", 1);
        link.attr(
          "stroke-opacity",
          (l: any) => l.strength * 0.6,
        );
        node.attr("r", (dd: any) => dd.radius).attr("stroke-width", 2);
      });

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y);

      iconImages
        .attr("x", (d: any) => d.x - Math.max(12, Math.round((d.radius ?? 20) * 0.9)) / 2)
        .attr("y", (d: any) => d.y - Math.max(12, Math.round((d.radius ?? 20) * 0.9)) / 2);

      labels.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });
  }, [isClient, dimensions]);

  if (!isClient) {
    return (
      <div
        ref={containerRef}
        className="flex h-96 items-center justify-center rounded-lg border border-border/50 bg-card/50"
      >
        <p className="text-muted-foreground">Loading graph...</p>
      </div>
    );
  }

  return (
    <section id="skill-graph" className="scroll-mt-28 flex flex-col gap-6">
      <SectionHeader
        title="skill dependencies"
        description="How my technologies and skills interconnect (drag nodes to explore)"
      />

      <div
        ref={containerRef}
        className="flex flex-col gap-4 rounded-lg border border-border/50 bg-card/50 p-4 backdrop-blur-sm"
      >
        <svg
          ref={svgRef}
          className="w-full"
          style={{ maxHeight: "500px", border: "1px solid var(--border)" }}
        />

        {/* Legend */}
        <div className="flex flex-wrap gap-4 border-t border-border/50 pt-4">
          <div className="flex items-center gap-2">
            <div className="size-4 rounded-full bg-blue-500" />
            <span className="text-xs text-muted-foreground">Languages</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-4 rounded-full bg-green-500" />
            <span className="text-xs text-muted-foreground">Platforms</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-4 rounded-full bg-amber-500" />
            <span className="text-xs text-muted-foreground">Tools</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-4 rounded-full bg-purple-500" />
            <span className="text-xs text-muted-foreground">Outcomes</span>
          </div>
        </div>
      </div>
    </section>
  );
}
