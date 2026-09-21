"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useViewMode } from "@/contexts/ViewModeContext";
import { sendEmail } from "@/lib/actions";
import { toast } from "sonner";
import {
  ArrowRight,
  Briefcase,
  FileDown,
  Mail,
  CheckCircle2,
  Loader2,
  ExternalLink,
  Sparkles,
  ArrowDownCircle,
  Zap,
  Calendar,
  Clock,
  Send,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export interface ActionDirective {
  type:
    | "navigate"
    | "scroll_to"
    | "view_mode"
    | "download_resume"
    | "hire_inquiry"
    | "filter_projects"
    | "send_lead"
    | "book_call"
    | "send_email"
    | "compose_email";
  path?: string;
  target?: string;
  label?: string;
  mode?: "recruiter" | "engineer";
  category?: string;
  company?: string;
  role?: string;
  name?: string;
  email?: string;
  message?: string;
  calLink?: string;
  subject?: string;
}

interface Props {
  actions: ActionDirective[];
  isLatest?: boolean;
}

function normalizeTarget(raw: string): string {
  const clean = (raw || "").trim().toLowerCase().replace(/^#/, "");
  const aliasMap: Record<string, string> = {
    lab: "terminal",
    terminal: "terminal",
    "projects-preview": "projects",
    project: "projects",
    projects: "projects",
    "engineering-philosophy": "philosophy",
    philosophy: "philosophy",
    "certifications-section": "certifications",
    certification: "certifications",
    certifications: "certifications",
    "testimonials-section": "testimonials",
    testimonial: "testimonials",
    testimonials: "testimonials",
    recommendations: "testimonials",
    "skills-section": "skills",
    skill: "skills",
    skills: "skills",
    "about-me": "about",
    bio: "about",
    about: "about",
    "recent-posts": "posts",
    post: "posts",
    posts: "posts",
    blog: "posts",
    graph: "graph",
    "skills-graph": "graph",
    "skill-graph": "graph",
    architecture: "architecture",
    "cloud-architecture": "architecture",
    "architecture-diagram": "architecture",
    "architecture-diagrams": "architecture",
    diagram: "architecture",
    diagrams: "architecture",
    system: "architecture",
    systems: "architecture",
    topography: "architecture",
    pipeline: "architecture",
  };
  return aliasMap[clean] || clean || "top";
}

function normalizePath(rawPath?: string): string {
  if (!rawPath) return "/";
  const clean = rawPath.trim();
  return clean.startsWith("/") ? clean : `/${clean}`;
}

export default function ChatActionCard({ actions, isLatest = false }: Props) {
  const router = useRouter();
  const { mode, setMode } = useViewMode();
  const [executedKeys, setExecutedKeys] = useState<Record<string, boolean>>({});
  const hasAutoRunRef = useRef(false);

  const handleScrollTo = useCallback(
    (rawTarget: string) => {
      const targetId = normalizeTarget(rawTarget);
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        router.push(`/#${targetId}`);
      }
    },
    [router]
  );

  // Autonomous execution for the latest assistant message
  useEffect(() => {
    if (!isLatest || hasAutoRunRef.current || !actions || actions.length === 0) return;

    // Find the first actionable autonomous action (scroll_to or navigate)
    const targetAction = actions.find(
      (a) => a.type === "scroll_to" || (a.type === "navigate" && a.path)
    );

    if (!targetAction) return;

    hasAutoRunRef.current = true;
    const timer = setTimeout(() => {
      if (targetAction.type === "scroll_to" && targetAction.target) {
        const targetId = normalizeTarget(targetAction.target);
        handleScrollTo(targetId);
        setExecutedKeys((prev) => ({ ...prev, [`scroll_${targetId}`]: true }));
        toast.info(`Scrolled to ${targetAction.label ?? targetId}`, {
          icon: <Zap className="size-4 text-primary" />,
        });
      } else if (targetAction.type === "navigate" && targetAction.path) {
        const targetPath = normalizePath(targetAction.path);
        router.push(targetPath);
        setExecutedKeys((prev) => ({ ...prev, [`nav_${targetPath}`]: true }));
        toast.info(`Navigated to ${targetAction.label ?? targetPath}`, {
          icon: <Zap className="size-4 text-primary" />,
        });
      }
    }, 750);

    return () => clearTimeout(timer);
  }, [actions, isLatest, router, handleScrollTo]);

  if (!actions || actions.length === 0) return null;

  return (
    <div className="mt-3 flex flex-col gap-2.5">
      {actions.map((act, i) => {
        if (act.type === "scroll_to") {
          const targetId = normalizeTarget(act.target ?? "top");
          const isExecuted = executedKeys[`scroll_${targetId}`];
          return (
            <button
              key={i}
              type="button"
              onClick={() => {
                handleScrollTo(targetId);
                setExecutedKeys((prev) => ({ ...prev, [`scroll_${targetId}`]: true }));
              }}
              className={`group flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left text-xs font-semibold transition-all hover:shadow-sm ${
                isExecuted
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                  : "border-primary/30 bg-primary/10 text-primary hover:border-primary/50 hover:bg-primary/20"
              }`}
            >
              <span className="flex items-center gap-1.5 truncate">
                {isExecuted ? (
                  <Zap className="size-3.5 shrink-0 text-emerald-400" />
                ) : (
                  <ArrowDownCircle className="size-3.5 shrink-0 text-primary" />
                )}
                <span className="truncate">{act.label ?? `Scroll to ${targetId}`}</span>
              </span>
              {isExecuted ? (
                <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] text-emerald-400 font-mono">
                  Scrolled
                </span>
              ) : (
                <ArrowRight className="size-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
              )}
            </button>
          );
        }

        if (act.type === "navigate") {
          const target = normalizePath(act.path);
          const isExecuted = executedKeys[`nav_${target}`];
          return (
            <button
              key={i}
              type="button"
              onClick={() => {
                router.push(target);
                setExecutedKeys((prev) => ({ ...prev, [`nav_${target}`]: true }));
              }}
              className={`group flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left text-xs font-semibold transition-all hover:shadow-sm ${
                isExecuted
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                  : "border-primary/30 bg-primary/10 text-primary hover:border-primary/50 hover:bg-primary/20"
              }`}
            >
              <span className="flex items-center gap-1.5 truncate">
                {isExecuted ? (
                  <Zap className="size-3.5 shrink-0 text-emerald-400" />
                ) : (
                  <Sparkles className="size-3.5 shrink-0 text-primary animate-pulse" />
                )}
                <span className="truncate">{act.label ?? `Go to ${target}`}</span>
              </span>
              {isExecuted ? (
                <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] text-emerald-400 font-mono">
                  Opened
                </span>
              ) : (
                <ArrowRight className="size-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
              )}
            </button>
          );
        }

        if (act.type === "view_mode") {
          const targetMode = act.mode ?? "recruiter";
          const isActive = mode === targetMode;
          return (
            <button
              key={i}
              type="button"
              onClick={() => {
                setMode(targetMode);
                toast.success(`Switched to ${targetMode === "recruiter" ? "Recruiter" : "Engineer"} mode!`);
              }}
              className={`group flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left text-xs font-semibold transition-all ${
                isActive
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                  : "border-border/60 bg-card/60 text-foreground hover:border-primary/40 hover:bg-primary/5"
              }`}
            >
              <span className="flex items-center gap-1.5 truncate">
                <Briefcase className="size-3.5 shrink-0 text-emerald-500" />
                <span>{act.label ?? `Switch to ${targetMode} mode`}</span>
              </span>
              {isActive ? (
                <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] text-emerald-400">
                  Active
                </span>
              ) : (
                <ArrowRight className="size-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
              )}
            </button>
          );
        }

        if (act.type === "hire_inquiry") {
          return (
            <RecruiterLeadCard
              key={i}
              defaultName={act.name}
              defaultCompany={act.company}
              defaultRole={act.role}
              defaultEmail={act.email}
            />
          );
        }

        if (act.type === "send_lead") {
          return (
            <AutoSendLeadCard
              key={i}
              name={act.name || act.company}
              email={act.email}
              message={act.message}
              isLatest={isLatest}
            />
          );
        }

        if (act.type === "download_resume") {
          return (
            <a
              key={i}
              href="/Sahil_Bansal_Resume.pdf"
              download="Sahil_Bansal_Resume.pdf"
              className="group flex items-center justify-between gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-left text-xs font-semibold text-emerald-400 transition-all hover:border-emerald-500/50 hover:bg-emerald-500/20 hover:shadow-sm"
            >
              <span className="flex items-center gap-1.5 truncate">
                <FileDown className="size-3.5 shrink-0 text-emerald-500" />
                <span>{act.label ?? "Download Sahil's Resume (PDF)"}</span>
              </span>
              <ExternalLink className="size-3 shrink-0 opacity-70 transition-transform group-hover:scale-110" />
            </a>
          );
        }

        if (act.type === "book_call") {
          return (
            <CalBookingCard
              key={i}
              calLink={act.calLink || act.path}
              label={act.label}
            />
          );
        }

        if (act.type === "send_email") {
          if (act.email && act.email.includes("@")) {
            return (
              <AutoSendLeadCard
                key={i}
                name={act.name}
                email={act.email}
                message={act.message}
                isLatest={isLatest}
              />
            );
          }
          return (
            <ComposeEmailCard
              key={i}
              defaultName={act.name}
              defaultEmail={act.email}
              defaultMessage={act.message}
            />
          );
        }

        if (act.type === "compose_email") {
          return (
            <ComposeEmailCard
              key={i}
              defaultName={act.name}
              defaultEmail={act.email}
              defaultMessage={act.message}
            />
          );
        }

        return null;
      })}
    </div>
  );
}

