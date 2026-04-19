import type { FullResult } from "@/lib/api";

export function validateResult(result: FullResult): string[] {
  const warnings: string[] = [];

  if (!result.by_drug || result.by_drug.length === 0)
    warnings.push("by_drug is empty");
  if (result.totals.qty_avoided < 0)
    warnings.push(`Negative qty_avoided: ${result.totals.qty_avoided}`);
  if (result.totals.euros_saved < 0)
    warnings.push(`Negative euros_saved: ${result.totals.euros_saved}`);
  if (result.totals.co2_total_kg < 0)
    warnings.push(`Negative co2_total_kg: ${result.totals.co2_total_kg}`);

  for (const drug of result.by_drug) {
    if (drug.recommended_qty < 0)
      warnings.push(`Negative recommended_qty for ${drug.drug_atc_code}: ${drug.recommended_qty}`);
    if (drug.reduction_pct < -100 || drug.reduction_pct > 100)
      warnings.push(`Out-of-range reduction_pct for ${drug.drug_atc_code}: ${drug.reduction_pct}`);
    if (!drug.drug_name || !drug.drug_atc_code)
      warnings.push(`Missing drug identity at index ${result.by_drug.indexOf(drug)}`);
  }

  return warnings;
}
