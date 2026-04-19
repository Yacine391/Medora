"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown, ChevronUp, Printer, ArrowLeft, BookOpen,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
} from "@/components/ui/accordion";
import { Callout } from "@/components/Callout";
import { cn } from "@/lib/utils";

// ── TOC items ─────────────────────────────────────────────────────────────────

const TOC = [
  { href: "#before-start",   label: "1. Before you start"              },
  { href: "#upload",         label: "2. Step 1 — Upload your data"     },
  { href: "#results",        label: "3. Step 2 — Read the results"     },
  { href: "#decide",         label: "4. Step 3 — Decide what to order" },
  { href: "#faq",            label: "5. FAQ"                           },
  { href: "#glossary",       label: "6. Glossary"                      },
];

// ── Required CSV columns ──────────────────────────────────────────────────────

const REQUIRED_COLS = [
  { name: "date",                 type: "YYYY-MM-DD", desc: "Month of the order (first day of the month)" },
  { name: "drug_atc_code",        type: "string",     desc: "WHO ATC classification code (e.g. J01CA04)"  },
  { name: "drug_name",            type: "string",     desc: "Human-readable drug name"                    },
  { name: "qty_ordered",          type: "integer",    desc: "Units ordered that month"                    },
  { name: "qty_used",             type: "integer",    desc: "Units actually consumed"                     },
  { name: "qty_wasted",           type: "integer",    desc: "Units expired or discarded"                  },
  { name: "patient_visits",       type: "integer",    desc: "Total patient visits to the ward that month" },
  { name: "avg_lead_time_days",   type: "float",      desc: "Average days from order to delivery"         },
  { name: "unit_cost_eur",        type: "float",      desc: "Cost per unit in euros"                      },
];

const OPTIONAL_COLS = [
  { name: "pathology_focus", type: "string",  desc: "Main pathology of the ward (e.g. oncology)" },
  { name: "region",          type: "string",  desc: "Hospital region"                             },
  { name: "hospital_size_beds", type: "integer", desc: "Total number of beds"                     },
  { name: "is_rural",        type: "boolean", desc: "true / false"                                },
];

const GLOSSARY = [
  { term: "ATC code",       def: "Anatomical Therapeutic Chemical classification code. A WHO standard for identifying medicines (e.g. J01CA04 = amoxicillin). Medora uses ATC codes to group drugs by class for impact calculations." },
  { term: "LightGBM",       def: "A fast gradient-boosting algorithm. Medora uses it to predict the optimal order quantity from 30 features extracted from your order history. It runs on a standard CPU in under 60 seconds." },
  { term: "SHAP",           def: "SHapley Additive exPlanations. A method that shows how much each feature contributed to a specific prediction. Medora uses SHAP to display the top 3 reasons behind each recommendation." },
  { term: "HDS",            def: "Hébergement de Données de Santé. French certification required for any IT system that hosts health-related data in a hospital context. Medora is designed to be deployed in an HDS-certified environment." },
  { term: "RGPD",           def: "Règlement Général sur la Protection des Données (GDPR). French implementation of EU data protection law. Medora does not process individual patient data — it uses aggregated ward-level statistics only." },
  { term: "LCA",            def: "Life Cycle Assessment. A method to measure the environmental impact of a product across its full lifecycle (manufacturing, transport, use, disposal). Medora's CO₂ constants are derived from pharmaceutical LCA studies." },
  { term: "Scope 3",        def: "Indirect greenhouse gas emissions in a company's supply chain (CSRD category). For hospitals, medicine procurement is the largest Scope 3 source. Medora's CO₂ output maps directly to Scope 3 Category 1 reporting." },
  { term: "Ecotoxicity",    def: "The potential of a substance to harm living organisms in the environment, especially in water systems. Medora assigns an ecotoxicity score (0–100) to each drug class based on UNEP and OECD guidelines." },
  { term: "Lead time",      def: "The number of days between placing an order and receiving the delivery. Medora uses your historical lead time data to add a safety buffer when deliveries are unpredictable." },
  { term: "Safety margin",  def: "An additional quantity added to the base recommendation to protect against demand spikes or late deliveries. Medora uses a 5% base margin, increased for rural hospitals and drugs with variable lead times." },
];

// ── Main page ─────────────────────────────────────────────────────────────────

