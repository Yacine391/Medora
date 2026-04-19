"use client";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ReferenceLine,
  ResponsiveContainer, Area, AreaChart,
} from "recharts";
import type { MonthlyPoint } from "@/lib/chart-data";

interface Props {
  data: MonthlyPoint[];
}

export function ProjectionLineChart({ data }: Props) {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

  // On mobile show every 3rd tick
  const tickInterval = isMobile ? 2 : 0;

  const fmt = (v: number) =>
    v >= 1000 ? `${Math.round(v / 1000)}k€` : `${v}€`;

  return (
    <section aria-label="Cumulative euro savings projection line chart">
      <ResponsiveContainer width="100%" height={isMobile ? 220 : 280}>
        <AreaChart
          data={data}
          margin={{ top: 8, right: 8, left: 0, bottom: 8 }}
        >
          <defs>
            <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#10b981" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.03} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11 }}
            interval={tickInterval}
          />
          <YAxis tick={{ fontSize: 11 }} tickFormatter={fmt} width={48} />
          <Tooltip
            formatter={(value, name) => {
              const v = typeof value === "number" ? value : Number(value ?? 0);
              return [`${v.toLocaleString("fr-FR")} €`, name === "current_cumulative_eur" ? "Current trajectory" : "With Medora"];
            }}
          />
          <Legend
            verticalAlign="top"
            formatter={(value) =>
              value === "current_cumulative_eur" ? "Current trajectory" : "With Medora"
            }
          />
          {/* Shaded savings area */}
          <Area
            type="monotone"
            dataKey="current_cumulative_eur"
            stroke="#94a3b8"
            strokeWidth={2}
            fill="transparent"
            dot={false}
            name="current_cumulative_eur"
          />
          <Area
            type="monotone"
            dataKey="optimal_cumulative_eur"
            stroke="#10b981"
            strokeWidth={2.5}
            fill="url(#savingsGrad)"
            dot={false}
            name="optimal_cumulative_eur"
          />
        </AreaChart>
      </ResponsiveContainer>
      <p className="sr-only">
        Area chart showing cumulative euro spend over 12 months. The gap between
        the current trajectory (grey line) and the Medora line (green) represents
        total savings accrued by following optimal order recommendations.
      </p>
    </section>
  );
}
