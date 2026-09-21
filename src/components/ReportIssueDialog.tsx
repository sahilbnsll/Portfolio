"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { sendEmail } from "@/lib/actions";
import { toast } from "sonner";
import { Bug, CheckCircle2, MessageSquare, Sparkles, Send, Loader2 } from "lucide-react";

interface ReportIssueDialogProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const CATEGORIES = [
  { id: "bug", label: "Bug / Broken UI", icon: Bug },
  { id: "feedback", label: "General Feedback", icon: MessageSquare },
  { id: "feature", label: "Idea / Suggestion", icon: Sparkles },
];

export function ReportIssueDialog({ trigger, open, onOpenChange }: ReportIssueDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [category, setCategory] = useState("bug");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isControlled = typeof open !== "undefined";
  const isOpen = isControlled ? open : internalOpen;
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setTimeout(() => {
        setIsSubmitted(false);
        setMessage("");
      }, 300);
    }
    if (isControlled) {
      onOpenChange?.(newOpen);
    } else {
      setInternalOpen(newOpen);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error("Please provide a short description.");
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedCategory = CATEGORIES.find((c) => c.id === category)?.label || category;
      const formattedMessage = `[Portfolio Report: ${selectedCategory}]\n\nFeedback / Issue:\n${message}\n\nSender Email: ${
        email.trim() || "Not provided (Anonymous)"
      }`;

      const res = await sendEmail({
        name: "Portfolio Feedback",
        email: email.trim() || "feedback@sahilbansal.net",
        message: formattedMessage,
      });

      if (res?.error) {
        toast.error("Could not send report right now. Please try again.");
      } else {
        setIsSubmitted(true);
        toast.success("Thank you! Your feedback has been sent.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-bold sm:text-lg">
            {isSubmitted ? "Feedback Received" : "Report an Issue or Send Feedback"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground sm:text-sm">
            {isSubmitted
              ? "Thanks for taking the time to share your thoughts. I appreciate the input!"
              : "Spotted a bug, broken animation, or have a suggestion for this portfolio? Let me know directly."}
          </DialogDescription>
        </DialogHeader>

        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <CheckCircle2 className="size-12 text-emerald-500 animate-in zoom-in-50 duration-300" />
            <p className="mt-3 text-sm font-medium text-foreground">Delivered straight to my inbox</p>
            <p className="mt-1 text-xs text-muted-foreground">
              I review all notes and make updates to the portfolio continuously.
            </p>
            <Button
              className="mt-5 w-full sm:w-auto"
              variant="outline"
              size="sm"
              onClick={() => handleOpenChange(false)}
            >
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-1">
            {/* Category Selectors */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const active = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                      active
                        ? "border-primary bg-primary/10 text-primary font-semibold"
                        : "border-border/60 bg-muted/30 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                    }`}
                  >
                    <Icon className="size-3.5" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Message Area */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="report-message" className="text-xs font-medium text-foreground">
                What happened or what&apos;s on your mind? <span className="text-rose-500">*</span>
              </label>
              <Textarea
                id="report-message"
                placeholder="e.g. Button alignment on mobile, typo in experience, or a feature suggestion..."
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="resize-none text-xs leading-relaxed"
                required
              />
            </div>

            {/* Email (Optional) */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="report-email" className="text-xs font-medium text-foreground">
                Your email <span className="text-muted-foreground font-normal">(optional, if you&apos;d like a reply)</span>
              </label>
              <Input
                id="report-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-xs"
              />
            </div>

            {/* Actions */}
            <div className="mt-2 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isSubmitting} className="gap-1.5">
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="size-3.5" />
                    <span>Send Report</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ReportIssueDialog;
