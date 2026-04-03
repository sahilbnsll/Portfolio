"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";
import skillsData from "@/data/skills.json";
import careerData from "@/data/career.json";
import certificationsData from "@/data/certifications.json";
import projectsData from "@/data/projects.json";
import blogData from "@/data/blog.json";

type Line = { kind: "cmd" | "out" | "tip"; text: string };

const PROMPT = "sahil@portfolio ~ % ";

function section(title: string, rows: string[] = []) {
  return [``, `=== ${title} ===`, ...rows, ``];
}

const OUTPUTS: Record<string, { lines: string[]; tip?: string }> = {
  help: {
    lines: [
      "Sahil Terminal — try commands below:",
      "",
      "  help                 This reference",
      "  ls                    Show portfolio sections",
      "  ls skills             Core skills (summary)",
      "  skills <keyword>      Find a specific skill",
      "  ls experience         Roles + impact bullets",
      "  ls projects          Projects list",
      "  ls blog              Blog post index",
      "  project <slug>        Project quick summary",
      "  stats                 Key quantified outcomes",
      "  contact               Reach Sahil directly",
      "  open <project-slug>  Open a project case study",
      "  cat skills            Skills details (with %)",
      "  clear                 Reset output",
      "",
    ],
  },
  "terraform plan": {
    tip: "Always `terraform fmt && validate` in CI before plan applies to prod.",
    lines: [
      "Terraform used the selected providers to generate the following execution",
      "plan. Resource actions are indicated with the following symbols:",
      "  + create    ~ update in-place    - destroy",
      "",
      "  # aws_eks_cluster.main will be updated in-place",
      "  ~ scaling_config { max_size = 5 → 7 }",
      "",
      "Plan: 1 to add, 2 to change, 0 to destroy.",
      "",
      "→ Next: open a PR; attach plan output; require review for prod workspaces.",
    ],
  },
  "kubectl get pods": {
    tip: "Pair with `kubectl describe pod` and events when restarts spike.",
    lines: [
      "NAME                              READY   STATUS    RESTARTS   AGE",
      "api-7d9f8c6b4-xxvk2               1/1     Running   0          3d",
      "worker-5c8d9f7b-klm4n             1/1     Running   0          3d",
      "ingress-nginx-controller-abc123   1/1     Running   0          12d",
      "",
      "→ Hint: if READY stays 0/1, check image pull + probes first.",
    ],
  },
  "aws sso login": {
    tip: "Use named profiles; rotate sessions—don’t export long-lived keys locally.",
    lines: [
      "$ aws configure sso",
      "SSO session [my-sso]:",
      "SSO start URL [https://d-xxxxxxxx.awsapps.com/start]:",
      "...",
      "",
      "Cheat-sheet:",
      "  aws sso login --profile dev",
      "  export AWS_PROFILE=dev",
      "  aws sts get-caller-identity",
    ],
  },
  "gh workflow list": {
    tip: "Protect default branch with required checks before enabling auto-merge.",
    lines: [
      "NAME                              STATE   UPDATED",
      "ci.yaml                           active  2h ago",
      "deploy-prod.yaml                active  1d ago",
      "release.yaml                    active  3d ago",
      "",
      "→ Try: gh run list --workflow ci.yaml --limit 5",
    ],
  },
};

function normalizeCmd(raw: string): string {
  return raw.trim().toLowerCase().replace(/\s+/g, " ");
}

