"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import type { BeforeAfterPoint } from "@/lib/chart-data";

interface Props {
  data: BeforeAfterPoint[];
}

const CURRENT_COLOR = "#94a3b8";  // slate-400
const OPTIMAL_COLOR = "#10b981";  // emerald-500

function truncate(s: string, n: number) {
  return s.length > n ? s.slice(0, n) + "…" : s;
}

export function BeforeAfterBarChart({ data }: Props) {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
  const chartData = data.map((d) => ({
    ...d,
    label: truncate(d.drug_name, isMobile ? 8 : 14),
  }));

  return (
    <section aria-label="Before and after bar chart — current orders vs Medora recommendation">
      <ResponsiveContainer width="100%" height={isMobile ? 260 : 320}>
        <BarChart
          data={chartData}
          margin={{ top: 8, right: 8, left: 0, bottom: isMobile ? 60 : 40 }}
          barCategoryGap="25%"
          barGap={2}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11 }}
            angle={-45}
            textAnchor="end"
            interval={0}
            height={isMobile ? 70 : 55}
          />
          <YAxis tick={{ fontSize: 11 }} width={48} />
          <Tooltip
            formatter={(value, name) => [
              typeof value === "number" ? value.toLocaleString("fr-FR") : String(value),
              name === "current_qty" ? "Current order" : "Medora recommendation",
            ]}
            labelFormatter={(label) => {
              const s = String(label ?? "");
              const row = data.find((d) => d.drug_name.startsWith(s.replace("…", "")));
              return row?.drug_name ?? s;
            }}
          />
          <Legend
            verticalAlign="top"
            formatter={(value) =>
              value === "current_qty" ? "Current order" : "Medora recommendation"
            }
          />
          <Bar dataKey="current_qty"  fill={CURRENT_COLOR} radius={[3, 3, 0, 0]} name="current_qty"  />
          <Bar dataKey="optimal_qty"  fill={OPTIMAL_COLOR} radius={[3, 3, 0, 0]} name="optimal_qty"  />
        </BarChart>
      </ResponsiveContainer>
      <p className="sr-only">
        Bar chart comparing current medicine order quantities (slate bars) versus Medora&apos;s
        recommended optimal quantities (emerald bars) for each drug. Most drugs show a reduction.
      </p>
    </section>
  );
}