export default function GuidePage() {
  const [tocOpen, setTocOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">

      {/* PAGE HEADER */}
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-10 no-print">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-4 flex items-center gap-4">
          <Link
            href="/"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-1")}
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Home
          </Link>
          <div className="flex-1" />
          <Badge variant="outline" className="gap-1 text-xs hidden sm:flex">
            <BookOpen className="w-3 h-3" aria-hidden="true" /> 5 min read
          </Badge>
          <Button
            variant="outline"
            size="sm"
            className="gap-1 text-xs"
            onClick={() => window.print()}
          >
            <Printer className="w-3 h-3" aria-hidden="true" /> Download PDF
          </Button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8">

        {/* TITLE BLOCK */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            User Guide — How to use Medora
          </h1>
          <p className="text-lg text-muted-foreground">
            A step-by-step walkthrough for hospital pharmacists and procurement teams.
          </p>
        </div>

        {/* LAYOUT: TOC sidebar + content */}
        <div className="guide-layout lg:grid lg:grid-cols-[220px_1fr] lg:gap-12 items-start">

          {/* TABLE OF CONTENTS */}
          <aside aria-label="Table of contents">
            {/* Mobile: collapsible */}
            <div className="lg:hidden mb-6 no-print">
              <button
                onClick={() => setTocOpen((v) => !v)}
                className="flex items-center justify-between w-full text-sm font-semibold border rounded-lg px-4 py-3 bg-muted/50"
                aria-expanded={tocOpen}
              >
                Contents
                {tocOpen
                  ? <ChevronUp className="w-4 h-4" aria-hidden="true" />
                  : <ChevronDown className="w-4 h-4" aria-hidden="true" />
                }
              </button>
              {tocOpen && (
                <nav className="mt-2 border rounded-lg px-4 py-3 bg-muted/20 space-y-2">
                  {TOC.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setTocOpen(false)}
                      className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
              )}
            </div>

            {/* Desktop: sticky */}
            <nav
              aria-label="Table of contents"
              className="hidden lg:block sticky top-24 space-y-1 text-sm"
            >
              <p className="font-semibold text-xs uppercase tracking-widest text-muted-foreground mb-3">
                Contents
              </p>
              {TOC.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="block py-1 text-muted-foreground hover:text-foreground transition-colors border-l-2 border-transparent hover:border-emerald-600 pl-3"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </aside>

          {/* MAIN CONTENT */}
          <main className="guide-content space-y-14">

            {/* ── SECTION 1 ── */}
            <section id="before-start" className="print-section scroll-mt-24">
              <h2 className="text-2xl font-bold mb-4 pb-2 border-b">1. Before you start</h2>

              <h3 className="font-semibold text-base mb-2">What you need</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground mb-6">
                <li><strong className="text-foreground">24 months of order history</strong> — monthly quantities ordered, used, and wasted per drug</li>
                <li><strong className="text-foreground">Patient visit counts</strong> — total ward admissions or consultations per month</li>
                <li><strong className="text-foreground">Lead time records</strong> — average days from order placement to delivery</li>
                <li><strong className="text-foreground">Drug costs</strong> — unit price in euros for each medicine</li>
              </ul>

              <h3 className="font-semibold text-base mb-2">Where to find these files</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Most hospital pharmacy systems (Pharmagest, Dedalus, Maincare) include an export function in the
                procurement or stock management module. Look for <em>Export → Procurement history → CSV</em> or
                contact your IT department with the column list below. The export usually takes under 5 minutes.
              </p>

              <h3 className="font-semibold text-base mb-3">Required CSV columns</h3>
              <div className="overflow-x-auto rounded-lg border mb-4">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left px-3 py-2 font-medium">Column name</th>
                      <th className="text-left px-3 py-2 font-medium">Type</th>
                      <th className="text-left px-3 py-2 font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {REQUIRED_COLS.map((col, i) => (
                      <tr key={col.name} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                        <td className="px-3 py-2 font-mono text-xs">{col.name}</td>
                        <td className="px-3 py-2 text-muted-foreground">{col.type}</td>
                        <td className="px-3 py-2 text-muted-foreground">{col.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h3 className="font-semibold text-base mb-3">Optional columns</h3>
              <div className="overflow-x-auto rounded-lg border mb-6">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left px-3 py-2 font-medium">Column name</th>
                      <th className="text-left px-3 py-2 font-medium">Type</th>
                      <th className="text-left px-3 py-2 font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {OPTIONAL_COLS.map((col, i) => (
                      <tr key={col.name} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                        <td className="px-3 py-2 font-mono text-xs">{col.name}</td>
                        <td className="px-3 py-2 text-muted-foreground">{col.type}</td>
                        <td className="px-3 py-2 text-muted-foreground">{col.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Callout variant="privacy" title="Your data stays in your hospital">
                Medora runs on your own servers. When you upload a CSV, it is sent only to your
                local Medora API — not to any cloud service, not to any external company.
                No patient data or hospital records are stored outside your infrastructure.
                No external API is called during the analysis.
              </Callout>
            </section>

            {/* ── SECTION 2 ── */}
            <section id="upload" className="print-section scroll-mt-24">
              <h2 className="text-2xl font-bold mb-4 pb-2 border-b">2. Step 1 — Upload your data</h2>

              <div className="screenshot-placeholder border-2 border-dashed rounded-xl p-10 text-center text-sm text-muted-foreground mb-6 bg-muted/20">
                Screenshot: Upload tab — drop zone and Run analysis button
              </div>

              <ol className="space-y-4 text-sm mb-6">
                <li className="flex gap-3">
                  <span className="flex-none w-7 h-7 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">1</span>
                  <div>
                    <p className="font-medium">Open the Upload tab</p>
                    <p className="text-muted-foreground">On the demo page, click <strong>Upload your CSV</strong> in the data source selector.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-none w-7 h-7 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">2</span>
                  <div>
                    <p className="font-medium">Drop or select your file</p>
                    <p className="text-muted-foreground">Click the dashed area and choose your CSV file. Or drag and drop it directly. The file name will appear when it is loaded.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-none w-7 h-7 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">3</span>
                  <div>
                    <p className="font-medium">Click Run analysis</p>
                    <p className="text-muted-foreground">The AI will process your data locally. Analysis takes under 30 seconds for a standard 24-month dataset. Results appear below the controls.</p>
                  </div>
                </li>
              </ol>

              <Callout variant="warning" title="CSV rejected? Check these common issues">
                <ul className="list-disc pl-4 space-y-1 mt-1">
                  <li>All 9 required columns must be present (exact spelling, lowercase)</li>
                  <li>File encoding must be <strong>UTF-8</strong> (not Latin-1 or Windows-1252)</li>
                  <li>Dates must be in <strong>YYYY-MM-DD</strong> format (e.g. 2024-03-01, not 01/03/2024)</li>
                  <li>Numbers must use a decimal point, not a comma (1234.56, not 1234,56)</li>
                  <li>No empty rows in the middle of the file</li>
                </ul>
              </Callout>
            </section>

            {/* ── SECTION 3 ── */}
            <section id="results" className="print-section scroll-mt-24">
              <h2 className="text-2xl font-bold mb-4 pb-2 border-b">3. Step 2 — Read the results</h2>

              {/* A — KPI Cards */}
              <h3 className="font-semibold text-lg mb-3">A. KPI cards</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Four summary numbers appear at the top of the results. They cover the full forecast period you selected.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {[
                  { title: "Units over-ordered", color: "text-emerald-600", desc: "The number of doses you would have ordered but not used. This is the waste Medora eliminates by recommending a smaller quantity." },
                  { title: "CO₂e saved", color: "text-emerald-600", desc: "Kilograms of CO₂ equivalent avoided across the full medicine lifecycle: manufacturing the active ingredient in Asia, shipping it 10,000 km, and incinerating what is never used." },
                  { title: "Euros saved", color: "text-emerald-600", desc: "Direct cost reduction. This is the procurement budget you keep by not buying medicines that would expire. It does not include handling or storage costs." },
                  { title: "Ecotox score", color: "text-orange-600", desc: "An index of environmental toxicity. A lower score means less pollution in waterways and soil. The score is higher for chemotherapy and antibiotics than for analgesics." },
                ].map((card) => (
                  <div key={card.title} className="rounded-lg border p-4 bg-muted/20">
                    <p className={`font-semibold text-sm mb-1 ${card.color}`}>{card.title}</p>
                    <p className="text-sm text-muted-foreground">{card.desc}</p>
                  </div>
                ))}
              </div>

              {/* B — Charts */}
              <h3 className="font-semibold text-lg mb-3">B. The 3 charts</h3>

              <div className="space-y-4 mb-8">
                <div className="rounded-lg border p-4">
                  <p className="font-medium text-sm mb-1">Before/After bar chart</p>
                  <p className="text-sm text-muted-foreground">
                    Each drug appears as two bars side by side. The <strong>grey bar</strong> is your current average order. The
                    <strong> green bar</strong> is Medora&apos;s recommendation. A smaller green bar means Medora found over-ordering.
                    Hover over any bar to see the exact quantity.
                  </p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="font-medium text-sm mb-1">CO₂ breakdown pie chart</p>
                  <p className="text-sm text-muted-foreground">
                    Shows <em>where</em> the CO₂ savings come from.
                    Manufacturing is usually the largest slice because producing active pharmaceutical ingredients
                    emits 65 kg CO₂e per kilogram — 105 times more than making cement.
                    Transport and incineration are smaller contributors.
                  </p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="font-medium text-sm mb-1">Cumulative savings projection</p>
                  <p className="text-sm text-muted-foreground">
                    A line chart showing how savings accumulate over 12 months.
                    The <strong>grey line</strong> is your current spend trajectory.
                    The <strong>green line</strong> shows projected spend if you follow Medora&apos;s recommendations.
                    The gap between the two lines is your total avoided cost.
                  </p>
                </div>
              </div>

              {/* C — Per-drug table */}
              <h3 className="font-semibold text-lg mb-3">C. Per-drug table</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Each row is one medicine. The table is sorted by largest euro savings at the top.
              </p>
              <div className="overflow-x-auto rounded-lg border mb-4">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left px-3 py-2 font-medium">Column</th>
                      <th className="text-left px-3 py-2 font-medium">What it means</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Drug / ATC", "Name and classification code of the medicine"],
                      ["Current order", "Your average monthly order quantity over the last 6 months"],
                      ["Recommended", "What Medora suggests you order next period. Includes all safety margins."],
                      ["Reduction %", "Percentage difference between current and recommended. Red = high over-ordering."],
                      ["CO₂ saved", "Kilograms of CO₂e avoided for this drug over the forecast period"],
                      ["€ saved", "Euros saved by not buying the over-ordered quantity"],
                      ["Top driver", "The most important reason behind this recommendation. Hover to see a full explanation."],
                    ].map(([col, desc], i) => (
                      <tr key={col} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                        <td className="px-3 py-2 font-medium whitespace-nowrap">{col}</td>
                        <td className="px-3 py-2 text-muted-foreground">{desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Callout variant="info" title="Sorting the table">
                The table is pre-sorted by highest euro savings. To focus on the biggest environmental
                impact instead, compare the CO₂ saved column — chemotherapy and antibiotic drugs
                score highest because of their manufacturing carbon footprint.
              </Callout>
            </section>

            {/* ── SECTION 4 ── */}
            <section id="decide" className="print-section scroll-mt-24">
              <h2 className="text-2xl font-bold mb-4 pb-2 border-b">4. Step 3 — Decide what to order</h2>

              <Callout variant="success" title="You always have the last word" className="mb-6">
                Medora provides a recommendation. You decide. The system never places an order automatically.
                Every number you see is a starting point for your professional judgement.
              </Callout>

              <div className="space-y-6 text-sm">
                <div className="rounded-lg border-l-4 border-emerald-500 pl-4 py-1">
                  <p className="font-semibold mb-1">Accept the recommendation when:</p>
                  <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                    <li>The drug has a stable, predictable demand pattern (e.g. paracetamol, common antibiotics)</li>
                    <li>The confidence interval is narrow (small gap between low and high estimate)</li>
                    <li>The top driver explains something you already know about that drug</li>
                    <li>The reduction is modest (under 15%) — lower risk if the forecast is slightly off</li>
                  </ul>
                </div>

                <div className="rounded-lg border-l-4 border-amber-500 pl-4 py-1">
                  <p className="font-semibold mb-1">Override when:</p>
                  <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                    <li>You know a rare drug has zero substitution — stockout is unacceptable</li>
                    <li>A new patient population or care pathway has started recently (not yet in the data)</li>
                    <li>A flu season or outbreak is expected and the model doesn&apos;t yet have this year&apos;s signal</li>
                    <li>The drug is on the ANSM shortage list — order what is available, not what the model says</li>
                  </ul>
                </div>

                <div className="rounded-lg border-l-4 border-blue-500 pl-4 py-1">
                  <p className="font-semibold mb-1">Investigate further when:</p>
                  <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                    <li>The top driver is surprising — hover on it to read the full explanation</li>
                    <li>The recommended quantity is more than 30% below your current order (large reduction = higher risk if wrong)</li>
                    <li>The drug has missing months in your data — the model may have fewer signals than usual</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* ── SECTION 5 — FAQ ── */}
            <section id="faq" className="print-section scroll-mt-24">
              <h2 className="text-2xl font-bold mb-4 pb-2 border-b">5. FAQ</h2>

              <Accordion multiple className="space-y-2">
                {[
                  {
                    value: "medical-device",
                    q: "Is Medora a medical device?",
                    a: "No. Medora optimises procurement quantities — a logistics and administrative function. It does not advise on which drug to prescribe or what dose to give a patient. This distinction means it is not regulated as a medical device under EU MDR 2017/745. A formal legal opinion will be obtained before any production hospital deployment.",
                  },
                  {
                    value: "patient-safety",
                    q: "Could Medora recommend too few units and put patients at risk?",
                    a: "Medora always applies a safety margin on top of the base forecast: a 5% buffer for all drugs, an additional buffer for rural hospitals, and a lead-time variance buffer for drugs with unpredictable delivery times. The pharmacist reviews and approves every recommendation before any order is placed — the system never places orders automatically. For critical drugs, you should always use the upper end of the confidence interval.",
                  },
                  {
                    value: "frequency",
                    q: "How often should I re-run the analysis?",
                    a: "We recommend running a new analysis once per ordering cycle — typically monthly. After a major change (new patient population, ward reorganisation, supply disruption), run it again with updated data. The model retrains automatically each time you upload a new file.",
                  },
                  {
                    value: "new-drug",
                    q: "What if a new drug arrives with zero history?",
                    a: "If a drug has fewer than 6 months of data, Medora marks it as 'Insufficient data — manual review required' and does not produce a recommendation. Order these drugs using your pharmacy guidelines or supplier baseline. After 6 months of data is available, the model will include them automatically.",
                  },
                  {
                    value: "integration",
                    q: "Can I integrate Medora with Pharmagest, Maincare, or Dedalus?",
                    a: "Today, the integration is a CSV export from your ERP and an upload to Medora — this takes about 5 minutes. A direct API connector for Pharmagest, Dedalus, and SAP IS-H is on the v2 roadmap (planned for Q3 of the first year of deployment). Contact your Medora representative for the integration timeline.",
                  },
                  {
                    value: "local-data",
                    q: "Is the data really local?",
                    a: "Yes. Your CSV is sent only to the Medora API running on your hospital's server (or your HDS-certified private cloud). It is parsed in memory, used for analysis, and not stored after the session. The Medora frontend is a static website — no CSV bytes pass through the web server. You can verify this by checking the Network tab in your browser's developer tools.",
                  },
                  {
                    value: "co2-calc",
                    q: "How is the CO₂ number calculated?",
                    a: "Three components are summed: manufacturing emissions (avoided units × drug weight × 65 kg CO₂e/kg API, from Shift Project 2025), transport emissions (avoided mass × 10,000 km × ADEME transport factor), and incineration emissions (avoided mass × 2.5 kg CO₂e/kg, from ADEME Base Empreinte 2024). All constants are documented in the source code and cross-referenced with published data sources.",
                  },
                  {
                    value: "support",
                    q: "Who do I contact for support?",
                    a: "For technical issues (CSV rejected, API not responding), check the error message in the demo page — it includes the exact command to restart the local API. For questions about the methodology, recommendations, or deployment, contact the Medora team at the email address on your contract. For the hackathon demo, use the contact information on the landing page.",
                  },
                ].map((item) => (
                  <AccordionItem key={item.value} value={item.value} className="border rounded-lg px-4">
                    <AccordionTrigger className="text-sm font-medium text-left">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-muted-foreground pb-2">{item.a}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            {/* ── SECTION 6 — GLOSSARY ── */}
            <section id="glossary" className="print-section scroll-mt-24">
              <h2 className="text-2xl font-bold mb-4 pb-2 border-b">6. Glossary</h2>
              <dl className="space-y-4">
                {GLOSSARY.map((item) => (
                  <div key={item.term} className="rounded-lg border p-4 bg-muted/20">
                    <dt className="font-semibold text-sm text-emerald-700 mb-1">{item.term}</dt>
                    <dd className="text-sm text-muted-foreground">{item.def}</dd>
                  </div>
                ))}
              </dl>
            </section>

            {/* FOOTER */}
            <footer className="border-t pt-6 text-xs text-muted-foreground flex flex-col sm:flex-row justify-between gap-2">
              <span>Medora User Guide v1.0 — last updated April 2026</span>
              <Link href="/" className="hover:underline text-emerald-600">← Back to home</Link>
            </footer>

          </main>
        </div>
      </div>
    </div>
  );
}
