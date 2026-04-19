"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft, Lock, Terminal, TrendingDown, Leaf, Euro,
  Package, AlertTriangle, Upload as UploadIcon, Info, HelpCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Tabs, TabsList, TabsTrigger, TabsContent,
} from "@/components/ui/tabs";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
} from "@/components/ui/table";
import {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
} from "@/components/ui/accordion";
import {
  Tooltip, TooltipTrigger, TooltipContent, TooltipProvider,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import {
  forecastAndImpact, getSampleCSVText, isApiError,
  type FullResult, type DrugForecastAndImpact,
} from "@/lib/api";
import { validateResult } from "./_sanity";
import { toBeforeAfter, toImpactBreakdown, toMonthlyProjection } from "@/lib/chart-data";
import { BeforeAfterBarChart } from "@/components/charts/BeforeAfterBarChart";
import { ImpactPieChart } from "@/components/charts/ImpactPieChart";
import { ProjectionLineChart } from "@/components/charts/ProjectionLineChart";
import { PerformanceCard } from "@/components/PerformanceCard";

// ── Constants ─────────────────────────────────────────────────────────────────

const HOSPITALS = [
  { id: "HOSP_001", label: "CHU Paris",                   detail: "1200 beds · urban",        rural: false },
  { id: "HOSP_002", label: "CH Clermont-Ferrand",          detail: "450 beds · oncology",       rural: false },
  { id: "HOSP_003", label: "HP Cantal",                    detail: "80 beds · rural",           rural: true  },
];

const HORIZONS = [
  { value: "1",  label: "1 month"  },
  { value: "3",  label: "3 months" },
  { value: "6",  label: "6 months" },
  { value: "12", label: "12 months" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return n.toLocaleString("fr-FR");
}

function ecotoxColor(cls: string) {
  return cls === "critical" ? "bg-red-100 text-red-700"
    : cls === "high"     ? "bg-orange-100 text-orange-700"
    : cls === "moderate" ? "bg-yellow-100 text-yellow-700"
    : "bg-green-100 text-green-700";
}

function reductionColor(pct: number) {
  return pct > 20 ? "bg-red-100 text-red-700"
    : pct > 10   ? "bg-amber-100 text-amber-700"
    : pct > 0    ? "bg-emerald-100 text-emerald-700"
    : "bg-muted text-muted-foreground";
}

// ── KPI Card ──────────────────────────────────────────────────────────────────

function KpiCard({
  icon: Icon, label, value, caption, color = "text-emerald-600",
}: {
  icon: React.ElementType; label: string; value: string; caption?: string; color?: string;
}) {
  return (
    <Card className="shadow-sm">
      <CardContent className="pt-5 pb-4 flex flex-col gap-1">
        <Icon className={`w-5 h-5 ${color} mb-1`} />
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
        <p className="text-sm font-medium">{label}</p>
        {caption && <p className="text-xs text-muted-foreground">{caption}</p>}
      </CardContent>
    </Card>
  );
}

// ── Skeleton loader ───────────────────────────────────────────────────────────

function ResultsSkeleton({ firstRun }: { firstRun: boolean }) {
  return (
    <div className="space-y-6 mt-8">
      <p className="text-sm text-muted-foreground animate-pulse text-center">
        {firstRun ? "Warming up the model — this takes ~5s the first time…" : "AI analysing your data locally…"}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-80 w-full rounded-xl" />
    </div>
  );
}

// ── Drug table row ────────────────────────────────────────────────────────────

function DrugRow({ row }: { row: DrugForecastAndImpact }) {
  const driver = row.top_drivers?.[0];
  const featureLabel = driver?.feature?.replace(/_/g, " ") ?? "—";

  return (
    <TableRow>
      <TableCell className="font-medium whitespace-nowrap">{row.drug_name}</TableCell>
      <TableCell className="text-xs text-muted-foreground">{row.drug_atc_code}</TableCell>
      <TableCell className="text-right">{fmt(row.current_avg_order_qty)}</TableCell>
      <TableCell className="text-right font-medium text-emerald-700">{fmt(row.recommended_qty)}</TableCell>
      <TableCell className="text-right">
        <span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold", reductionColor(row.reduction_pct))}>
          {row.reduction_pct > 0 ? `−${row.reduction_pct}%` : `+${Math.abs(row.reduction_pct)}%`}
        </span>
      </TableCell>
      <TableCell className="text-right text-xs">{fmt(Math.round(row.impact?.co2_total_kg ?? 0))} kg</TableCell>
      <TableCell className="text-right text-xs">{fmt(Math.round(row.impact?.euros_saved ?? 0))} €</TableCell>
      <TableCell className="text-xs max-w-[160px]">
        {driver ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="cursor-help underline decoration-dotted">
                {featureLabel}
              </TooltipTrigger>
              <TooltipContent side="left">
                <p className="max-w-xs">{driver.explanation}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : "—"}
      </TableCell>
    </TableRow>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function DemoPage() {
  const [hospitalId, setHospitalId] = useState("HOSP_001");
  const [horizon, setHorizon]       = useState("1");
  const [loading, setLoading]       = useState(false);
  const [warmup, setWarmup]         = useState(false);
  const [result, setResult]         = useState<FullResult | null>(null);
  const [fromCache, setFromCache]   = useState(false);
  const [apiError, setApiError]     = useState<string | null>(null);
  const [uploadedCSV, setUploadedCSV] = useState<string | null>(null);
  const [fileName, setFileName]     = useState<string | null>(null);
  const fileRef     = useRef<HTMLInputElement>(null);
  const isFirstRun  = useRef(true);
  const resultCache = useRef<Map<string, FullResult>>(new Map());

  async function runAnalysis(csvData?: string | null) {
    setApiError(null);

    // Return cached result instantly if available (sample data only)
    if (!csvData) {
      const cacheKey = `${hospitalId}|${horizon}`;
      const cached = resultCache.current.get(cacheKey);
      if (cached) {
        setResult(cached);
        setFromCache(true);
        return;
      }
    }

    setFromCache(false);
    setLoading(true);
    setResult(null);
    const start = Date.now();

    const warmupTimer = setTimeout(() => setWarmup(true), 2000);

    const res = await forecastAndImpact({
      hospital_id: hospitalId,
      horizon_months: Number(horizon),
      csv_data: csvData ?? null,
    });

    clearTimeout(warmupTimer);
    setWarmup(false);
    isFirstRun.current = false;
    setLoading(false);

    if (isApiError(res)) {
      setApiError(res.error);
      toast.error("Analysis failed — " + res.error);
    } else {
      const warnings = validateResult(res);
      if (warnings.length > 0) {
        console.warn("[Medora] Result sanity warnings:", warnings);
      }
      if (!csvData) {
        resultCache.current.set(`${hospitalId}|${horizon}`, res);
      }
      setResult(res);
      const elapsed = ((Date.now() - start) / 1000).toFixed(1);
      toast.success(`Analysis complete in ${elapsed}s`);
    }
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => setUploadedCSV(ev.target?.result as string);
    reader.readAsText(file);
  }

  async function downloadSample() {
    const csv = await getSampleCSVText();
    if (isApiError(csv)) { toast.error("Could not fetch sample"); return; }
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "hospital_data_sample.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  const sortedDrugs = result
    ? [...result.by_drug].sort((a, b) => (b.impact?.euros_saved ?? 0) - (a.impact?.euros_saved ?? 0))
    : [];

  const co2Human = result
    ? result.by_drug[0]?.impact?.human_equivalents?.car_km ?? ""
    : "";

  return (
    <main id="main-content" className="min-h-screen bg-background overflow-x-hidden">
      {/* HEADER */}
      <div className="border-b bg-background/95 sticky top-0 z-10 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-4 flex items-center gap-4">
          <Link
            href="/"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-1")}
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold">Medora Demo</h1>
            <p className="text-xs text-muted-foreground truncate">
              Test with sample hospital data or upload your own (CSV stays in your browser)
            </p>
          </div>
          <Badge variant="outline" className="hidden sm:flex items-center gap-1 border-emerald-600 text-emerald-600 text-xs shrink-0">
            <Lock className="w-3 h-3" aria-hidden="true" /> No data leaves your browser
          </Badge>
        </div>
      </div>

      {/* WARMUP BANNER — shows when first request to Render takes >2s */}
      {warmup && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-sm text-amber-800">
          Waking up the demo server… (first request only, ~30s on free tier)
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* STEP 1 */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Step 1 — Choose your data source</h2>
            <Link
              href="/guide"
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Open user guide"
            >
              <HelpCircle className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">User Guide</span>
            </Link>
          </div>

          <Tabs defaultValue="sample" className="w-full">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="sample" className="flex-1 sm:flex-none">Use sample data</TabsTrigger>
              <TabsTrigger value="upload" className="flex-1 sm:flex-none">Upload your CSV</TabsTrigger>
            </TabsList>

            {/* TAB A — Sample data */}
            <TabsContent value="sample">
              <Card className="mt-4">
                <CardContent className="pt-6 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Hospital selector */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">Hospital</label>
                      <Select value={hospitalId} onValueChange={(v) => v && setHospitalId(v)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select hospital" />
                        </SelectTrigger>
                        <SelectContent>
                          {HOSPITALS.map((h) => (
                            <SelectItem key={h.id} value={h.id}>
                              <span className="flex items-center gap-2">
                                {h.label}
                                <span className="text-xs text-muted-foreground">({h.detail})</span>
                                {h.rural && (
                                  <Badge className="text-[10px] px-1 py-0 bg-amber-100 text-amber-700 border-amber-300">
                                    Rural
                                  </Badge>
                                )}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Horizon selector */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">Forecast horizon</label>
                      <Select value={horizon} onValueChange={(v) => v && setHorizon(v)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Horizon" />
                        </SelectTrigger>
                        <SelectContent>
                          {HORIZONS.map((h) => (
                            <SelectItem key={h.value} value={h.value}>{h.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button
                    onClick={() => runAnalysis(null)}
                    disabled={loading}
                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    {loading ? "Analyzing…" : "Run analysis"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB B — Upload CSV */}
            <TabsContent value="upload">
              <Card className="mt-4">
                <CardContent className="pt-6 space-y-5">
                  {/* Drop zone */}
                  <div
                    className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-emerald-600/60 transition-colors"
                    onClick={() => fileRef.current?.click()}
                  >
                    <UploadIcon className="w-8 h-8 text-muted-foreground mx-auto mb-3" aria-hidden="true" />
                    {fileName ? (
                      <p className="font-medium text-emerald-700">{fileName}</p>
                    ) : (
                      <>
                        <p className="font-medium">Click to select a CSV file</p>
                        <p className="text-xs text-muted-foreground mt-1">or drag and drop</p>
                      </>
                    )}
                    <input
                      ref={fileRef}
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Your CSV is parsed locally — it is NOT sent to any server except our on-prem demo API.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={downloadSample}
                      className="text-sm text-emerald-600 hover:underline text-left"
                    >
                      Download sample template →
                    </button>
                    <Button
                      onClick={() => runAnalysis(uploadedCSV)}
                      disabled={loading || !uploadedCSV}
                      className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      {loading ? "Analyzing…" : "Run analysis"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        {/* ERROR STATE */}
        {apiError && !loading && (
          <Alert variant="destructive">
            <Terminal className="w-4 h-4" aria-hidden="true" />
            <AlertTitle>API not running</AlertTitle>
            <AlertDescription>
              <p className="mb-2">{apiError}</p>
              <code className="block bg-muted text-foreground px-3 py-2 rounded text-xs font-mono mt-2 break-all">
                cd apps/api &amp;&amp; source .venv/bin/activate &amp;&amp; uvicorn main:app --reload --port 8000
              </code>
            </AlertDescription>
          </Alert>
        )}

        {/* LOADING */}
        {loading && <ResultsSkeleton firstRun={isFirstRun.current} />}

        {/* STEP 2 — Results */}
        {result && !loading && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">Step 2 — Results</h2>
                {fromCache && (
                  <Badge variant="outline" className="text-xs text-muted-foreground border-muted-foreground/40">
                    Cached
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                This would save your hospital{" "}
                <span className="font-semibold text-emerald-600">
                  {fmt(Math.round(result.totals.euros_saved))} €
                </span>{" "}
                and{" "}
                <span className="font-semibold text-emerald-600">
                  {fmt(Math.round(result.totals.co2_total_kg))} kg CO₂e
                </span>{" "}
                over {horizon} month{Number(horizon) > 1 ? "s" : ""}.
              </p>
            </div>

            {/* KPI STRIP */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <KpiCard
                icon={Package}
                label="Units over-ordered"
                value={fmt(result.totals.qty_avoided)}
                caption="Avoided next period"
                color="text-emerald-600"
              />
              <KpiCard
                icon={Leaf}
                label="CO₂e saved"
                value={`${fmt(Math.round(result.totals.co2_total_kg))} kg`}
                caption={co2Human}
                color="text-emerald-600"
              />
              <KpiCard
                icon={Euro}
                label="Euros saved"
                value={`${fmt(Math.round(result.totals.euros_saved))} €`}
                caption="Direct cost reduction"
                color="text-emerald-600"
              />
              <KpiCard
                icon={AlertTriangle}
                label="Ecotox score avoided"
                value={fmt(Math.round(result.totals.ecotox_score_total))}
                caption={
                  result.totals.ecotox_score_total > 200 ? "critical"
                  : result.totals.ecotox_score_total > 100 ? "high"
                  : result.totals.ecotox_score_total > 50 ? "moderate" : "low"
                }
                color="text-orange-600"
              />
            </div>

            {/* VISUAL IMPACT — 3 charts */}
            {sortedDrugs.length > 0 && (() => {
              const beforeAfterData = toBeforeAfter(result.by_drug);
              const impactBreakdown = toImpactBreakdown(result.by_drug);
              const projectionData  = toMonthlyProjection(result.totals, result.by_drug, Number(horizon));
              return (
                <div className="space-y-4">
                  {/* Row 1 — Before/After (full width) */}
                  <Card className="shadow-sm">
                    <CardContent className="pt-5 pb-4">
                      <p className="text-sm font-semibold mb-1">Orders: current vs recommended</p>
                      <p className="text-xs text-muted-foreground mb-4">
                        Your current orders vs Medora&apos;s recommendation per drug.
                      </p>
                      <BeforeAfterBarChart data={beforeAfterData} />
                    </CardContent>
                  </Card>

                  {/* Row 2 — Pie + Projection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card className="shadow-sm">
                      <CardContent className="pt-5 pb-4">
                        <p className="text-sm font-semibold mb-1">CO₂ savings breakdown</p>
                        <p className="text-xs text-muted-foreground mb-4">
                          Where the CO₂ savings come from (manufacturing is the main lever).
                        </p>
                        <ImpactPieChart data={impactBreakdown} totalCo2={result.totals.co2_total_kg} />
                      </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                      <CardContent className="pt-5 pb-4">
                        <p className="text-sm font-semibold mb-1">Cumulative euro savings</p>
                        <p className="text-xs text-muted-foreground mb-4">
                          Projected savings over 12 months following Medora&apos;s recommendations.
                        </p>
                        <ProjectionLineChart data={projectionData} />
                      </CardContent>
                    </Card>
                  </div>
                </div>
              );
            })()}

            {/* PER-DRUG TABLE */}
            <div className="overflow-x-auto rounded-xl border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Drug</TableHead>
                    <TableHead>ATC</TableHead>
                    <TableHead className="text-right">Current order</TableHead>
                    <TableHead className="text-right">Recommended</TableHead>
                    <TableHead className="text-right">Reduction</TableHead>
                    <TableHead className="text-right">CO₂ saved</TableHead>
                    <TableHead className="text-right">€ saved</TableHead>
                    <TableHead>Top driver</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedDrugs.map((row) => (
                    <DrugRow key={row.drug_atc_code} row={row} />
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* HOW IT WORKS — expandable */}
            <Accordion multiple>
              <AccordionItem value="how">
                <AccordionTrigger className="text-sm font-medium">
                  <span className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                    How Medora computed this
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 text-sm text-muted-foreground pt-2">
                    <p>
                      <span className="font-medium text-foreground">Model:</span>{" "}
                      LightGBM (gradient boosting) + SHAP explainability. Trained on 24 months of
                      hospital order history. Zero external API calls — runs entirely on-premise.
                    </p>
                    <p>
                      <span className="font-medium text-foreground">Key features:</span>{" "}
                      Historical demand (lags 1–12m), waste rate trend, seasonal patterns,
                      patient visits correlation, stockout history, lead time variability,
                      drug class and cost tier.
                    </p>
                    <p>
                      <span className="font-medium text-foreground">Data residency:</span>{" "}
                      All computation ran locally. No patient data or hospital records were
                      sent to any external server.
                    </p>
                    <p>
                      <span className="font-medium text-foreground">Assumptions:</span>{" "}
                      CO₂ factors from Shift Project 2025 (65 kg CO₂e/kg API). Waste ecotoxicity
                      scores from UNEP 2019 / OECD 2019. Transport: 10,000 km average from Asia.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* PERFORMANCE CARD */}
            {result.performance ? (
              <PerformanceCard performance={result.performance} />
            ) : (
              <p className="text-xs text-muted-foreground">
                Performance metrics not available for this analysis.
              </p>
            )}

            {/* Help link */}
            <p className="text-xs text-muted-foreground">
              Need help interpreting the results?{" "}
              <Link href="/guide#results" className="text-emerald-600 hover:underline">
                Read the user guide →
              </Link>
            </p>

            {/* Ecotox legend inline */}
            <div className="flex flex-wrap gap-2 text-xs items-center text-muted-foreground">
              <span>Ecotox classes:</span>
              {(["low","moderate","high","critical"] as const).map((c) => (
                <span key={c} className={cn("px-2 py-0.5 rounded-full", ecotoxColor(c))}>{c}</span>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
