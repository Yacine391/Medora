import type { ForecastTotals, DrugForecastAndImpact } from "@/lib/api";

export interface MonthlyPoint {
  month: string;
  current_cumulative_eur: number;
  optimal_cumulative_eur: number;
}

export function toMonthlyProjection(
  totals: ForecastTotals,
  byDrug: DrugForecastAndImpact[],
  horizon: number,
): MonthlyPoint[] {
  // Monthly spend (current): sum of current_avg_order_qty × unit_cost approximated via euros_saved delta
  const monthlySavings = totals.euros_saved / Math.max(horizon, 1);
  const monthlyCurrentSpend = byDrug.reduce(
    (acc, d) => acc + d.current_avg_order_qty * (d.impact?.euros_saved ?? 0) / Math.max(d.current_avg_order_qty - d.recommended_qty, 1),
    0,
  );

  // Produce 12 monthly points regardless of horizon (extrapolate linearly beyond)
  return Array.from({ length: 12 }, (_, i) => {
    const m = i + 1;
    const current = Math.round(monthlyCurrentSpend * m);
    const optimal = Math.round(Math.max(0, monthlyCurrentSpend * m - monthlySavings * m));
    return {
      month: `M${m}`,
      current_cumulative_eur: current,
      optimal_cumulative_eur: optimal,
    };
  });
}