function AutoSendLeadCard({
  name,
  email,
  message,
  isLatest = false,
}: {
  name?: string;
  email?: string;
  message?: string;
  isLatest?: boolean;
}) {
  // If historical message from storage, it was already dispatched during that session
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    isLatest ? "idle" : "sent"
  );
  const [errorMsg, setErrorMsg] = useState("");
  const hasSentRef = useRef(!isLatest);

  useEffect(() => {
    if (hasSentRef.current || !email || !isLatest) return;

    // Sanitize email (strip accidental wrappers like <...>, (...), trailing dots)
    const trimmedEmail = email.trim().replace(/^[<(]/, "").replace(/[>).,]$/, "");
    const trimmedName = (name || "Visitor").trim();
    const trimmedMessage = (
      message || "Hiring inquiry submitted via AI chat assistant"
    ).trim();

    if (!trimmedEmail.includes("@") || !trimmedEmail.includes(".")) {
      setStatus("error");
      setErrorMsg("Invalid email format provided.");
      return;
    }

    hasSentRef.current = true;
    setStatus("sending");

    sendEmail({
      name: trimmedName.length >= 2 ? trimmedName : "Recruiter / Visitor",
      email: trimmedEmail,
      message: trimmedMessage.length >= 1 ? trimmedMessage : "Hiring inquiry submitted via AI chat assistant",
    })
      .then((res) => {
        if (res.error) {
          setStatus("error");
          setErrorMsg(
            typeof res.error === "string" ? res.error : "Failed to deliver email."
          );
          toast.error("Failed to send email to Sahil's inbox.");
        } else {
          setStatus("sent");
          toast.success("Message sent to Sahil at connect@sahilbansal.net!");
        }
      })
      .catch(() => {
        setStatus("error");
        setErrorMsg("Network connection issue.");
      });
  }, [name, email, message, isLatest]);

  if (status === "sending") {
    return (
      <div className="flex items-center gap-2.5 rounded-xl border border-primary/40 bg-primary/10 p-3 text-xs text-primary animate-pulse">
        <Loader2 className="size-4 animate-spin text-primary shrink-0" />
        <div>
          <p className="font-semibold">Transmitting inquiry to Sahil...</p>
          <p className="text-[11px] text-muted-foreground">
            Sending to <span className="font-mono text-primary">connect@sahilbansal.net</span>
          </p>
        </div>
      </div>
    );
  }

  if (status === "sent") {
    return (
      <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs text-emerald-300">
        <CheckCircle2 className="size-4 shrink-0 text-emerald-400 mt-0.5" />
        <div>
          <p className="font-semibold text-emerald-300">Delivered to Sahil&apos;s Inbox</p>
          <p className="mt-0.5 text-[11px] text-emerald-400/90 leading-relaxed">
            Inquiry dispatched to <span className="font-mono underline">connect@sahilbansal.net</span>. Sahil will reply directly to <span className="font-mono font-semibold">{email}</span>.
          </p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-xs text-rose-300">
        <p className="font-semibold">Unable to dispatch automatically</p>
        <p className="mt-0.5 text-[11px] text-rose-400/90 leading-relaxed">
          {errorMsg || "Delivery failed"}. Please email Sahil directly at{" "}
          <a
            href={`mailto:connect@sahilbansal.net?subject=Inquiry from ${encodeURIComponent(name || "Portfolio")}&body=${encodeURIComponent(message || "")}`}
            className="font-mono underline text-rose-200"
          >
            connect@sahilbansal.net
          </a>
          .
        </p>
      </div>
    );
  }

  return null;
}

