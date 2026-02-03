"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import SectionHeader from "./SectionHeader";

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

// Function to wrap text
function wrap(text: any, width: number) {
  text.each(function (this: SVGTextElement) { // Explicitly type 'this' as SVGTextElement
    const text = d3.select(this);
    const words = text.text().split(/\s+/).reverse();
    let word;
    let line: any[] = [];
    let lineNumber = 0;
    const lineHeight = 1.1; // ems
    const y = text.attr("y");
    const dy = parseFloat(text.attr("dy"));
    let tspan = text
      .text(null)
      .append("tspan")
      .attr("x", 0)
      .attr("y", y)
      .attr("dy", dy + "em");

    while ((word = words.pop())) {
      line.push(word);
      tspan.text(line.join(" "));
      if ((tspan.node() as any).getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text
          .append("tspan")
          .attr("x", 0)
          .attr("y", y)
          .attr("dy", ++lineNumber * lineHeight + dy + "em")
          .text(word);
      }
    }
  });
}

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
      { id: "Kubernetes", category: "platform", level: 75 },
      { id: "Docker", category: "tool", level: 85 },

      // Tools
      { id: "Terraform", category: "tool", level: 95 },
      { id: "Prometheus", category: "tool", level: 80 },
      { id: "Grafana", category: "tool", level: 80 },
      { id: "GitHub Actions", category: "tool", level: 80 },
      { id: "CI/CD", category: "tool", level: 80 },

      // Outcomes
      { id: "Infrastructure", category: "outcome" },
      { id: "Observability", category: "outcome" },
      { id: "DevOps", category: "outcome" },
    ];

    const links: Link[] = [
      // Python to AWS
      { source: "Python", target: "AWS", strength: 0.7 },
      // Bash to AWS
      { source: "Bash", target: "AWS", strength: 0.6 },
      // HCL to Terraform
      { source: "HCL", target: "Terraform", strength: 1 },
      // Terraform to AWS
      { source: "Terraform", target: "AWS", strength: 0.9 },
      // AWS to Infrastructure
      { source: "AWS", target: "Infrastructure", strength: 0.95 },
      // Terraform to Infrastructure
      { source: "Terraform", target: "Infrastructure", strength: 0.95 },
      // Prometheus to Grafana
      { source: "Prometheus", target: "Grafana", strength: 0.9 },
      // Git and CI/CD
      { source: "Git", target: "GitHub Actions", strength: 0.95 },
      { source: "GitHub Actions", target: "CI/CD", strength: 0.95 },
      { source: "CI/CD", target: "DevOps", strength: 0.8 },
      // Docker connections
      { source: "Docker", target: "Kubernetes", strength: 0.9 },
      { source: "Docker", target: "Infrastructure", strength: 0.7 },
      // Prometheus to Observability
      { source: "Prometheus", target: "Observability", strength: 0.9 },
      // Grafana to Observability
      { source: "Grafana", target: "Observability", strength: 0.9 },
      // Observability to DevOps
      { source: "Observability", target: "DevOps", strength: 0.85 },
      // Infrastructure to DevOps
      { source: "Infrastructure", target: "DevOps", strength: 0.95 },
      // Kubernetes to Infrastructure
      { source: "Kubernetes", target: "Infrastructure", strength: 0.8 },
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

    // Add labels as text elements
    const labels = svg
      .selectAll("text.label")
      .data(nodes as any)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .attr("font-size", width < 400 ? "7px" : width < 500 ? "8.5px" : "11px")
      .attr("font-weight", 600)
      .attr("fill", "#fff")
      .text((d: any) => d.id)
      .attr("dy", "0.3em")
      .each(function (d: any) {
        // On mobile, wrap to node radius, not radius*1.5
        const wrapWidth = width < 500 ? d.radius - 6 : d.radius * 1.5 - 10;
        wrap(d3.select(this), wrapWidth);
      });

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y);

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
    <section className="flex flex-col gap-6">
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
