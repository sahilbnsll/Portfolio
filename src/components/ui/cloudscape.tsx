"use client";

import { useEffect, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════════════════════
   VERTEX
═══════════════════════════════════════════════════════════════════════════ */
const VERT = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

/* ═══════════════════════════════════════════════════════════════════════════
   FRAGMENT  —  Scattered Premium Cumulus
   
   Design goals
   ────────────
   • 2-4 discrete, well-separated cloud formations (not full coverage)
   • Organic but not amoeba-shaped edges (reduced domain warp)
   • Luminous in dark mode — clouds BRIGHTER than the dark map
   • Subtle in light mode  — clouds tinted blue-gray, not pure white
   • Feathery, soft edges via wide smoothstep bands
   • Interior texture (bumps) via a separate high-freq detail pass
   • Cirrus wisps above the cumulus layer
   • Silver lining rim on cloud boundaries
   • Edge vignette so clouds fade at canvas borders
   • Fully geo-anchored: pan/zoom affect the visible noise region
═══════════════════════════════════════════════════════════════════════════ */
const FRAG = `
precision highp float;

uniform vec2  u_resolution;
uniform float u_time;
uniform vec3  u_cloudBase;   /* shadow / base colour                    */
uniform vec3  u_cloudPeak;   /* highlight / top colour                  */
uniform float u_speed;
uniform float u_opacity;
uniform vec2  u_mapCenter;   /* live centre (lng, lat) in degrees       */
uniform float u_spanLng;     /* visible longitude span in degrees       */
uniform float u_zoom;        /* current zoom level                      */

/* ── Value noise ──────────────────────────────────────────────────────── */
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i),
        b = hash(i + vec2(1.0, 0.0)),
        c = hash(i + vec2(0.0, 1.0)),
        d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

/* 5-octave FBM — smoother base; fewer octaves = less noise mud */
float fbm5(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 rot = mat2(0.87, 0.50, -0.50, 0.87);
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = rot * p * 2.0; a *= 0.5; }
  return v;
}
/* 3-octave FBM — fast, for warp & detail */
float fbm3(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 rot = mat2(0.87, 0.50, -0.50, 0.87);
  for (int i = 0; i < 3; i++) { v += a * noise(p); p = rot * p * 2.0; a *= 0.5; }
  return v;
}

void main() {
  vec2  uv = gl_FragCoord.xy / u_resolution;
  float ar = u_resolution.x / max(u_resolution.y, 1.0);

  /* ── 1. Mercator correction (~0.877 at Gurugram 28.5°) ─────────────── */
  float latRad  = u_mapCenter.y * 3.14159265 / 180.0;
  float mercorr = max(cos(latRad), 0.1);

  /* ── 2. Geo-anchored fragment position ──────────────────────────────── */
  /* Parallax 0.88 → clouds float above ground, lag slightly on pan       */
  const float PARALLAX = 0.88;
  vec2 geoP = u_mapCenter * PARALLAX + vec2(
    (uv.x - 0.5)  * u_spanLng,
    -(uv.y - 0.5) * u_spanLng / ar / mercorr
  );

  /* ── 3. Cloud-texture space ─────────────────────────────────────────── */
  /* 3.5 → at zoom 11.5 (span ~0.29°): sample range = 1.0 FBM unit       */
  /*       → ~2 independent cloud formations in frame                     */
  /* Zoom out: more clouds. Zoom in: one big cloud filling screen.         */
  const float SCALE = 3.5;
  vec2 cP = geoP * SCALE;

  /* Drift: noticeable but gentle. Two layers move at slightly different   */
  /* speeds so cumulus and cirrus don't lock together.                     */
  float t    = u_time * u_speed;
  vec2 wA    = vec2(t * 0.0040, t * 0.0009);   /* primary drift           */
  vec2 wB    = vec2(t * 0.0026, t * 0.0014);   /* secondary / cirrus      */

  /* ── 4. Domain warp (LIGHT — 0.14 strength prevents amoeba shapes) ─── */
  vec2 warp = vec2(
    fbm3(cP * 1.1 + wA + vec2(1.7, 4.2)) - 0.5,
    fbm3(cP * 1.1 + wA + vec2(9.2, 2.8)) - 0.5
  ) * 0.14;

  /* ── 5. Cumulus base (large-scale: where clouds exist at all) ──────── */
  float large = fbm5(cP * 0.65 + wA);

  /* ── 6. Cumulus shape (medium-scale, warped) ────────────────────────── */
  float mid   = fbm5(cP + warp + wA);

  /* Blend: large anchors cloud regions; mid provides shape detail        */
  float cumulus = large * 0.38 + mid * 0.62;

  /* ── 7. High-freq surface texture (bumps inside clouds) ────────────── */
  float detail = fbm3(cP * 2.6 + wB + vec2(5.1, 3.3));

  /* ── 8. Cirrus (high-altitude, wispy, slower, independent region) ───── */
  float cirrus = fbm5(cP * 0.38 + wA * 0.65 + vec2(31.0, 19.0));

  /* ── 9. Density threshold — HIGH so only 15-20 % of area has clouds ── */
  /* zoomN: 0 at zoom 8.5, 1 at zoom 14. Higher zoom → lower thresh       */
  float zoomN  = clamp((u_zoom - 8.5) / 5.5, 0.0, 1.0);
  float thresh  = 0.62 - zoomN * 0.05;            /* 0.57 – 0.62 range   */
  float band    = 0.22;                            /* WIDE → soft edges   */

  float denCum = smoothstep(thresh, thresh + band, cumulus);

  /* Interior bump detail: only visible INSIDE clouds, adds surface depth  */
  float surf   = detail * denCum * 0.14;
  float totDen = clamp(denCum + surf, 0.0, 1.0);

  float hiCum  = smoothstep(thresh + band * 0.7, thresh + band * 1.4, cumulus);

  /* Silver lining: rim where cloud is transitioning in                    */
  float rim = (smoothstep(thresh - 0.025, thresh + 0.04, cumulus)
             - smoothstep(thresh + 0.04,  thresh + band,  cumulus)) * 0.50;

  /* Cirrus: very soft, stays behind cumulus */
  float denCir = smoothstep(0.64, 0.86, cirrus) * 0.26;
  float hiCir  = smoothstep(0.77, 0.92, cirrus) * 0.16;

  /* ── 10. Composite ──────────────────────────────────────────────────── */
  float density   = max(totDen, denCir);
  float highlight = max(hiCum * 0.90, hiCir);

  /* ── 11. Edge vignette (separate X/Y so corners don't hard-clip) ─────── */
  float evX = smoothstep(0.0, 0.09, uv.x) * smoothstep(1.0, 0.91, uv.x);
  float evY = smoothstep(0.0, 0.06, uv.y) * smoothstep(1.0, 0.94, uv.y);
  float edgeFade = evX * evY;

  /* ── 12. Output ─────────────────────────────────────────────────────── */
  vec3  col   = mix(u_cloudBase, u_cloudPeak, clamp(highlight + rim * 0.55, 0.0, 1.0));
  float alpha = (density + rim * 0.30) * u_opacity * edgeFade;

  gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0));
}
`;

/* ═══════════════════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════════════════ */
const HEX_RE = /^#?[0-9a-fA-F]{6}$/;
function hexToRgb(hex: string): [number, number, number] {
  const h = (HEX_RE.test(hex.trim()) ? hex.trim() : "#ffffff").replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ];
}

