interface SparklineProps {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
  className?: string;
}

/**
 * Tiny inline telemetry sparkline. Stateless SVG, flat stroke — no glow.
 * Renders a hairline baseline + a marker square on the final sample.
 */
export function Sparkline({
  data,
  color = "var(--color-acid)",
  width = 72,
  height = 22,
  className,
}: SparklineProps) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const stepX = width / (data.length - 1);
  const pad = 3;

  const pts = data.map((v, i) => {
    const x = i * stepX;
    const y = pad + (1 - (v - min) / span) * (height - pad * 2);
    return [x, y] as const;
  });

  const d = pts
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`)
    .join(" ");

  const [lx, ly] = pts[pts.length - 1];

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <line
        x1={0}
        y1={height - 1}
        x2={width}
        y2={height - 1}
        stroke="var(--color-line)"
        strokeWidth={1}
      />
      <path d={d} fill="none" stroke={color} strokeWidth={1.4} />
      <rect x={lx - 2} y={ly - 2} width={4} height={4} fill={color} />
    </svg>
  );
}
