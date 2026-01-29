"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface ArchNode {
  id: string;
  label: string;
  type: "layer" | "service" | "tool" | "outcome";
  layer: number;
}

interface ArchLink {
  source: string;
  target: string;
  strength: number;
}

const nodes: ArchNode[] = [
  // Application Layer
  { id: "api", label: "API Layer", type: "layer", layer: 0 },
  { id: "web", label: "Web Services", type: "layer", layer: 0 },

  // Processing Layer
  { id: "compute", label: "Compute", type: "service", layer: 1 },
  { id: "queue", label: "Message Queue", type: "service", layer: 1 },
  { id: "worker", label: "Workers", type: "service", layer: 1 },

  // Infrastructure Layer
  { id: "k8s", label: "Kubernetes", type: "tool", layer: 2 },
  { id: "terraform", label: "Terraform", type: "tool", layer: 2 },
  { id: "network", label: "Network", type: "service", layer: 2 },
  { id: "docker", label: "Docker", type: "tool", layer: 2 },
  { id: "git", label: "Git", type: "tool", layer: 2 },
  { id: "gha", label: "GitHub Actions", type: "tool", layer: 2 },

  // Observability Layer
  { id: "prom", label: "Prometheus", type: "tool", layer: 3 },
  { id: "grafana", label: "Grafana", type: "tool", layer: 3 },
  { id: "logs", label: "Log Aggregation", type: "service", layer: 3 },

  // Outcomes
  { id: "reliability", label: "99.99% Uptime", type: "outcome", layer: 4 },
  { id: "scaling", label: "Auto-Scaling", type: "outcome", layer: 4 },
  { id: "visibility", label: "Full Observability", type: "outcome", layer: 4 },
  { id: "cicd", label: "CI/CD", type: "outcome", layer: 4 },
];

const links: ArchLink[] = [
  // API to Processing
  { source: "api", target: "compute", strength: 0.8 },
  { source: "web", target: "compute", strength: 0.8 },
  { source: "compute", target: "queue", strength: 0.7 },

  // Processing to Infrastructure
  { source: "compute", target: "k8s", strength: 0.9 },
  { source: "worker", target: "k8s", strength: 0.9 },
  { source: "queue", target: "k8s", strength: 0.7 },
  { source: "k8s", target: "terraform", strength: 0.8 },
  { source: "k8s", target: "network", strength: 0.9 },

  // Infrastructure to Observability
  { source: "k8s", target: "prom", strength: 0.8 },
  { source: "compute", target: "prom", strength: 0.7 },
  { source: "prom", target: "grafana", strength: 0.9 },
  { source: "k8s", target: "logs", strength: 0.8 },

  // Git, Docker and CI/CD
  { source: "git", target: "gha", strength: 0.95 },
  { source: "gha", target: "cicd", strength: 0.95 },
  { source: "cicd", target: "compute", strength: 0.6 },
  { source: "docker", target: "k8s", strength: 0.9 },
  { source: "docker", target: "compute", strength: 0.6 },

  // Observability to Outcomes
  { source: "prom", target: "reliability", strength: 0.9 },
  { source: "grafana", target: "visibility", strength: 0.9 },
  { source: "k8s", target: "scaling", strength: 0.8 },
  { source: "terraform", target: "scaling", strength: 0.8 },
];

const typeColors: Record<string, string> = {
  layer: "#3b82f6",      // blue
  service: "#10b981",    // green
  tool: "#f59e0b",       // amber
  outcome: "#8b5cf6",    // purple
};

export default function ArchitectureVisualization() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // Create simulation
    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links)
        .id((d: any) => d.id)
        .strength((d: any) => d.strength)
        .distance(80)
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("collide", d3.forceCollide().radius(40))
      .force("x", d3.forceX(width / 2).strength(0.1))
      .force("y", d3.forceY(height / 2).strength(0.1));

    // Add links
    const link = svg.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.3)
      .attr("stroke-width", (d: any) => d.strength * 3);

    // Add nodes with dynamic radius based on label length
    const node = svg.append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", (d: any) => {
        let base = 20;
        if (d.type === "outcome") base = 30;
        else if (d.type === "tool") base = 26;
        else if (d.type === "service") base = 22;
        const labelLen = String(d.label).length;
        return Math.min(70, Math.max(base, Math.ceil(labelLen * 3.8)));
      })
      .attr("fill", (d: any) => typeColors[d.type])
      .attr("opacity", 0.8)
      .call((d3.drag() as any)
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
      )
      .on("mouseenter", function() {
        d3.select(this).transition().duration(300).attr("r", function(this: any, d: any) { return +d3.select(this).attr('r') * 1.15; }).attr("opacity", 1);
      })
      .on("mouseleave", function() {
        d3.select(this).transition().duration(300).attr("r", function(this: any, d: any) { return +d3.select(this).attr('r') / 1.15; }).attr("opacity", 0.8);
      });

    // Add labels as text elements with tspans to keep text inside nodes
    const labels = svg.append("g")
      .selectAll("text.label")
      .data(nodes)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .attr("font-size", "11px")
      .attr("font-weight", 500)
      .attr("fill", "white")
      .each(function(d: any) {
        const g = d3.select(this as any);
        const words = String(d.label).split(" ");
        const lines = words.length <= 2 ? [d.label] : [words.slice(0, Math.ceil(words.length / 2)).join(" "), words.slice(Math.ceil(words.length / 2)).join(" ")];
        lines.forEach((line, i) => {
          g.append("tspan")
            .attr("x", 0)
            .attr("dy", i === 0 ? (lines.length === 1 ? "0.3em" : "-0.4em") : "1.1em")
            .text(line);
        });
      });

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("cx", (d: any) => d.x)
        .attr("cy", (d: any) => d.y);

      labels.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="w-full rounded-lg border border-border bg-card p-6"
    >
      <motion.div variants={itemVariants} className="mb-6">
        <h2 className="text-2xl font-bold mb-2">DevOps Architecture</h2>
        <p className="text-muted-foreground text-sm">
          Interactive visualization of technology layers and their interconnections
        </p>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="relative w-full rounded-lg border border-border/50 bg-muted/20 overflow-hidden"
      >
        <svg
          ref={svgRef}
          className="w-full h-96"
          style={{ background: "var(--card-bg)" }}
        />
      </motion.div>

      {/* Legend */}
      <motion.div variants={itemVariants} className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {Object.entries(typeColors).map(([type, color]) => (
          <div key={type} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-xs text-muted-foreground capitalize">{type}</span>
          </div>
        ))}
      </motion.div>

      <motion.p variants={itemVariants} className="mt-4 text-xs text-muted-foreground">
        💡 Drag nodes to explore connections. Hover to see detailed view.
      </motion.p>
    </motion.section>
  );
}