/* ═══════════════════════════════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════════════════════════════ */
export interface MapCloudscapeProps extends React.HTMLAttributes<HTMLDivElement> {
  mapInstance?:   React.RefObject<any>;
  cloudBase?:     string;
  cloudPeak?:     string;
  opacity?:       number;
  speed?:         number;
  defaultCenter?: [number, number];
}

export function MapCloudscape({
  mapInstance,
  cloudBase     = "#9ab8cc",
  cloudPeak     = "#deeef8",
  opacity       = 0.55,
  speed         = 0.32,
  defaultCenter = [77.0516, 28.4725] as [number, number],
  className,
  style,
  ...props
}: MapCloudscapeProps) {
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const hostRef       = useRef<HTMLDivElement>(null);
  const mapInstHolder = useRef(mapInstance);
  useEffect(() => { mapInstHolder.current = mapInstance; }, [mapInstance]);

  const settings = useMemo(
    () => ({ cloudBase, cloudPeak, opacity, speed, defaultCenter }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cloudBase, cloudPeak, opacity, speed],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const host   = hostRef.current;
    if (!canvas || !host) return;

    const gl = canvas.getContext("webgl", { antialias: true, alpha: true });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error("Cloud shader:", gl.getShaderInfoLog(s)); gl.deleteShader(s); return null;
      }
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER,   VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("Cloud link:", gl.getProgramInfoLog(prog)); return;
    }
    gl.useProgram(prog);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(prog, "position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uRes    = gl.getUniformLocation(prog, "u_resolution")!;
    const uTime   = gl.getUniformLocation(prog, "u_time")!;
    const uBase   = gl.getUniformLocation(prog, "u_cloudBase")!;
    const uPeak   = gl.getUniformLocation(prog, "u_cloudPeak")!;
    const uSpd    = gl.getUniformLocation(prog, "u_speed")!;
    const uOp     = gl.getUniformLocation(prog, "u_opacity")!;
    const uCenter = gl.getUniformLocation(prog, "u_mapCenter")!;
    const uSpan   = gl.getUniformLocation(prog, "u_spanLng")!;
    const uZoom   = gl.getUniformLocation(prog, "u_zoom")!;

    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      const { width, height } = host.getBoundingClientRect();
      canvas.width  = Math.max(1, Math.floor(width  * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    /* Delta-time accumulator — prevents snap on tab refocus */
    let raf     = 0;
    let lastNow = performance.now();
    let accTime = 0;
    const onVisible = () => { lastNow = performance.now(); };
    document.addEventListener("visibilitychange", onVisible);

    const [defLng, defLat] = settings.defaultCenter;

    const frame = (now: number) => {
      const delta = Math.min(now - lastNow, 50);
      lastNow  = now;
      accTime += delta / 1000;

      /* Read live map state — zero React re-renders */
      let cLng = defLng, cLat = defLat, span = 0.45, zoom = 11.5;
      const mo = mapInstHolder.current?.current;
      if (mo) {
        try {
          const c = mo.getCenter(), b = mo.getBounds();
          cLng = c.lng; cLat = c.lat;
          zoom = mo.getZoom();
          span = Math.abs(b.getEast() - b.getWest());
        } catch { /* map not ready — use defaults */ }
      }

      const base = hexToRgb(settings.cloudBase);
      const peak = hexToRgb(settings.cloudPeak);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uTime,   accTime);
      gl.uniform3fv(uBase,  base);
      gl.uniform3fv(uPeak,  peak);
      gl.uniform1f(uSpd,    settings.speed);
      gl.uniform1f(uOp,     settings.opacity);
      gl.uniform2f(uCenter, cLng, cLat);
      gl.uniform1f(uSpan,   Math.max(span, 0.001));
      gl.uniform1f(uZoom,   zoom);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisible);
      ro.disconnect();
      if (buf)  gl.deleteBuffer(buf);
      if (prog) gl.deleteProgram(prog);
      if (vs)   gl.deleteShader(vs);
      if (fs)   gl.deleteShader(fs);
    };
  }, [settings]);

  return (
    <div
      ref={hostRef}
      className={cn("pointer-events-none absolute inset-0", className)}
      style={style}
      {...props}
    >
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 block h-full w-full" />
    </div>
  );
}

export default MapCloudscape;
