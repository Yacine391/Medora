# Impact calculation constants — source of truth for all CO2/ecotox/cost factors.
# Do NOT duplicate these in ARCHITECTURE.md; refer to this file instead.

# Energy intensity of pharma manufacturing (Shift Project 2025)
CARBON_PER_KG_API = 65          # kg CO2e per kg of active pharmaceutical ingredient
CARBON_PER_KG_PACKAGING = 3.5   # kg CO2e per kg packaging
AVG_DRUG_WEIGHT_G = 50          # grams per unit (package avg, generic estimate)

# Transport (Shift Project + ADEME Base Empreinte)
AVG_TRANSPORT_KM_ASIA_TO_FR = 10_000   # km from manufacturing (India/China) to France
CARBON_PER_TKM_MARITIME = 0.008        # kg CO2e per ton·km (maritime freight)
CARBON_PER_TKM_ROAD = 0.062            # kg CO2e per ton·km (road freight, last mile)
ROAD_SHARE_KM = 500                    # last-mile road distance in France
MARITIME_SHARE_KM = 9_500              # rest by ship

# End-of-life incineration (Cyclamed / ADEME)
CARBON_PER_KG_INCINERATION = 1.2      # kg CO2e per kg incinerated (waste-to-energy France)

# Human-readable CO2 equivalence factors
CO2_KG_PER_CAR_KM = 0.17              # kg CO2e per car-km (ADEME average)
CO2_KG_PER_TREE_YEAR = 17             # kg CO2e absorbed per tree per year
CO2_KG_PER_HOUSEHOLD_DAY = 8          # kg CO2e per average French household per day

# Ecotoxicity scores 0-100 per unit (normalized)
# Sources: UNEP 2019 Pharmaceuticals in Environment, OECD 2019
# Reflects: persistence in water, bioaccumulation factor, endocrine disruption potential
ECOTOX_BY_ATC_PREFIX: dict[str, int] = {
    "J01": 75,   # Antibiotics — AMR driver, very high aquatic ecotox
    "L01": 90,   # Oncology — cytotoxic, extreme ecotox
    "N02": 30,   # Analgesics — moderate
    "N03": 40,   # Antiepileptics
    "C07": 20,   # Beta-blockers — low but persistent in waterways
    "C09": 20,   # ACE inhibitors
    "C10": 25,   # Statins
    "R03": 35,   # Respiratory
    "H02": 60,   # Corticosteroids — endocrine disruptor
    "G03": 85,   # Hormones — endocrine, high concern
    "DEFAULT": 40,
}
