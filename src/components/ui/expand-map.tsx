"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import "maplibre-gl/dist/maplibre-gl.css";

export interface LocationMapProps {
  location?: string;
  className?: string;
}

// Sector 24, DLF Phase 3, Gurugram [lng, lat]
const SECTOR24_COORDS: [number, number] = [77.0516, 28.4725];

const STYLE_DARK = "https://tiles.openfreemap.org/styles/dark";
const STYLE_LIGHT = "https://tiles.openfreemap.org/styles/positron";

/* ─── Tiny SVG cloud shape ─────────────────────────────────── */
function CloudSVG({ w, h, opacity }: { w: number; h: number; opacity: number }) {
  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 120 55"
      fill="white"
      style={{ opacity, display: "block" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="60" cy="38" rx="52" ry="16" />
      <ellipse cx="38" cy="28" rx="28" ry="20" />
      <ellipse cx="78" cy="26" rx="26" ry="19" />
      <ellipse cx="55" cy="22" rx="22" ry="16" />
    </svg>
  );
}

/* ─── Plane SVG (rotated to fly diagonally) ─────────────────── */
function PlaneSVG({ size, opacity }: { size: number; opacity: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="white"
      style={{ opacity, display: "block", transform: "rotate(-35deg)" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2 1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" />
    </svg>
  );
}

export function LocationMap({ className = "" }: LocationMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const initializedRef = useRef(false);
  const [localTime, setLocalTime] = useState("");
  const { resolvedTheme } = useTheme();

  /* ── Live IST Clock ──────────────────────────────────────── */
  useEffect(() => {
    const tick = () => {
      try {
        const formatted = new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }).format(new Date());
        setLocalTime(`${formatted} IST`);
      } catch {
        const now = new Date();
        const h = now.getHours();
        const m = now.getMinutes().toString().padStart(2, "0");
        const s = now.getSeconds().toString().padStart(2, "0");
        const ampm = h >= 12 ? "PM" : "AM";
        setLocalTime(`${h % 12 || 12}:${m}:${s} ${ampm} IST`);
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  /* ── Map init — runs ONCE on mount, fly-in included ─────── */
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const styleUrl = resolvedTheme === "dark" ? STYLE_DARK : STYLE_LIGHT;

    import("maplibre-gl").then((mod) => {
      if (!mapContainerRef.current) return;
      const mgl = (mod as any).default || mod;

      const map = new mgl.Map({
        container: mapContainerRef.current,
        style: styleUrl,
        center: SECTOR24_COORDS,
        zoom: 7.5,
        pitch: 0,
        bearing: 0,
        attributionControl: false,
        scrollZoom: true,
        dragPan: true,
        dragRotate: false,
        touchZoomRotate: true,
        doubleClickZoom: true,
      });

      mapRef.current = map;

      /* Marker */
      const el = document.createElement("div");
      el.style.cssText =
        "display:flex;flex-direction:column;align-items:center;cursor:pointer;";
      el.innerHTML = `
        <div style="position:relative;display:flex;align-items:center;justify-content:center;">
          <span class="map-ping-ring"></span>
          <span style="position:relative;width:11px;height:11px;border-radius:50%;background:#0ea5e9;border:2.5px solid white;box-shadow:0 2px 10px rgba(14,165,233,0.6);"></span>
        </div>
        <span style="margin-top:5px;font-size:11px;font-weight:700;color:#0f172a;background:rgba(255,255,255,0.88);backdrop-filter:blur(4px);padding:1px 6px;border-radius:4px;white-space:nowrap;box-shadow:0 1px 4px rgba(0,0,0,0.15);letter-spacing:0.01em;font-family:system-ui,sans-serif;">
          Sector 24, Gurugram
        </span>
      `;

      new mgl.Marker({ element: el }).setLngLat(SECTOR24_COORDS).addTo(map);

      /* Fly-in on first load only */
      map.on("load", () => {
        setTimeout(() => {
          if (!mapRef.current) return;
          mapRef.current.flyTo({
            center: SECTOR24_COORDS,
            zoom: 13.5,
            speed: 0.78,
            curve: 1.3,
            essential: true,
          });
        }, 350);
      });
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      initializedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ← intentionally empty: init ONCE only

  /* ── Theme change: swap style, NO fly-in ────────────────── */
  useEffect(() => {
    if (!mapRef.current) return;
    const url = resolvedTheme === "dark" ? STYLE_DARK : STYLE_LIGHT;
    try {
      mapRef.current.setStyle(url);
    } catch {
      // map not ready
    }
  }, [resolvedTheme]);

  return (
    <div className={`relative w-full select-none ${className}`}>
      {/* Keyframes for marker ping + cloud/flight animations */}
      <style>{`
        .map-ping-ring {
          position: absolute;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: rgba(14,165,233,0.28);
          animation: map-ping-anim 1.6s cubic-bezier(0,0,0.2,1) infinite;
        }
        @keyframes map-ping-anim {
          0%   { transform: scale(0.8); opacity: 1; }
          75%  { transform: scale(2.2); opacity: 0; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes cloud-left {
          from { transform: translateX(110%); }
          to   { transform: translateX(-110%); }
        }
        @keyframes cloud-right {
          from { transform: translateX(-110%); }
          to   { transform: translateX(110%); }
        }
        @keyframes flight-cross {
          0%   { transform: translate(-80px, 80px);  opacity: 0; }
          4%   { opacity: 1; }
          96%  { opacity: 1; }
          100% { transform: translate(calc(100vw + 80px), -80px); opacity: 0; }
        }
        @keyframes flight-cross-2 {
          0%   { transform: translate(-60px, 50px);  opacity: 0; }
          5%   { opacity: 0.65; }
          95%  { opacity: 0.65; }
          100% { transform: translate(calc(100vw + 60px), -50px); opacity: 0; }
        }
      `}</style>

      {/* ── Map wrapper ─────────────────────────────────────── */}
      <div className="group relative h-48 sm:h-56 md:h-64 w-full overflow-hidden rounded-2xl border border-border/60 bg-muted/20">

        {/* MapLibre canvas */}
        <div
          ref={mapContainerRef}
          className="absolute inset-0 h-full w-full cursor-grab active:cursor-grabbing"
        />

        {/* ── Animated clouds overlay ───────────────────────── */}
        <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
          {/* Cloud 1 — large, drifts left, slow */}
          <div
            style={{
              position: "absolute",
              top: "12%",
              right: 0,
              animation: "cloud-left 55s linear infinite",
              animationDelay: "-18s",
            }}
          >
            <CloudSVG w={90} h={42} opacity={0.55} />
          </div>

          {/* Cloud 2 — medium, drifts right */}
          <div
            style={{
              position: "absolute",
              top: "38%",
              left: 0,
              animation: "cloud-right 42s linear infinite",
              animationDelay: "-10s",
            }}
          >
            <CloudSVG w={62} h={28} opacity={0.38} />
          </div>

          {/* Cloud 3 — small, drifts left, faster */}
          <div
            style={{
              position: "absolute",
              top: "60%",
              right: 0,
              animation: "cloud-left 30s linear infinite",
              animationDelay: "-24s",
            }}
          >
            <CloudSVG w={44} h={20} opacity={0.28} />
          </div>

          {/* Cloud 4 — extra small accent */}
          <div
            style={{
              position: "absolute",
              top: "22%",
              left: 0,
              animation: "cloud-right 65s linear infinite",
              animationDelay: "-40s",
            }}
          >
            <CloudSVG w={34} h={16} opacity={0.22} />
          </div>
        </div>

        {/* ── Animated flights overlay ──────────────────────── */}
        <div className="pointer-events-none absolute inset-0 z-[3] overflow-hidden">
          {/* Flight 1 — primary, larger */}
          <div
            style={{
              position: "absolute",
              top: "18%",
              left: 0,
              animation: "flight-cross 48s linear infinite",
              animationDelay: "-12s",
            }}
          >
            <PlaneSVG size={20} opacity={0.85} />
          </div>

          {/* Flight 2 — secondary, smaller, different timing */}
          <div
            style={{
              position: "absolute",
              top: "62%",
              left: 0,
              animation: "flight-cross-2 68s linear infinite",
              animationDelay: "-35s",
            }}
          >
            <PlaneSVG size={14} opacity={0.55} />
          </div>
        </div>

        {/* ── Bottom fade into page bg ──────────────────────── */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16 z-[4]"
          style={{
            background:
              "linear-gradient(transparent, hsl(var(--background) / 0.65) 55%, hsl(var(--background)))",
          }}
          aria-hidden="true"
        />

        {/* ── IST time pill ─────────────────────────────────── */}
        {localTime && (
          <div className="absolute top-0 right-0 p-2.5 sm:p-3 pointer-events-none z-[5]">
            <div className="rounded-md border border-border/40 bg-background/80 px-2.5 py-1 font-mono text-xs text-muted-foreground shadow-sm backdrop-blur-md tabular-nums">
              {localTime}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LocationMap;
