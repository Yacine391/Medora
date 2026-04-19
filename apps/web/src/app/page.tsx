import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Upload, Brain, Target, Zap, Truck, Leaf, Euro,
  Lock, ShieldCheck, Eye, BarChart3, ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/Logo";

export default function Home() {
  return (
    <main id="main-content" className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* ── NAV ── */}
      <nav className="border-b border-emerald-100 bg-white/90 backdrop-blur sticky top-0 z-10 shadow-medora-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between">
          <Logo size="sm" />
          <div className="flex items-center gap-4 text-sm">
            <Link
              href="/guide"
              className="text-muted-foreground hover:text-emerald-700 transition-colors font-medium"
            >
              User Guide
            </Link>
            <Link
              href="/demo"
              className={cn(
                buttonVariants({ size: "sm" }),
                "bg-medora-gradient hover:opacity-90 text-white shadow-medora-sm transition-all duration-200"
              )}
            >
              Try the demo
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative flex flex-col items-center justify-center min-h-[88vh] px-4 py-24 sm:py-32 text-center overflow-hidden bg-medora-hero">

        {/* Floating decorative elements */}
        <div className="absolute top-20 left-[8%] opacity-20 animate-float hidden lg:block" aria-hidden="true">
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
            <path d="M28 6C18 6 10 15 10 24c0 7 4 12 10 16l8 8 8-8c6-4 10-9 10-16 0-9-8-18-18-18z" fill="hsl(158 64% 38%)" />
            <path d="M28 18v14M21 25h14" stroke="white" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
        <div className="absolute bottom-28 right-[6%] opacity-15 animate-float [animation-delay:2s] hidden lg:block" aria-hidden="true">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="18" fill="hsl(145 55% 48%)" />
            <path d="M20 12v16M12 20h16" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
        <div className="absolute top-40 right-[12%] opacity-10 animate-float [animation-delay:3.5s] hidden xl:block" aria-hidden="true">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect x="2" y="2" width="28" height="28" rx="8" fill="hsl(158 64% 38%)" />
          </svg>
        </div>

        <Badge
          variant="outline"
          className="mb-6 border-emerald-300 text-emerald-700 bg-emerald-50 text-sm px-4 py-1.5 font-medium shadow-medora-sm animate-fade-in-up"
        >
          AI · Healthcare · Sustainability
        </Badge>

        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight max-w-3xl leading-[1.1] animate-fade-in-up [animation-delay:100ms]">
          Hospitals order{" "}
          <span className="text-medora-gradient">20% too much.</span>
          <br className="hidden sm:block" />
          {" "}We fix that.
        </h1>

        <p className="mt-6 text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl leading-relaxed animate-fade-in-up [animation-delay:200ms]">
          Medora uses AI to compute the exact medicine quantity each hospital
          should order — cutting waste, CO₂ and costs at the source.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full max-w-sm sm:max-w-none sm:w-auto animate-fade-in-up [animation-delay:300ms]">
          <Link
            href="/demo"
            className={cn(
              buttonVariants({ size: "lg" }),
              "w-full sm:w-auto bg-medora-gradient hover:opacity-90 text-white text-base font-semibold px-10 shadow-medora-glow transition-all duration-200 hover:-translate-y-0.5 hover:shadow-medora-lg"
            )}
          >
            Try the demo
            <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
          </Link>
          <a
            href="#how"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "w-full sm:w-auto text-base px-10 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200"
            )}
          >
            See how it works
          </a>
        </div>
      </section>

      {/* ── PROBLEM ── */}
      <section className="px-4 py-16 sm:py-24 bg-medora-soft">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-2xl sm:text-4xl font-bold mb-4">
              The scale of the problem
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-base sm:text-lg">
              France alone wastes billions every year on medicines that expire on
              hospital shelves.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Card 1 */}
            <Card className="border-emerald-100 shadow-medora-md rounded-2xl hover:shadow-medora-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden">
              <CardHeader className="pb-2 pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-4xl sm:text-5xl font-extrabold text-emerald-700">
                      €1.7B
                    </p>
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mt-1">
                      per year
                    </p>
                  </div>
                  <div className="bg-emerald-50 rounded-full p-3 shrink-0">
                    <Euro className="w-5 h-5 text-emerald-600" aria-hidden="true" />
                  </div>
                </div>
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

            {/* Card 2 */}
            <Card className="border-emerald-100 shadow-medora-md rounded-2xl hover:shadow-medora-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden">
              <CardHeader className="pb-2 pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-4xl sm:text-5xl font-extrabold text-emerald-700">
                      7,675 t
                    </p>
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mt-1">
                      of medicines
                    </p>
                  </div>
                  <div className="bg-emerald-50 rounded-full p-3 shrink-0">
                    <Leaf className="w-5 h-5 text-emerald-600" aria-hidden="true" />
                  </div>
                </div>
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

            {/* Card 3 */}
            <Card className="border-emerald-100 shadow-medora-md rounded-2xl hover:shadow-medora-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden">
              <CardHeader className="pb-2 pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-4xl sm:text-5xl font-extrabold text-emerald-700">
                      1M t CO₂e
                    </p>
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mt-1">
                      from waste alone
                    </p>
                  </div>
                  <div className="bg-emerald-50 rounded-full p-3 shrink-0">
                    <Zap className="w-5 h-5 text-emerald-600" aria-hidden="true" />
                  </div>
                </div>
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

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="px-4 py-16 sm:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-4xl font-bold mb-4">
              How Medora works
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-base sm:text-lg">
              Three steps from raw hospital data to an optimised order.
            </p>
          </div>
          <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-8">
            {/* Connector line on desktop */}
            <div
              className="hidden sm:block absolute top-10 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px border-t-2 border-dashed border-emerald-200 z-0"
              aria-hidden="true"
            />

            {[
              {
                num: "1",
                icon: Upload,
                title: "Upload your order history",
                desc: "A simple CSV with 24 months of data. We handle the rest.",
              },
              {
                num: "2",
                icon: Brain,
                title: "AI analyses 8+ factors",
                desc: "History, waste, patient visits, seasonality, lead time, safety stock, stockouts, pathology prevalence.",
              },
              {
                num: "3",
                icon: Target,
                title: "Get the optimal order",
                desc: "Exact quantity + confidence interval + top 3 drivers explained in plain language.",
              },
            ].map(({ num, icon: Icon, title, desc }) => (
              <div key={num} className="relative z-10 flex flex-col items-center text-center gap-4 bg-white rounded-2xl border border-emerald-100 shadow-medora-sm p-6 hover:shadow-medora-md hover:-translate-y-0.5 transition-all duration-200">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-medora-gradient flex items-center justify-center text-white font-bold text-lg shadow-medora-glow">
                    {num}
                  </div>
                  <div className="rounded-xl bg-emerald-50 p-3">
                    <Icon className="w-6 h-6 text-emerald-600" aria-hidden="true" />
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-base mb-1">{title}</p>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center mt-10 text-sm text-muted-foreground">
            Want more detail?{" "}
            <Link href="/guide" className="text-emerald-700 hover:text-emerald-900 hover:underline font-semibold transition-colors">
              Read the user guide →
            </Link>
          </p>
        </div>
      </section>

      {/* ── BUILT FOR HOSPITAL REALITY ── */}
      <section className="px-4 py-16 sm:py-24 bg-medora-soft">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-4xl font-bold mb-4">
              Built for hospital reality
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-base sm:text-lg">
              Healthcare data is sensitive. Medora was designed around that constraint from day one.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Lock,
                title: "Your data stays yours",
                desc: "Medora runs on your infrastructure. Patient data, order history, waste records — none of it ever leaves your hospital. No cloud. No external API calls for predictions.",
              },
              {
                icon: ShieldCheck,
                title: "HDS & RGPD ready",
                desc: "Designed from day one for French HDS hosting and RGPD Article 9 compliance. Ships as a container, runs next to your existing pharmacy software.",
              },
              {
                icon: Eye,
                title: "Explainable, not a black box",
                desc: "Every recommendation comes with its top 3 drivers. Your pharmacist sees exactly why the AI suggests 980 units instead of 1200. No magic — just data.",
              },
              {
                icon: BarChart3,
                title: "Proven before you trust it",
                desc: "Every time you run Medora, see exactly how accurate it would have been on your past 6 months. No blind trust — verify first, then order.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <Card
                key={title}
                className="shadow-medora-sm border-emerald-100 rounded-2xl hover:border-emerald-300 hover:shadow-medora-md transition-all duration-200 group"
              >
                <CardContent className="pt-6 flex flex-col items-start gap-4">
                  <div className="rounded-xl bg-emerald-50 p-3 group-hover:bg-emerald-100 transition-colors">
                    <Icon className="w-6 h-6 text-emerald-600" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-semibold text-base mb-2">{title}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── IMPACT ── */}
      <section className="px-4 py-16 sm:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-4xl font-bold mb-4">
              Four dimensions of impact
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-base sm:text-lg">
              Every optimised order reduces harm across all four axes.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                icon: Zap,
                title: "Energy → CO₂",
                desc: "Less CO₂ from manufacturing medicines that will never be used.",
              },
              {
                icon: Truck,
                title: "Transport → CO₂",
                desc: "Less CO₂ from 10,000 km shipping of APIs from Asia that expire on shelves.",
              },
              {
                icon: Leaf,
                title: "Pollution",
                desc: "Less ecotoxicity — protecting biodiversity, water quality and human health.",
              },
              {
                icon: Euro,
                title: "Cost",
                desc: "Direct euros saved by the hospital — reallocatable to patient care.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex items-center gap-5 rounded-2xl border-l-4 border-emerald-500 bg-gradient-to-r from-emerald-50 to-white px-6 py-5 shadow-medora-sm hover:shadow-medora-md transition-all duration-200"
              >
                <div className="shrink-0 rounded-xl bg-emerald-100 p-3">
                  <Icon className="w-6 h-6 text-emerald-600" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-semibold text-base">{title}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-4 py-16 sm:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="bg-medora-gradient rounded-3xl px-8 py-14 sm:py-20 text-center shadow-medora-lg overflow-hidden relative">
            {/* Subtle background glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(158_70%_55%_/_0.2)_0%,_transparent_70%)]" aria-hidden="true" />
            <h2 className="relative text-2xl sm:text-4xl font-bold text-white mb-4">
              Test Medora live in 30 seconds
            </h2>
            <p className="relative text-emerald-100 mb-10 text-base sm:text-lg max-w-md mx-auto">
              Upload a CSV or use our demo dataset. No account required.
            </p>
            <Link
              href="/demo"
              className={cn(
                buttonVariants({ size: "lg" }),
                "relative bg-white text-emerald-700 hover:bg-emerald-50 font-bold text-base px-12 shadow-medora-lg transition-all duration-200 hover:-translate-y-0.5"
              )}
            >
              Try the demo
              <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-slate-50 border-t border-slate-200 px-4 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size="sm" />
          <p className="text-xs text-slate-500 text-center">
            Built for MIT Hackathon · Sources:{" "}
            <span className="font-medium text-slate-600">Shift Project</span>,{" "}
            <span className="font-medium text-slate-600">Cyclamed</span>,{" "}
            <span className="font-medium text-slate-600">Cour des comptes</span>
          </p>
          <div className="flex gap-4 text-xs text-slate-500">
            <Link href="/guide" className="hover:text-emerald-700 transition-colors">User Guide</Link>
            <Link href="/demo" className="hover:text-emerald-700 transition-colors">Demo</Link>
          </div>
        </div>
      </footer>

    </main>
  );
}
