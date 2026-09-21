"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { MapCloudscape } from "@/components/ui/cloudscape";

export interface LocationMapProps {
  location?: string;
  className?: string;
}

// Sector 24, DLF Phase 3, Gurugram [lng, lat]
const SECTOR24_COORDS: [number, number] = [77.0516, 28.4725];

const STYLE_DARK  = "https://tiles.openfreemap.org/styles/dark";
const STYLE_LIGHT = "https://tiles.openfreemap.org/styles/positron";

export function LocationMap({ className = "" }: LocationMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef          = useRef<any>(null);
  const initializedRef  = useRef(false);
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

      /* Sector 24 marker */
      const el = document.createElement("div");
      el.style.cssText = "position:relative;display:flex;align-items:center;justify-content:center;cursor:pointer;";
      el.innerHTML = `
        <span class="map-ping-ring"></span>
        <span style="position:relative;width:11px;height:11px;border-radius:50%;background:#0ea5e9;border:2.5px solid white;box-shadow:0 2px 10px rgba(14,165,233,0.6);"></span>
      `;

      new mgl.Marker({ element: el }).setLngLat(SECTOR24_COORDS).addTo(map);

      /* Fly-in on first load only */
      map.on("load", () => {
        setTimeout(() => {
          if (!mapRef.current) return;
          mapRef.current.flyTo({
            center: SECTOR24_COORDS,
            zoom: 11.5,
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
  }, []); // intentionally empty — init ONCE

  /* ── Theme change: swap style, NO fly-in ────────────────── */
  useEffect(() => {
    if (!mapRef.current) return;
    const url = resolvedTheme === "dark" ? STYLE_DARK : STYLE_LIGHT;
    try { mapRef.current.setStyle(url); } catch { /* map not ready */ }
  }, [resolvedTheme]);

  /* ── Cloud colours per theme ─────────────────────────────── */
  // Dark mode: clouds must be BRIGHTER than the dark map background
  //   → medium-light blue-gray base + near-white peaks = luminous moonlit clouds
  // Light mode: pure white at high opacity blocks the map completely
  //   → muted blue-gray tint + very light peak + lower opacity = natural daytime
  const cloudBase    = resolvedTheme === "dark" ? "#8ab2cc" : "#a0bdd4";
  const cloudPeak    = resolvedTheme === "dark" ? "#d8eef8" : "#e8f4fc";
  const cloudOpacity = resolvedTheme === "dark" ? 0.54      : 0.38;

  return (
    <div className={`relative w-full select-none ${className}`}>
      {/* Marker ping keyframe only */}
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
          0%  { transform: scale(0.8); opacity: 1; }
          75% { transform: scale(2.2); opacity: 0; }
          100%{ transform: scale(2.2); opacity: 0; }
        }
      `}</style>

      <div className="group relative h-48 sm:h-56 md:h-64 w-full overflow-hidden rounded-2xl border border-border/60 bg-muted/20">

        {/* MapLibre canvas */}
        <div
          ref={mapContainerRef}
          className="absolute inset-0 h-full w-full cursor-grab active:cursor-grabbing"
        />

        {/* WebGL cloud overlay — geo-anchored, reads mapRef every frame */}
        <MapCloudscape
          mapInstance={mapRef}
          cloudBase={cloudBase}
          cloudPeak={cloudPeak}
          opacity={cloudOpacity}
          speed={0.32}
          className="z-[2]"
        />

        {/* Bottom fade into page background */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16 z-[4]"
          style={{
            background:
              "linear-gradient(transparent, hsl(var(--background) / 0.65) 55%, hsl(var(--background)))",
          }}
          aria-hidden="true"
        />

        {/* IST time pill */}
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
