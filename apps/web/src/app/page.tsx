import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, Brain, Target, Zap, Truck, Leaf, Euro, Lock, ShieldCheck, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <main id="main-content" className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* TOP NAV */}
      <nav className="border-b bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between">
          <span className="font-bold text-emerald-600 text-sm">Medora</span>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/guide" className="text-muted-foreground hover:text-foreground transition-colors">
              User Guide
            </Link>
            <Link
              href="/demo"
              className={cn(buttonVariants({ size: "sm" }), "bg-emerald-600 hover:bg-emerald-700 text-white")}
            >
              Try the demo
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative flex flex-col items-center justify-center min-h-[90vh] px-4 py-20 text-center overflow-hidden">
        {/* Animated gradient background */}
        <svg
          className="absolute inset-0 -z-10 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="heroGlow" cx="50%" cy="30%" r="60%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.18">
                <animate
                  attributeName="stopOpacity"
                  values="0.18;0.38;0.18"
                  dur="6s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="heroGlow2" cx="80%" cy="80%" r="40%">
              <stop offset="0%" stopColor="#059669" stopOpacity="0.1">
                <animate
                  attributeName="stopOpacity"
                  values="0.1;0.22;0.1"
                  dur="9s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="100%" stopColor="#059669" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#heroGlow)" />
          <rect width="100%" height="100%" fill="url(#heroGlow2)" />
        </svg>

        <Badge
          variant="outline"
          className="mb-6 border-emerald-600 text-emerald-600 text-sm px-4 py-1"
        >
          AI · Healthcare · Sustainability
        </Badge>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight max-w-3xl leading-tight">
          Hospitals order{" "}
          <span className="text-emerald-600">20% too much.</span>
          <br className="hidden sm:block" />
          {" "}We fix that.
        </h1>

        <p className="mt-6 text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl leading-relaxed">
          Medora uses AI to compute the exact medicine quantity each hospital
          should order — cutting waste, CO₂ and costs at the source.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full max-w-sm sm:max-w-none sm:w-auto px-0">
          <Link
            href="/demo"
            className={cn(
              buttonVariants({ size: "lg" }),
              "w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white text-base font-semibold px-8"
            )}
          >
            Try the demo
          </Link>
          <a
            href="#how"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "w-full sm:w-auto text-base px-8"
            )}
          >
            See how it works
          </a>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="px-4 py-12 sm:py-20 bg-muted/40">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
            The scale of the problem
          </h2>
          <p className="text-center text-muted-foreground mb-10 max-w-xl mx-auto">
            France alone wastes billions every year on medicines that expire on
            hospital shelves.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Card className="border-emerald-600/30 shadow-sm">
              <CardHeader className="pb-2">
                <p className="text-4xl sm:text-5xl font-extrabold text-emerald-600">
                  €1.7B
                </p>
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  per year
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Wasted on medicines never used in French hospitals.
                </p>
                <p className="text-xs text-muted-foreground/60 mt-2">
                  Source: Cour des comptes 2025
                </p>
              </CardContent>
            </Card>

            <Card className="border-emerald-600/30 shadow-sm">
              <CardHeader className="pb-2">
                <p className="text-4xl sm:text-5xl font-extrabold text-emerald-600">
                  7,675 t
                </p>
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  of medicines
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Thrown away in 2024 — expired, unused, incinerated.
                </p>
                <p className="text-xs text-muted-foreground/60 mt-2">
                  Source: Cyclamed
                </p>
              </CardContent>
            </Card>

            <Card className="border-emerald-600/30 shadow-sm">
              <CardHeader className="pb-2">
                <p className="text-4xl sm:text-5xl font-extrabold text-emerald-600">
                  1M t CO₂e
                </p>
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  from waste alone
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Equivalent to 200,000 cars driven for a full year.
                </p>
                <p className="text-xs text-muted-foreground/60 mt-2">
                  Source: Shift Project 2025
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="px-4 py-12 sm:py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
            How Medora works
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
            Three steps from raw hospital data to an optimised order.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="rounded-full bg-emerald-600/10 p-5">
                <Upload className="w-8 h-8 text-emerald-600" aria-hidden="true" />
              </div>
              <div>
                <p className="font-semibold text-lg mb-1">
                  1 · Upload your order history
                </p>
                <p className="text-sm text-muted-foreground">
                  A simple CSV with 24 months of data. We handle the rest.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center text-center gap-4">
              <div className="rounded-full bg-emerald-600/10 p-5">
                <Brain className="w-8 h-8 text-emerald-600" aria-hidden="true" />
              </div>
              <div>
                <p className="font-semibold text-lg mb-1">
                  2 · AI analyses 8+ factors
                </p>
                <p className="text-sm text-muted-foreground">
                  History, waste, patient visits, seasonality, lead time, safety
                  stock, stockouts, pathology prevalence.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center text-center gap-4">
              <div className="rounded-full bg-emerald-600/10 p-5">
                <Target className="w-8 h-8 text-emerald-600" aria-hidden="true" />
              </div>
              <div>
                <p className="font-semibold text-lg mb-1">
                  3 · Get the optimal order
                </p>
                <p className="text-sm text-muted-foreground">
                  Exact quantity + confidence interval + top 3 drivers
                  explained in plain language.
                </p>
              </div>
            </div>
          </div>
          <p className="text-center mt-10 text-sm text-muted-foreground">
            Want more detail?{" "}
            <Link href="/guide" className="text-emerald-600 hover:underline font-medium">
              Read the user guide →
            </Link>
          </p>
        </div>
      </section>

      {/* BUILT FOR HOSPITAL REALITY */}
      <section className="px-4 py-12 sm:py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
            Built for hospital reality
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
            Healthcare data is sensitive. Medora was designed around that constraint from day one.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Card className="shadow-sm border-emerald-600/20">
              <CardContent className="pt-6 flex flex-col items-start gap-4">
                <div className="rounded-full bg-emerald-600/10 p-3">
                  <Lock className="w-6 h-6 text-emerald-600" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-semibold text-base mb-2">Your data stays yours</p>
                  <p className="text-sm text-muted-foreground">
                    Medora runs on your infrastructure. Patient data, order history, waste
                    records — none of it ever leaves your hospital. No cloud. No external
                    API calls for predictions.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-emerald-600/20">
              <CardContent className="pt-6 flex flex-col items-start gap-4">
                <div className="rounded-full bg-emerald-600/10 p-3">
                  <ShieldCheck className="w-6 h-6 text-emerald-600" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-semibold text-base mb-2">HDS & RGPD ready</p>
                  <p className="text-sm text-muted-foreground">
                    Designed from day one for French HDS hosting and RGPD Article 9
                    compliance. Ships as a container, runs next to your existing
                    pharmacy software.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-emerald-600/20">
              <CardContent className="pt-6 flex flex-col items-start gap-4">
                <div className="rounded-full bg-emerald-600/10 p-3">
                  <Eye className="w-6 h-6 text-emerald-600" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-semibold text-base mb-2">Explainable, not a black box</p>
                  <p className="text-sm text-muted-foreground">
                    Every recommendation comes with its top 3 drivers. Your pharmacist
                    sees exactly why the AI suggests 980 units instead of 1200. No magic
                    — just data.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* IMPACT */}
      <section className="px-4 py-12 sm:py-20 bg-muted/40">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
            Four dimensions of impact
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
            Every optimised order reduces harm across all four axes.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="shadow-sm">
              <CardContent className="pt-6 flex flex-col items-center text-center gap-3">
                <Zap className="w-7 h-7 text-emerald-600" aria-hidden="true" />
                <p className="font-semibold">Energy → CO₂</p>
                <p className="text-sm text-muted-foreground">
                  Less CO₂ from manufacturing medicines that will never be used.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="pt-6 flex flex-col items-center text-center gap-3">
                <Truck className="w-7 h-7 text-emerald-600" aria-hidden="true" />
                <p className="font-semibold">Transport → CO₂</p>
                <p className="text-sm text-muted-foreground">
                  Less CO₂ from 10,000 km shipping of APIs from Asia that
                  expire on shelves.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="pt-6 flex flex-col items-center text-center gap-3">
                <Leaf className="w-7 h-7 text-emerald-600" aria-hidden="true" />
                <p className="font-semibold">Pollution</p>
                <p className="text-sm text-muted-foreground">
                  Less ecotoxicity — protecting biodiversity, water quality and
                  human health.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="pt-6 flex flex-col items-center text-center gap-3">
                <Euro className="w-7 h-7 text-emerald-600" aria-hidden="true" />
                <p className="font-semibold">Cost</p>
                <p className="text-sm text-muted-foreground">
                  Direct euros saved by the hospital — reallocatable to patient
                  care.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-12 sm:py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-bold mb-4">
            Test Medora live in 30 seconds
          </h2>
          <p className="text-muted-foreground mb-8">
            Upload a CSV or use our demo dataset. No account required.
          </p>
          <Link
            href="/demo"
            className={cn(
              buttonVariants({ size: "lg" }),
              "w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white text-base font-semibold px-12"
            )}
          >
            Try the demo
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t px-4 py-8 text-center text-xs text-muted-foreground">
        Medora · Built for MIT Hackathon · Sources:{" "}
        <span className="font-medium">Shift Project</span>,{" "}
        <span className="font-medium">Cyclamed</span>,{" "}
        <span className="font-medium">Cour des comptes</span>
      </footer>
    </main>
  );
}
