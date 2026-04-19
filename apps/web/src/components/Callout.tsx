"use client";

import { cn } from "@/lib/utils";
import { Lock, Info, AlertTriangle, CheckCircle } from "lucide-react";

type Variant = "info" | "success" | "warning" | "privacy";

interface CalloutProps {
  variant?: Variant;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const VARIANTS: Record<Variant, { wrapper: string; icon: React.ElementType; iconClass: string }> = {
  info: {
    wrapper: "bg-blue-50 border-blue-200 text-blue-900",
    icon: Info,
    iconClass: "text-blue-500",
  },
  success: {
    wrapper: "bg-emerald-50 border-emerald-200 text-emerald-900",
    icon: CheckCircle,
    iconClass: "text-emerald-600",
  },
  warning: {
    wrapper: "bg-amber-50 border-amber-200 text-amber-900",
    icon: AlertTriangle,
    iconClass: "text-amber-600",
  },
  privacy: {
    wrapper: "bg-slate-50 border-slate-300 text-slate-800",
    icon: Lock,
    iconClass: "text-slate-600",
  },
};

export function Callout({ variant = "info", title, children, className }: CalloutProps) {
  const { wrapper, icon: Icon, iconClass } = VARIANTS[variant];
  return (
    <div className={cn("flex gap-3 rounded-lg border p-4", wrapper, className)}>
      <Icon className={cn("w-5 h-5 mt-0.5 shrink-0", iconClass)} aria-hidden="true" />
      <div className="text-sm leading-relaxed">
        {title && <p className="font-semibold mb-1">{title}</p>}
        <div>{children}</div>
      </div>
    </div>
  );
}
