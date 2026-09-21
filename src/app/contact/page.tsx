"use client";

import ContactForm from "@/components/ContactForm";
import { motion } from "framer-motion";
import { CalendarDays, Mail } from "lucide-react";
import Script from "next/script";

export default function ContactPage() {
  return (
    <article className="mt-8 flex flex-col gap-10 pb-16">

      {/* ── Header ── */}
      <div className="flex flex-col gap-3">
        <motion.h1
          className="title"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          let&apos;s talk infrastructure.
        </motion.h1>
        <motion.p
          className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
        >
          I&apos;m most responsive to questions about system reliability, cost
          optimization, scaling infrastructure, and DevOps challenges. Whether
          you&apos;re exploring collaboration, need infrastructure advice, or want
          to discuss how I can contribute to your team, I&apos;m all ears.
          I&apos;ll get back within 24 hours.
        </motion.p>
      </div>

      {/* ── Two-column: Cal embed + contact form ── */}
      <div className="grid gap-8 lg:grid-cols-2">

        {/* Cal.com embed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-col gap-3"
        >
          <div className="flex items-center gap-2">
            <CalendarDays className="size-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Book a call</h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Pick a slot that works for you — 30-min intro or a deeper technical chat.
          </p>

          {/* Cal.com inline embed */}
          <div
            className="cal-embed-container overflow-hidden rounded-xl border border-border/50 bg-card/30"
            style={{ minHeight: "460px" }}
          >
            <div
              id="my-cal-inline"
              style={{ width: "100%", height: "460px", overflow: "scroll" }}
            />
          </div>

          {/* Cal.com embed script */}
          <Script
            id="cal-embed"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function (C, A, L) {
                  let p = function (a, ar) { a.q.push(ar); };
                  let d = C.document;
                  C.Cal = C.Cal || function () {
                    let cal = C.Cal;
                    let ar = arguments;
                    if (!cal.loaded) {
                      cal.ns = {};
                      cal.q = cal.q || [];
                      d.head.appendChild(d.createElement("script")).src = A;
                      cal.loaded = true;
                    }
                    if (ar[0] === L) {
                      const api = function () { p(api, arguments); };
                      const namespace = ar[1];
                      api.q = api.q || [];
                      if (typeof namespace === "string") {
                        cal.ns[namespace] = cal.ns[namespace] || api;
                        p(cal.ns[namespace], ar);
                        p(cal, ["initNamespace", namespace]);
                      } else p(cal, ar);
                      return;
                    }
                    p(cal, ar);
                  };
                })(window, "https://app.cal.com/embed/embed.js", "init");

                Cal("init", { origin: "https://cal.com" });

                Cal("inline", {
                  elementOrSelector: "#my-cal-inline",
                  calLink: "sahilbansal/quick-chat-with-sahil",
                  layout: "month_view",
                  theme: document.documentElement.classList.contains("dark") ? "dark" : "light",
                });

                Cal("ui", {
                  styles: { branding: { brandColor: "#6366f1" } },
                  hideEventTypeDetails: false,
                  layout: "month_view",
                });
              `,
            }}
          />
        </motion.div>

        {/* Contact form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="flex flex-col gap-3"
        >
          <div className="flex items-center gap-2">
            <Mail className="size-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Send a message</h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Prefer async? Drop a message and I&apos;ll reply within 24h.
          </p>
          <ContactForm />
        </motion.div>
      </div>
    </article>
  );
}
