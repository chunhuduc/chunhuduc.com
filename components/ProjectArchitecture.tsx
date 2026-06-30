import type { ReactNode } from "react";

/**
 * NDA-safe "architecture as art" card visual. Renders a small system diagram
 * (labelled nodes + directed edges) over a layered mesh background, so a card
 * communicates *how the system is built* without exposing client names. Used as
 * the banner for both public and NDA-protected project cards.
 *
 * Geometry is normalised to a 0-100 viewBox so the same spec scales to any card
 * size. Nodes are positioned by the caller; edges reference node ids.
 */

export type ArchNode = {
  id: string;
  /** Short label, kept generic / NDA-safe (e.g. "CDN edge", not a client name). */
  label: string;
  /** Center x in 0-100 space. */
  x: number;
  /** Center y in 0-100 space. */
  y: number;
  /** Visual emphasis. "primary" = accent-filled hero node. */
  kind?: "primary" | "default" | "store";
};

export type ArchEdge = {
  from: string;
  to: string;
  /** Render an animated dataflow dash on this edge. */
  flow?: boolean;
  /** Curve the edge instead of a straight line (useful to dodge other nodes). */
  curve?: number;
};

export type ProjectArchitecture = {
  from: string;
  to: string;
  nodes: ArchNode[];
  edges: ArchEdge[];
};

const NODE_W = 26;
const NODE_H = 11;

function anchor(n: ArchNode) {
  return { cx: n.x, cy: n.y };
}

/** Edge path from the border of `a` toward the border of `b`. */
function edgePath(a: ArchNode, b: ArchNode, curve = 0) {
  const A = anchor(a);
  const B = anchor(b);
  const dx = B.cx - A.cx;
  const dy = B.cy - A.cy;
  // Trim endpoints to roughly the node edge so lines don't stab through boxes.
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const trimA = Math.min(NODE_W / 2 + 1, Math.abs(ux) * (NODE_W / 2) + Math.abs(uy) * (NODE_H / 2) + 2);
  const trimB = trimA;
  const x1 = A.cx + ux * trimA;
  const y1 = A.cy + uy * trimA;
  const x2 = B.cx - ux * trimB;
  const y2 = B.cy - uy * trimB;
  if (!curve) return `M ${x1} ${y1} L ${x2} ${y2}`;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 - curve;
  return `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
}

export default function ProjectArchitecture({
  architecture,
  className,
  badge,
}: {
  architecture: ProjectArchitecture;
  className?: string;
  /** Optional pill shown top-left over the diagram (e.g. NDA-protected). */
  badge?: ReactNode;
}) {
  const { from, to, nodes, edges } = architecture;
  const byId = new Map(nodes.map((n) => [n.id, n]));

  const mesh = [
    `radial-gradient(ellipse 60% 55% at 12% 6%, ${from}, transparent 58%)`,
    `radial-gradient(ellipse 55% 55% at 94% 14%, ${to}, transparent 52%)`,
    `radial-gradient(ellipse 90% 80% at 70% 112%, ${from}, transparent 60%)`,
    `linear-gradient(140deg, ${from} 0%, ${to} 100%)`,
  ].join(", ");

  return (
    <div
      className={`relative overflow-hidden ${className ?? ""}`}
      style={{ background: mesh }}
    >
      {/* faint dot grid texture */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)",
          backgroundSize: "14px 14px",
        }}
      />
      {/* darkening scrim so labels stay legible over bright gradients */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: "linear-gradient(160deg, rgba(8,11,18,0.32), rgba(8,11,18,0.62))" }}
      />
      {/* extra top-left scrim so the badge never sits directly over a node label */}
      {badge && (
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 8% 10%, rgba(8,11,18,0.78), transparent 70%)",
          }}
        />
      )}

      <svg
        viewBox="0 0 100 64"
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 h-full w-full p-3"
        role="img"
        aria-label="System architecture diagram"
      >
        {/* edges first so nodes sit on top */}
        <g>
          {edges.map((e, i) => {
            const a = byId.get(e.from);
            const b = byId.get(e.to);
            if (!a || !b) return null;
            const d = edgePath(a, b, e.curve);
            return (
              <g key={`${e.from}-${e.to}-${i}`}>
                <path
                  d={d}
                  fill="none"
                  stroke="rgba(255,255,255,0.28)"
                  strokeWidth={0.7}
                />
                {e.flow && (
                  <path
                    d={d}
                    fill="none"
                    stroke="rgba(255,255,255,0.85)"
                    strokeWidth={0.9}
                    strokeLinecap="round"
                    strokeDasharray="2 8"
                    className="arch-flow"
                  />
                )}
              </g>
            );
          })}
        </g>

        {/* nodes */}
        <g>
          {nodes.map((n) => {
            const primary = n.kind === "primary";
            const store = n.kind === "store";
            const fill = primary
              ? "rgba(255,255,255,0.92)"
              : "rgba(13,17,24,0.55)";
            const strokeColor = primary
              ? "rgba(255,255,255,0.95)"
              : "rgba(255,255,255,0.45)";
            const textColor = primary ? "#0b1018" : "rgba(255,255,255,0.95)";
            const rx = store ? 1.5 : 2.5;
            return (
              <g key={n.id}>
                <rect
                  x={n.x - NODE_W / 2}
                  y={n.y - NODE_H / 2}
                  width={NODE_W}
                  height={NODE_H}
                  rx={rx}
                  fill={fill}
                  stroke={strokeColor}
                  strokeWidth={0.7}
                  style={
                    primary
                      ? { filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.45))" }
                      : undefined
                  }
                />
                {store && (
                  // top "disk" lip to hint at a datastore
                  <path
                    d={`M ${n.x - NODE_W / 2 + 1} ${n.y - NODE_H / 2 + 2.2} a ${NODE_W / 2 - 1} 1.6 0 0 0 ${NODE_W - 2} 0`}
                    fill="none"
                    stroke="rgba(255,255,255,0.4)"
                    strokeWidth={0.6}
                  />
                )}
                <text
                  x={n.x}
                  y={n.y}
                  fill={textColor}
                  fontSize={3.4}
                  fontWeight={700}
                  textAnchor="middle"
                  dominantBaseline="central"
                  style={{ letterSpacing: "0.01em" }}
                >
                  {n.label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {badge && <div className="absolute left-4 top-4 z-10">{badge}</div>}
    </div>
  );
}
