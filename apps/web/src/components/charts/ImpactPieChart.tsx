"use client";

import {
  PieChart, Pie, Cell, Tooltip, Legend,
  ResponsiveContainer,
} from "recharts";
import type { ImpactBreakdown } from "@/lib/chart-data";

interface Props {
  data: ImpactBreakdown;
  totalCo2: number;
}

const SLICES = [
  { key: "manufacturing_kg" as const, label: "Manufacturing", color: "#ef4444" },
  { key: "transport_kg"     as const, label: "Transport",     color: "#f59e0b" },
  { key: "incineration_kg"  as const, label: "Incineration",  color: "#8b5cf6" },
];

function CenterLabel({ cx, cy, total }: { cx: number; cy: number; total: number }) {
  return (
    <g>
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize={18} fontWeight={700} fill="#10b981">
        {Math.round(total).toLocaleString("fr-FR")}
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize={10} fill="#64748b">
        kg CO₂e
      </text>
    </g>
  );
}

export function ImpactPieChart({ data, totalCo2 }: Props) {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

  const chartData = SLICES.map((s) => ({
    name: s.label,
    value: Math.round((data[s.key] ?? 0) * 100) / 100,
    color: s.color,
  })).filter((d) => d.value > 0);

  if (chartData.length === 0 || totalCo2 <= 0) {
    return (
      <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">
        No CO₂ data available
      </div>
    );
  }

  const total = chartData.reduce((s, d) => s + d.value, 0);

  return (
    <section aria-label="CO2 savings breakdown pie chart">
      <ResponsiveContainer width="100%" height={isMobile ? 220 : 260}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius="52%"
            outerRadius="72%"
            paddingAngle={3}
            dataKey="value"
          >
            {chartData.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
            <CenterLabel cx={0} cy={0} total={totalCo2} />
          </Pie>
          <Tooltip
            formatter={(value, name) => {
              const v = typeof value === "number" ? value : Number(value ?? 0);
              return [`${v.toLocaleString("fr-FR")} kg (${Math.round(v / total * 100)}%)`, String(name)];
            }}
          />
          <Legend
            layout={isMobile ? "horizontal" : "vertical"}
            verticalAlign={isMobile ? "bottom" : "middle"}
            align={isMobile ? "center" : "right"}
            formatter={(value, entry: { payload?: { value?: number } }) => {
              const pct = entry?.payload?.value != null
                ? Math.round(entry.payload.value / total * 100)
                : 0;
              return `${value} (${pct}%)`;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <p className="sr-only">
        Donut chart showing CO₂ savings breakdown: manufacturing accounts for the
        largest share, followed by incineration and transport.
      </p>
    </section>
  );
}
