"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
} from "@/components/ui/accordion";
import type { Performance } from "@/lib/api";

// ── SVG ring gauge ─────────────────────────────────────────────────────────────

const RADIUS = 36;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function RingGauge({ pct, color }: { pct: number; color: string }) {
  const offset = CIRCUMFERENCE * (1 - Math.min(1, Math.max(0, pct)));
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" aria-hidden="true">
      {/* Track */}
      <circle cx="48" cy="48" r={RADIUS} fill="none" stroke="#e2e8f0" strokeWidth="8" />
      {/* Fill — starts at 12 o'clock (rotated -90°) */}
      <circle
        cx="48" cy="48" r={RADIUS}
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={offset}
        transform="rotate(-90 48 48)"
      />
    </svg>
  );
}

function gaugeColor(pct: number | null): string {
  if (pct === null) return "#94a3b8";
  if (pct >= 0.85) return "#10b981";
  if (pct >= 0.70) return "#f59e0b";
  return "#ef4444";
}

function gradeColor(grade: string) {
  switch (grade) {
    case "A": return "text-emerald-600 bg-emerald-50 border-emerald-200";
    case "B": return "text-blue-600 bg-blue-50 border-blue-200";
    case "C": return "text-amber-600 bg-amber-50 border-amber-200";
    case "D": return "text-red-600 bg-red-50 border-red-200";
    default:  return "text-slate-500 bg-slate-50 border-slate-200";
  }
}

function confidencePct(label: string): number {
  switch (label) {
    case "High":   return 100;
    case "Medium": return 66;
    default:       return 33;
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  performance: Performance;
}

export function PerformanceCard({ performance: p }: Props) {
  const acc10Pct = p.accuracy_within_10pct ?? 0;
  const color = gaugeColor(p.accuracy_within_10pct);
  const confPct = confidencePct(p.confidence_label);

  return (
    <Card className="shadow-sm">
      <CardContent className="pt-6 pb-5">
        {/* Header */}
        <div className="mb-5">
          <p className="text-base font-semibold">AI Performance — how reliable are these recommendations?</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Based on a {p.evaluation_months}-month backtest on your own historical data
          </p>
        </div>

        {/* 2×2 grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">

          {/* Box 1 — Accuracy gauge */}
          <div className="rounded-xl border p-4 flex flex-col items-center text-center gap-2">
            <div className="relative">
              <RingGauge pct={acc10Pct} color={color} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold" style={{ color }}>
                  {p.accuracy_within_10pct !== null
                    ? `${Math.round(p.accuracy_within_10pct * 100)}%`
                    : "—"}
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-snug">
              of forecasts within 10% of reality
            </p>
            {p.accuracy_within_20pct !== null && (
              <p className="text-[11px] text-muted-foreground/70">
                {Math.round(p.accuracy_within_20pct * 100)}% within 20%
              </p>
            )}
          </div>

          {/* Box 2 — Grade badge */}
          <div className="rounded-xl border p-4 flex flex-col items-center justify-center text-center gap-1">
            <div className={`text-5xl font-extrabold w-20 h-20 rounded-2xl border-2 flex items-center justify-center ${gradeColor(p.overall_grade)}`}>
              {p.overall_grade}
            </div>
            <p className="text-sm font-medium mt-2">Overall model grade</p>
            <p className="text-[11px] text-muted-foreground">
              {p.mape_pct !== null ? `MAPE ${p.mape_pct}%` : ""}
              {p.mape_pct !== null && p.evaluation_months > 0 ? " · " : ""}
              {p.evaluation_months > 0 ? `${p.evaluation_months} months evaluated` : ""}
            </p>
          </div>

          {/* Box 3 — Simulated waste reduction */}
          <div className="rounded-xl border p-4 flex flex-col items-start gap-1">
            <p className="text-3xl font-bold text-emerald-600">
              −{p.waste_reduction_simulated_pct}%
            </p>
            <p className="text-sm font-medium">Estimated waste reduction</p>
            <p className="text-xs text-muted-foreground">
              If you had used Medora for the past {p.evaluation_months} months
            </p>
            <p className="text-[11px] text-muted-foreground/70 mt-1">
              No new stockouts introduced in backtest
            </p>
          </div>

          {/* Box 4 — Data confidence */}
          <div className="rounded-xl border p-4 flex flex-col justify-between gap-3">
            <div>
              <p className="text-sm font-medium">{p.confidence_label} confidence</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Based on {p.data_coverage_months} months of history
              </p>
            </div>
            <div>
              <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all"
                  style={{ width: `${confPct}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground/60 mt-1">
                <span>Low</span><span>Medium</span><span>High</span>
              </div>
            </div>
            {p.mae !== null && (
              <p className="text-[11px] text-muted-foreground/70">
                MAE: {p.mae} units average error
              </p>
            )}
          </div>
        </div>

        {/* Expandable methodology */}
        <Accordion multiple>
          <AccordionItem value="method" className="border rounded-lg px-4">
            <AccordionTrigger className="text-xs font-medium text-muted-foreground">
              How we measure this
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 text-xs text-muted-foreground py-2">
                <p>
                  <span className="font-medium text-foreground">Method:</span>{" "}
                  Walk-forward validation. We use the last {p.evaluation_months} months of your
                  data as a held-out test set. The model predicts each month&apos;s demand, then we
                  compare with what was actually consumed (not ordered).
                </p>
                <p>
                  <span className="font-medium text-foreground">Metrics:</span>{" "}
                  MAPE (mean absolute percentage error), accuracy within 10% and 20% of truth,
                  and a simulated waste reduction assuming an 8% safety buffer on each
                  model prediction.
                </p>
                <p className="font-medium text-foreground">Caveats:</p>
                <ul className="list-disc pl-4 space-y-0.5">
                  {p.caveats.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
