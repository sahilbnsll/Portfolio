import React from "react";

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  // optional second series for comparisons
  data2?: number[];
  color2?: string;
  // enable simple hover/click interactivity
  interactive?: boolean;
  // report which index is currently active (hovered or clicked)
  onActiveIndexChange?: (index: number | null) => void;
}

function buildPoints(data: number[], width: number, height: number) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const coords = data.map((d, i) => {
    const x = data.length === 1 ? width / 2 : (i / (data.length - 1)) * width;
    const y = height - ((d - min) / range) * height;
    return { x, y, value: d };
  });
  const points = coords.map((p) => `${p.x},${p.y}`).join(" ");
  return { points, coords };
}

export default function Sparkline({
  data,
  data2,
  width = 60,
  height = 18,
  color = "#6366f1",
  color2 = "#ffffff66",
  interactive = false,
  onActiveIndexChange,
}: SparklineProps) {
  // Initialize state BEFORE any early returns
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  if (!data || data.length === 0) return null;
  const { points, coords } = buildPoints(data, width, height);
  const secondary =
    data2 && data2.length === data.length
      ? buildPoints(data2, width, height)
      : null;

  const segmentWidth = data.length > 1 ? width / data.length : width;

  const handleSetActive = (index: number | null) => {
    setActiveIndex(index);
    onActiveIndexChange?.(index);
  };

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
    >
      {secondary && (
        <polyline
          fill="none"
          stroke={color2}
          strokeWidth="1.75"
          strokeLinejoin="round"
          strokeLinecap="round"
          opacity={0.85}
          points={secondary.points}
        />
      )}
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        points={points}
      />
      {interactive &&
        coords.map((pt, i) => (
          <g key={i}>
            {/* Invisible hover areas spanning the width of each point segment */}
            <rect
              x={Math.max(0, pt.x - segmentWidth / 2)}
              y={0}
              width={segmentWidth}
              height={height}
              fill="transparent"
              onMouseEnter={() => handleSetActive(i)}
              onMouseLeave={() => handleSetActive(null)}
              onClick={() => handleSetActive(i)}
            />
            {/* Active point indicator */}
            {activeIndex === i && (
              <circle
                cx={pt.x}
                cy={pt.y}
                r={3.2}
                fill={color}
                stroke="#ffffff"
                strokeWidth={1}
              />
            )}
          </g>
        ))}
    </svg>
  );
}
