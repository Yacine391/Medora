const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Drug {
  drug_atc_code: string;
  drug_name: string;
}

export interface TopDriver {
  feature: string;
  impact_pct: number;
  direction: "reduce" | "increase" | "neutral";
  explanation: string;
}

export interface ForecastResult {
  drug_atc_code: string;
  drug_name: string;
  hospital_id: string;
  horizon_months: number;
  current_avg_order_qty: number;
  recommended_qty: number;
  confidence_low: number;
  confidence_high: number;
  reduction_pct: number;
  top_drivers: TopDriver[];
  reasoning_text: string;
}

export interface ImpactResult {
  qty_avoided: number;
  mass_kg_avoided: number;
  co2_total_kg: number;
  co2_breakdown: {
    manufacturing_kg: number;
    transport_kg: number;
    incineration_kg: number;
  };
  transport_km_equivalent: number;
  ecotox_score: number;
  ecotox_class: "low" | "moderate" | "high" | "critical";
  euros_saved: number;
  human_equivalents: {
    car_km: string;
    trees_year: string;
    households_day: string;
  };
}

export interface DrugForecastAndImpact extends ForecastResult {
  impact: ImpactResult;
}

export interface ForecastTotals {
  qty_avoided: number;
  co2_total_kg: number;
  euros_saved: number;
  ecotox_score_total: number;
}

export interface FullResult {
  hospital_id: string;
  horizon_months: number;
  totals: ForecastTotals;
  by_drug: DrugForecastAndImpact[];
}

export interface ApiError {
  error: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

async function post<T>(path: string, body: unknown): Promise<T | ApiError> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text();
      return { error: `API ${res.status}: ${text}` };
    }
    return res.json() as Promise<T>;
  } catch (e) {
    return { error: (e as Error).message };
  }
}

async function get<T>(path: string): Promise<T | ApiError> {
  try {
    const res = await fetch(`${API_BASE}${path}`);
    if (!res.ok) return { error: `API ${res.status}` };
    return res.json() as Promise<T>;
  } catch (e) {
    return { error: (e as Error).message };
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

export function isApiError(v: unknown): v is ApiError {
  return typeof v === "object" && v !== null && "error" in v;
}

export async function getDrugs(): Promise<Drug[] | ApiError> {
  return get<Drug[]>("/api/drugs");
}

export async function getSampleCSVText(): Promise<string | ApiError> {
  try {
    const res = await fetch(`${API_BASE}/api/sample-data`);
    if (!res.ok) return { error: `API ${res.status}` };
    return res.text();
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export async function forecastAndImpact(params: {
  hospital_id: string;
  horizon_months: number;
  csv_data?: string | null;
}): Promise<FullResult | ApiError> {
  return post<FullResult>("/api/forecast-and-impact", params);
}

export async function forecastOne(params: {
  hospital_id: string;
  drug_atc_code: string;
  horizon_months: number;
  csv_data?: string | null;
}): Promise<ForecastResult | ApiError> {
  return post<ForecastResult>("/api/forecast", params);
}
