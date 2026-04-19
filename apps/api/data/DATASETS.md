# Medora — Dataset Inventory

Real datasets documented here. MVP uses synthetic data (see `generate_synthetic.py`).
Download and integration deferred to post-hackathon.

---

## 1. ATC Classification — WHO Collaborating Centre for Drug Statistics
- **URL:** https://www.whocc.no/atc_ddd_index/
- **License:** Free for non-commercial use (attribution required)
- **Format:** HTML table / downloadable Excel
- **Relevance:** 5/5 — foundational taxonomy for all drug codes used in Medora
- **Status:** Needs scraping or manual download (no bulk API)

---

## 2. ADEME Base Empreinte — Agence de la transition écologique
- **URL:** https://base-empreinte.ademe.fr/donnees/jeu-donnees
- **License:** Open (Licence Ouverte Etalab)
- **Format:** CSV / Excel
- **Relevance:** 5/5 — authoritative French CO2 emission factors for transport and manufacturing
- **Status:** Usable directly (CSV download available after free registration)

---

## 3. Cyclamed Annual Reports — Cyclamed Association
- **URL:** https://www.cyclamed.org/nos-resultats/
- **License:** Public report (no reuse restriction stated)
- **Format:** PDF only
- **Relevance:** 5/5 — waste tonnage statistics used in Medora's impact calculations
- **Status:** PDF only — key figures extracted manually (7 675 tons in 2024)

---

## 4. OpenMedic — Assurance Maladie (CNAM)
- **URL:** https://data.ameli.fr/explore/dataset/open-medic/
- **License:** Open (Licence Ouverte v2.0 / Etalab)
- **Format:** CSV (bulk download + API)
- **Relevance:** 4/5 — national drug consumption volumes by ATC code, per region
- **Status:** API available — direct integration feasible

---

## 5. DREES / ATIH — Hospital Activity Data France
- **URL:** https://www.scansante.fr/open-data / https://www.atih.sante.fr/open-data-pmsi
- **License:** Open (Etalab)
- **Format:** CSV / Excel
- **Relevance:** 4/5 — patient visit volumes and hospital activity, key input feature for forecasting
- **Status:** Usable directly (annual CSV downloads available)

---

## 6. Shift Project — "Décarbonons la Santé" Report
- **URL:** https://theshiftproject.org/article/decarboner-sante-rapport/
- **License:** Public report (Creative Commons NC)
- **Format:** PDF only
- **Relevance:** 5/5 — medicine LCA data: 65 kg CO2e/kg API, transport distances, emission breakdown
- **Status:** PDF only — key figures extracted (used as hardcoded constants in impact calculator)

---

## 7. EMA — European Medicines Agency (EPAR database)
- **URL:** https://www.ema.europa.eu/en/medicines/download-medicine-data
- **License:** Open (EMA reuse policy)
- **Format:** Excel / CSV
- **Relevance:** 3/5 — EU drug approval data, active substances, ATC codes cross-reference
- **Status:** Usable directly (bulk download available)

---

## 8. WHO Essential Medicines List
- **URL:** https://www.who.int/groups/expert-committee-on-selection-and-use-of-essential-medicines/essential-medicines-lists
- **License:** CC BY-NC-SA 3.0 IGO
- **Format:** PDF / Excel
- **Relevance:** 3/5 — reference list for drug prioritisation in low-resource settings
- **Status:** Usable directly (Excel available)

---

## Notes on synthetic data rationale

Real datasets are either PDF-only, require authentication, or are too large to process in a hackathon window.
The synthetic generator in `generate_synthetic.py` is calibrated against:
- Waste rates from Cyclamed (8–25% depending on drug class)
- CO2 constants from Shift Project (65 kg CO2e/kg API)
- Consumption volumes from OpenMedic magnitude orders
- Hospital sizes from DREES hospital census
