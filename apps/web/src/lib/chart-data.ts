import type { DrugForecastAndImpact, ForecastTotals } from "@/lib/api";
import { toMonthlyProjection, type MonthlyPoint } from "@/lib/projection";

export interface BeforeAfterPoint {
  drug_name: string;
  current_qty: number;
  optimal_qty: number;
}

export interface ImpactBreakdown {
  manufacturing_kg: number;
  transport_kg: number;
  incineration_kg: number;
}

export function toBeforeAfter(byDrug: DrugForecastAndImpact[]): BeforeAfterPoint[] {
  return byDrug.map((d) => ({
    drug_name: d.drug_name,
    current_qty: d.current_avg_order_qty,
    optimal_qty: d.recommended_qty,
  }));
}

export function toImpactBreakdown(byDrug: DrugForecastAndImpact[]): ImpactBreakdown {
  return byDrug.reduce(
    (acc, d) => {
      acc.manufacturing_kg += d.impact?.co2_breakdown?.manufacturing_kg ?? 0;
      acc.transport_kg     += d.impact?.co2_breakdown?.transport_kg     ?? 0;
      acc.incineration_kg  += d.impact?.co2_breakdown?.incineration_kg  ?? 0;
      return acc;
    },
    { manufacturing_kg: 0, transport_kg: 0, incineration_kg: 0 },
  );
}

export { toMonthlyProjection };
export type { MonthlyPoint };
