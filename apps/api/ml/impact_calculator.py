from .impact_constants import (
    AVG_DRUG_WEIGHT_G,
    AVG_TRANSPORT_KM_ASIA_TO_FR,
    CARBON_PER_KG_API,
    CARBON_PER_KG_INCINERATION,
    CARBON_PER_KG_PACKAGING,
    CARBON_PER_TKM_MARITIME,
    CARBON_PER_TKM_ROAD,
    CO2_KG_PER_CAR_KM,
    CO2_KG_PER_HOUSEHOLD_DAY,
    CO2_KG_PER_TREE_YEAR,
    ECOTOX_BY_ATC_PREFIX,
    MARITIME_SHARE_KM,
    ROAD_SHARE_KM,
)


def _ecotox_class(score: float) -> str:
    if score < 50:
        return "low"
    if score < 100:
        return "moderate"
    if score < 200:
        return "high"
    return "critical"


class ImpactCalculator:
    def calculate(
        self,
        drug_atc_code: str,
        qty_avoided: int,
        unit_cost_eur: float,
    ) -> dict:
        if qty_avoided <= 0:
            return self._zero_impact(drug_atc_code, qty_avoided, unit_cost_eur)

        mass_kg = qty_avoided * AVG_DRUG_WEIGHT_G / 1000

        # 1. Manufacturing CO2
        co2_manufacturing = mass_kg * CARBON_PER_KG_API + mass_kg * CARBON_PER_KG_PACKAGING

        # 2. Transport CO2
        mass_tons = mass_kg / 1000
        co2_transport = (
            mass_tons * MARITIME_SHARE_KM * CARBON_PER_TKM_MARITIME
            + mass_tons * ROAD_SHARE_KM * CARBON_PER_TKM_ROAD
        )

        # 3. Incineration CO2
        co2_incineration = mass_kg * CARBON_PER_KG_INCINERATION

        co2_total_kg = co2_manufacturing + co2_transport + co2_incineration

        # 4. Ecotoxicity
        atc_prefix = drug_atc_code[:3]
        ecotox_unit = ECOTOX_BY_ATC_PREFIX.get(atc_prefix, ECOTOX_BY_ATC_PREFIX["DEFAULT"])
        ecotox_total = round(ecotox_unit * qty_avoided / 100, 1)

        # 5. Euros saved
        euros_saved = round(qty_avoided * unit_cost_eur, 2)

        # 6. Human equivalents
        car_km = int(co2_total_kg / CO2_KG_PER_CAR_KM)
        trees = int(co2_total_kg / CO2_KG_PER_TREE_YEAR)
        households = int(co2_total_kg / CO2_KG_PER_HOUSEHOLD_DAY)

        return {
            "qty_avoided": qty_avoided,
            "mass_kg_avoided": round(mass_kg, 3),
            "co2_total_kg": round(co2_total_kg, 2),
            "co2_breakdown": {
                "manufacturing_kg": round(co2_manufacturing, 2),
                "transport_kg": round(co2_transport, 4),
                "incineration_kg": round(co2_incineration, 2),
            },
            "transport_km_equivalent": AVG_TRANSPORT_KM_ASIA_TO_FR,
            "ecotox_score": ecotox_total,
            "ecotox_class": _ecotox_class(ecotox_total),
            "euros_saved": euros_saved,
            "human_equivalents": {
                "car_km": f"car driving {car_km:,} km",
                "trees_year": f"{trees} trees absorbing CO₂ for 1 year",
                "households_day": f"{households} household daily electricity",
            },
        }

    def _zero_impact(self, atc: str, qty: int, cost: float) -> dict:
        return {
            "qty_avoided": qty,
            "mass_kg_avoided": 0.0,
            "co2_total_kg": 0.0,
            "co2_breakdown": {"manufacturing_kg": 0.0, "transport_kg": 0.0, "incineration_kg": 0.0},
            "transport_km_equivalent": AVG_TRANSPORT_KM_ASIA_TO_FR,
            "ecotox_score": 0.0,
            "ecotox_class": "low",
            "euros_saved": 0.0,
            "human_equivalents": {
                "car_km": "car driving 0 km",
                "trees_year": "0 trees absorbing CO₂ for 1 year",
                "households_day": "0 household daily electricity",
            },
        }