function getResponseForCmd(cmd: string): { lines: string[]; tip?: string } {
  // Portfolio-specific commands.
  if (cmd === "ls") {
    return {
      lines: section("Portfolio Sections", [
        "skills",
        "expertise",
        "experience",
        "certifications",
        "projects",
        "blog",
        "Try: ls skills",
      ]),
    };
  }

  if (cmd === "ls skills" || cmd === "ls expertise") {
    const categories = (skillsData.categories ?? []).map((c) => ({
      name: c.name,
      count: c.skills.length,
    }));

    return {
      lines: section(
        "Skills & Expertise",
        categories.map((c) => `- ${c.name} (${c.count} skills)`),
      ),
      tip: cmd === "ls skills" ? "Use `ls expertise` too; same lanes in this portfolio." : undefined,
    };
  }

  if (cmd.startsWith("skills ")) {
    const query = cmd.replace(/^skills\s+/, "").trim();
    const all = (skillsData.categories ?? []).flatMap((c) => c.skills ?? []);
    const matches = all.filter((s: any) =>
      `${s.name} ${s.description}`.toLowerCase().includes(query),
    );
    if (matches.length === 0) {
      return {
        lines: section("Skill Search", [
          `No skills matched "${query}".`,
          "Try: skills aws",
        ]),
      };
    }
    return {
      lines: section(
        `Skill Search: ${query}`,
        matches.slice(0, 8).map((s: any) => `- ${s.name} (${s.level}%) - ${s.description}`),
      ),
    };
  }

  if (cmd === "ls experience") {
    const roles = (careerData.career ?? []).flatMap((org) =>
      (org.positions ?? []).map((pos) => ({
        org: org.name,
        title: pos.title,
        start: pos.start,
        end: (pos as any).end as string | undefined,
        description: pos.description ?? [],
      })),
    );

    return {
      lines: [
        ...section("Experience"),
        ...roles.map((r) => {
          const when = r.end ? `${r.start} → ${r.end}` : r.start;
          const bullets = r.description.slice(0, 2).map((d) => `    • ${d}`);
          return [`  ${r.org} — ${r.title} (${when})`, ...bullets].join("\n");
        }),
      ].flatMap((s) => s.split("\n")),
      tip: "Want projects matching this impact? Try `ls projects` and open a case study.",
    };
  }

  if (cmd === "ls certifications") {
    const certs = certificationsData.certifications ?? [];
    return {
      lines: [
        ...section("Certifications"),
        ...certs.map(
          (c: any) =>
            `  - ${c.name} (${c.organization}) — ${c.issueDate}`,
        ),
      ],
    };
  }

  if (cmd === "ls projects") {
    const projects = projectsData.projects ?? [];
    return {
      lines: [
        ...section("Projects"),
        ...projects.map((p: any) => {
          const slug = p.slug ?? (p.href ? String(p.href).split("/projects/")[1] : "");
          return `- ${p.name}  [${slug}]`;
        }),
      ],
      tip: "Open one: `open <project-slug>` (example: `open zabeSync`).".replace(
        "zabeSync",
        "zabesync",
      ),
    };
  }

  if (cmd === "ls blog") {
    const posts = blogData.posts ?? [];
    return {
      lines: [
        ...section("Blog Index"),
        ...posts.map((p: any) => `- ${p.title} (${p.date})`),
      ],
      tip: "Open the blog page to read: /blog",
    };
  }

  // Exact matches first.
  const direct = OUTPUTS[cmd];
  if (direct) return direct;

  if (cmd === "stats") {
    return {
      lines: section("Impact Highlights", [
        "- 99.99% platform availability (500+ merchants)",
        "- 40% AWS cost reduction (~$40k/year)",
        "- 93% faster deployments",
        "- 0-downtime Auth0 migration for 1,000+ users",
      ]),
    };
  }

  if (cmd === "contact") {
    return {
      lines: section("Contact", [
        "Email: sahilbansal.sb24@gmail.com",
        "Portfolio: /contact",
        "LinkedIn: linkedin.com/in/sahilbansal24",
      ]),
    };
  }

  if (cmd.startsWith("project ")) {
    const slug = cmd.replace(/^project\s+/, "").trim();
    const p = (projectsData.projects ?? []).find((x: any) => x.slug === slug);
    if (!p) {
      return { lines: section("Project", [`No project found for slug "${slug}".`]) };
    }
    return {
      lines: section(p.name, [
        p.summary ?? "No summary",
        `Case study: /projects/${p.slug}`,
      ]),
      tip: "Run `open <slug>` to navigate directly.",
    };
  }

  if (cmd === "blog") {
    return {
      lines: section("Blog", [
        "Latest writings, migration notes, and DevOps learnings.",
        "Open: /blog",
      ]),
    };
  }

  // Portfolio-specific "cat" (detailed view).
  if (cmd.startsWith("cat ")) {
    const topic = cmd.replace(/^cat\s+/, "").trim();
    if (!topic) {
      return {
        lines: ["Usage:", "  cat skills", "  cat experience", "  cat projects", "  cat certifications"],
        tip: "Use `ls` first to see available sections.",
      };
    }

    if (topic === "skills" || topic === "expertise") {
      const cats = skillsData.categories ?? [];
      return {
        lines: [
          "skills & expertise:",
          ...cats.flatMap((c) =>
            (c.skills ?? []).map((s: any) => {
              const level = typeof s.level === "number" ? `${s.level}%` : "";
              const desc = s.description ? ` - ${s.description}` : "";
              return `  - ${s.name}${level ? ` ${level}` : ""}${desc}`;
            }),
          ),
        ],
        tip: "Open the graph for the dependency view.",
      };
    }

    if (topic === "experience") {
      const roles = (careerData.career ?? []).flatMap((org) =>
        (org.positions ?? []).map((pos) => ({
          org: org.name,
          title: pos.title,
          start: pos.start,
          end: (pos as any).end as string | undefined,
          description: pos.description ?? [],
        })),
      );
      return {
        lines: [
          "experience:",
          ...roles.flatMap((r) => {
            const when = r.end ? `${r.start} → ${r.end}` : r.start;
            return [
              `  ${r.org} — ${r.title} (${when})`,
              ...r.description.map((d) => `    • ${d}`),
            ];
          }),
        ],
      };
    }

    if (topic === "certifications") {
      const certs = certificationsData.certifications ?? [];
      return {
        lines: [
          "certifications:",
          ...certs.map((c: any) => `  - ${c.name} (${c.organization}) — ${c.issueDate} [${c.credentialId}]`),
        ],
      };
    }

    if (topic === "projects") {
      const projects = projectsData.projects ?? [];
      return {
        lines: [
          "projects:",
          ...projects.map((p: any) => {
            const url = p.slug ? `/projects/${p.slug}` : p.href ?? "";
            return `  - ${p.name} ${url ? `→ ${url}` : ""}`;
          }),
        ],
        tip: "Use: open <project-slug>",
      };
    }
  }

  // Terraform quick guidance.
  if (cmd.startsWith("terraform ")) {
    const sub = cmd.replace("terraform ", "");
    const tip =
      "Make changes reviewable: run `terraform fmt && validate`, then require review for `apply` in shared environments.";
    const lines: string[] = [`Terraform ${sub} preview:`, "1) validate config", "2) confirm providers and variables", "3) execute with least privilege"];
    return { lines, tip };
  }

  // kubectl quick guidance.
  if (cmd.startsWith("kubectl ")) {
    const tip =
      "When something breaks: start with `kubectl get`, then `describe`, then `logs`—and check events for the real cause.";
    const lines: string[] = [
      "kubectl preview:",
      "• `get` shows state",
      "• `describe` shows events + probe config",
      "• `logs` shows application output",
    ];
    return { lines, tip };
  }

  // AWS quick guidance.
  if (cmd.startsWith("aws ")) {
    const tip =
      "Verify identity + region first, then apply least-privilege IAM and explicit tagging for cost tracking.";
    const lines: string[] = [
      "aws preview:",
      "Try common checks:",
      "• `aws sso login --profile <name>`",
      "• `aws sts get-caller-identity`",
      "• `aws eks update-kubeconfig --name <cluster>`",
    ];
    return { lines, tip };
  }

  // GH quick guidance.
  if (cmd.startsWith("gh ")) {
    return {
      lines: [
        "gh preview:",
        "• `gh workflow list` to see CI pipelines",
        "• `gh run list` to inspect run history",
        "• `gh pr list` to triage PRs quickly",
      ],
      tip: "Always link PRs to build results; require checks before merging.",
    };
  }

  // Docker quick guidance.
  if (cmd.startsWith("docker ")) {
    return {
      lines: [
        "docker preview:",
        "• `docker ps` list running containers",
        "• `docker logs <container>` inspect output",
        "• `docker images` view build history",
      ],
      tip: "When logs are noisy, use timestamps and limit output to the time window around the incident.",
    };
  }

  // Git quick guidance.
  if (cmd.startsWith("git ")) {
    return {
      lines: [
        "git preview:",
        "• `git status` see local changes",
        "• `git diff` inspect what will change",
        "• `git log --oneline` browse history",
      ],
      tip: "Keep commits small and descriptive; use a clean PR diff for reviewers.",
    };
  }

  // Linux quick guidance.
  if (cmd === "help") return OUTPUTS.help;
  if (cmd === "clear")
    return { lines: ["Cleared. Type `help` for commands."], tip: undefined };
  if (cmd === "pwd")
    return { lines: ["/home/sahil/portfolio (preview)"], tip: "Use absolute paths to avoid “works on my machine” issues." };
  if (cmd === "ls")
    return {
      lines: ["index.html", "package.json", "src/", "README.md", "next.config.mjs"],
      tip: "Pair `ls -la` to see hidden files and permissions.",
    };
  if (cmd.startsWith("cat "))
    return {
      lines: ["Preview of file contents:", "…"],
      tip: "For long logs, prefer `sed -n '1,120p'` or `head`/`tail` first.",
    };
  if (cmd.startsWith("grep "))
    return {
      lines: ["Searching… (preview)"],
      tip: "Use `grep -n` for line numbers and quote the pattern to avoid shell surprises.",
    };
  if (cmd.startsWith("cd "))
    return { lines: [`Moved to ${cmd.replace("cd ", "")} (preview)`], tip: "Use `cd -` to return to the previous directory." };

  // Fallback: always respond with something useful.
  return {
    lines: [
      `Unknown command: ${cmd}`,
      "Try:",
      "  help",
      "  ls",
      "  ls skills",
    ],
    tip: "This terminal is portfolio-specific. Use the `ls` commands to explore.",
  };
}