function RecruiterLeadCard({
  defaultName,
  defaultCompany,
  defaultRole,
  defaultEmail,
}: {
  defaultName?: string;
  defaultCompany?: string;
  defaultRole?: string;
  defaultEmail?: string;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const initialName = defaultName
    ? defaultCompany && !defaultName.includes(defaultCompany)
      ? `${defaultName} (${defaultCompany})`
      : defaultName
    : defaultCompany
    ? `${defaultCompany} Recruiter`
    : "";
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(defaultEmail || "");
  const [message, setMessage] = useState(
    defaultRole
      ? `Reaching out regarding ${defaultRole} role at ${defaultCompany || "our company"}.`
      : defaultCompany
      ? `Connecting regarding potential opportunities at ${defaultCompany}.`
      : ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (trimmedName.length < 2) {
      toast.error("Please provide a name or company (at least 2 characters).");
      return;
    }
    if (!trimmedEmail.includes("@") || !trimmedEmail.includes(".")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!trimmedMessage) {
      toast.error("Please include a brief message or role details.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await sendEmail({
        name: trimmedName,
        email: trimmedEmail,
        message: trimmedMessage,
      });

      if (res.error) {
        toast.error(typeof res.error === "string" ? res.error : "Failed to send inquiry. Please email connect@sahilbansal.net directly.");
      } else {
        setIsSent(true);
        toast.success("Inquiry delivered directly to Sahil's inbox!");
      }
    } catch {
      toast.error("Network error. Please email connect@sahilbansal.net directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSent) {
    return (
      <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs text-emerald-300 flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="size-4 shrink-0 text-emerald-400" />
          <span className="font-semibold">Inquiry delivered to Sahil! Expect a response within 24 hours.</span>
        </div>
        <button
          type="button"
          onClick={() => setIsSent(false)}
          className="text-[11px] text-emerald-400 underline self-start hover:text-emerald-300"
        >
          Send another update or message
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-primary/30 bg-card/80 p-3 shadow-md backdrop-blur-sm">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Mail className="size-3.5 text-primary" />
          <span className="text-xs font-bold text-foreground">
            Direct Opportunity Intake
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="text-[11px] font-medium text-primary hover:underline"
        >
          {isOpen ? "Close" : "Open Form →"}
        </button>
      </div>

      <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
        Connect with Sahil directly at <span className="font-mono text-primary">connect@sahilbansal.net</span>
      </p>

      {isOpen && (
        <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-2">
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Your Name & Company
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Alex Rivera (Stripe)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-0.5 w-full rounded border border-border/60 bg-background/80 px-2 py-1 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Your Email / LinkedIn
            </label>
            <input
              type="email"
              required
              placeholder="alex@stripe.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-0.5 w-full rounded border border-border/60 bg-background/80 px-2 py-1 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Role & Details
            </label>
            <textarea
              required
              rows={2}
              placeholder="e.g. Staff DevOps Engineer, AWS/K8s focus, remote-friendly"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-0.5 w-full rounded border border-border/60 bg-background/80 px-2 py-1 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-1 flex items-center justify-center gap-1.5 rounded bg-primary py-1.5 text-xs font-semibold text-primary-foreground shadow transition-all hover:bg-primary/90 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-3 animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <span>Send to Sahil&apos;s Inbox</span>
            )}
          </button>
        </form>
      )}
    </div>
  );
}

function CalBookingCard({
  calLink = "sahilbansal/quick-chat-with-sahil",
  label = "Quick Chat with Sahil (30 min)",
}: {
  calLink?: string;
  label?: string;
}) {
  const [showEmbed, setShowEmbed] = useState(false);
  const cleanLink = (calLink || "sahilbansal/quick-chat-with-sahil").replace(
    /^https?:\/\/cal\.com\//,
    ""
  );
  const fullUrl = `https://cal.com/${cleanLink}`;

  return (
    <div className="overflow-hidden rounded-xl border border-primary/35 bg-card/90 p-3.5 shadow-md backdrop-blur-sm transition-all hover:border-primary/50">
      <div className="flex items-start gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Calendar className="size-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-foreground">{label}</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
              <Clock className="size-2.5" /> 30 min
            </span>
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
            Schedule a 1-on-1 strategy call, architecture discussion, or consultation directly with Sahil on Cal.com.
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setShowEmbed((prev) => !prev)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90"
        >
          <Calendar className="size-3.5" />
          <span>{showEmbed ? "Hide Calendar" : "Pick Date & Time in Chat"}</span>
          {showEmbed ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
        </button>

        <a
          href={fullUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-background/80 px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
        >
          <span>Open on Cal.com</span>
          <ExternalLink className="size-3 text-muted-foreground" />
        </a>
      </div>

      {showEmbed && (
        <div className="mt-3 overflow-hidden rounded-xl border border-border/60 bg-background/95 shadow-inner">
          <iframe
            src={`https://cal.com/${cleanLink}?embed=true`}
            title="Book a chat with Sahil"
            className="h-[460px] w-full border-0"
            loading="lazy"
          />
        </div>
      )}
    </div>
  );
}

function ComposeEmailCard({
  defaultName = "",
  defaultEmail = "",
  defaultMessage = "",
}: {
  defaultName?: string;
  defaultEmail?: string;
  defaultMessage?: string;
}) {
  const [name, setName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);
  const [message, setMessage] = useState(defaultMessage);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (trimmedName.length < 2) {
      toast.error("Please provide your name (at least 2 characters).");
      return;
    }
    if (!trimmedEmail.includes("@") || !trimmedEmail.includes(".")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!trimmedMessage) {
      toast.error("Please enter your message.");
      return;
    }

    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await sendEmail({
        name: trimmedName,
        email: trimmedEmail,
        message: trimmedMessage,
      });

      if (res.error) {
        setStatus("error");
        setErrorMsg(typeof res.error === "string" ? res.error : "Failed to deliver email.");
        toast.error("Failed to send message to Sahil.");
      } else {
        setStatus("sent");
        toast.success("Message delivered to Sahil at connect@sahilbansal.net!");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again or email directly.");
    }
  };

  if (status === "sent") {
    return (
      <div className="flex flex-col gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3.5 text-xs text-emerald-300">
        <div className="flex items-start gap-2.5">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-400" />
          <div>
            <p className="font-semibold text-emerald-300">Email Delivered to Sahil&apos;s Inbox!</p>
            <p className="mt-0.5 text-[11px] leading-relaxed text-emerald-400/90">
              Message dispatched to <span className="font-mono underline">connect@sahilbansal.net</span>. Sahil will reply directly to <span className="font-mono font-semibold">{email}</span> within 24 hours.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="self-start text-[11px] text-emerald-400 underline hover:text-emerald-300"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-primary/35 bg-card/90 p-3.5 shadow-md backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Mail className="size-3.5" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-foreground">Send Email to Sahil</h4>
          <p className="text-[10px] text-muted-foreground">
            Delivers straight to <span className="font-mono text-primary">connect@sahilbansal.net</span>
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-2.5">
        <div>
          <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Your Name
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Alex Rivera"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-0.5 w-full rounded border border-border/60 bg-background/80 px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Your Email
          </label>
          <input
            type="email"
            required
            placeholder="alex@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-0.5 w-full rounded border border-border/60 bg-background/80 px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Message
          </label>
          <textarea
            required
            rows={3}
            placeholder="Hi Sahil, I'd like to discuss..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-0.5 w-full rounded border border-border/60 bg-background/80 px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>

        {status === "error" && (
          <p className="text-[11px] text-rose-400">
            {errorMsg || "Failed to send message. Please try again."}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "sending"}
          className="mt-1 flex items-center justify-center gap-1.5 rounded-lg bg-primary py-2 text-xs font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {status === "sending" ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              <span>Sending to Sahil...</span>
            </>
          ) : (
            <>
              <Send className="size-3.5" />
              <span>Send Email to Sahil</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