export default function InteractiveTerminal({
  className,
}: {
  className?: string;
}) {
  const router = useRouter();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [lines, setLines] = useState<Line[]>([
    {
      kind: "out",
      text: "Sahil Terminal — type `help` to explore skills, experience, projects.",
    },
  ]);
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const didInitRef = useRef(false);

  const scrollEnd = useCallback(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, []);

  useEffect(() => {
    // Avoid jumping the whole page down to the terminal on initial load.
    if (!didInitRef.current) {
      didInitRef.current = true;
      return;
    }
    scrollEnd();
  }, [lines, scrollEnd]);

  // Intentionally do NOT auto-focus on mount:
  // focusing would scroll the page down to the terminal.

  const run = useCallback(
    (raw: string) => {
      const cmd = normalizeCmd(raw);
      if (busy) return;

      if (cmd.startsWith("open ")) {
        const slug = cmd.replace(/^open\s+/, "").trim();
        const exists = (projectsData.projects ?? []).some((p: any) => {
          if (p.slug && String(p.slug) === slug) return true;
          return p.href ? String(p.href).includes(`/projects/${slug}`) : false;
        });

        setBusy(true);
        setLines((L) => [...L, { kind: "cmd", text: PROMPT + raw }]);

        const delay = prefersReducedMotion ? 0 : 250;
        window.setTimeout(() => {
          if (!slug || !exists) {
            setLines((L) => [
              ...L,
              {
                kind: "out",
                text: "Project not found. Try `ls projects` first.",
              },
            ]);
            setBusy(false);
            setDraft("");
            return;
          }

          setLines((L) => [
            ...L,
            { kind: "out", text: `Opening case study: /projects/${slug}` },
          ]);
          setDraft("");
          setBusy(false);
          router.push(`/projects/${slug}`);
        }, delay);

        return;
      }

      if (cmd === "clear") {
        setLines([{ kind: "out", text: "Cleared. Type `help` for common commands." }]);
        setDraft("");
        return;
      }

      setBusy(true);
      setLines((L) => [...L, { kind: "cmd", text: PROMPT + raw }]);

      const delay = prefersReducedMotion ? 0 : 320;
      window.setTimeout(() => {
        const pack = getResponseForCmd(cmd);
        if (pack) {
          setLines((L) => [
            ...L,
            ...pack.lines.map((text) => ({ kind: "out" as const, text })),
            ...(pack.tip
              ? [{ kind: "tip" as const, text: `Tip: ${pack.tip}` }]
              : []),
          ]);
        } else {
          setLines((L) => [
            ...L,
            {
              kind: "out",
              text: "No preview found. Try `help` for common workflows.",
            },
          ]);
        }
        setDraft("");
        setBusy(false);
      }, delay);
    },
    [busy, prefersReducedMotion],
  );

  const chips = [
    "help",
    "ls skills",
    "ls projects",
    "ls experience",
    "cat skills",
    "clear",
  ];

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border/70 bg-zinc-950 text-zinc-100 shadow-xl ring-1 ring-white/10",
        className,
      )}
      onMouseDown={() => inputRef.current?.focus()}
    >
      <div className="border-b border-white/10 bg-zinc-900/90 px-3 py-2 text-[11px] font-mono text-zinc-400">
        Sahil Terminal
      </div>
      <div className="relative max-h-[280px] min-h-[220px] overflow-y-auto p-3 font-mono text-[11px] leading-relaxed sm:max-h-[320px] sm:text-xs">
        {lines.map((line, idx) => (
          <div
            key={`${idx}-${line.text.slice(0, 24)}`}
            className={cn(
              "whitespace-pre-wrap break-words",
              line.kind === "cmd" && "text-emerald-300",
              line.kind === "out" &&
                (line.text.startsWith("===")
                  ? "my-1 rounded-md border border-white/10 bg-white/5 px-2 py-1 font-semibold text-zinc-100"
                  : line.text.startsWith("- ")
                    ? "pl-2 text-zinc-200"
                    : line.text.startsWith("Try:")
                      ? "text-zinc-100"
                      : "text-zinc-300"),
              line.kind === "tip" &&
                "mt-1 border-l-2 border-amber-400/90 pl-2 text-amber-200/95",
            )}
          >
            {line.text}
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div
        className="border-t border-white/10 bg-zinc-900/80 px-2 py-2"
        onMouseDown={() => inputRef.current?.focus()}
      >
        <div className="mb-2 flex flex-wrap gap-1.5">
          {chips.map((c) => (
            <button
              key={c}
              type="button"
              disabled={busy}
              onClick={() => run(c)}
              className="rounded-md border border-white/10 bg-zinc-800/90 px-2 py-1 text-[10px] text-zinc-200 transition-colors hover:border-emerald-500/40 hover:text-white disabled:opacity-40"
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="shrink-0 font-mono text-[11px] text-emerald-300 animate-pulse">
            {PROMPT}
          </span>
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (busy || !draft.trim()) return;
                run(draft);
              }
            }}
            disabled={busy}
            style={{ caretColor: "#34d399" }}
            className="min-w-0 flex-1 bg-transparent px-0 py-0.5 font-mono text-[11px] text-zinc-100 outline-none"
            aria-label="Terminal command input"
          />
        </div>
      </div>
    </div>
  );
}
