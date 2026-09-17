"use client";

import type { ReactNode } from "react";
import { Activity, Landmark, Layers, Menu, ShieldCheck } from "lucide-react";
import type { Persona } from "./data";
import ThemeToggle from "../ui/ThemeToggle";

const personaMeta: Record<
  Persona,
  { label: string; short: string; sub: string; icon: ReactNode }
> = {
  acquirer: {
    label: "Acquirer Bank Ops",
    short: "Acquirer Bank Ops",
    sub: "Full estate & commercial tooling · 8 member banks · 1,120 live terminals",
    icon: <Landmark className="h-3.5 w-3.5" />,
  },
  psp: {
    label: "Institution / PSP",
    short: "Institution / PSP",
    sub: "Portfolio view & merchant onboarding · 6 PSP partners",
    icon: <Layers className="h-3.5 w-3.5" />,
  },
  merchant: {
    label: "Merchant HQ",
    short: "Merchant HQ",
    sub: "Outlet transactions & settlement downloads",
    icon: <ShieldCheck className="h-3.5 w-3.5" />,
  },
};

export default function Header({
  persona,
  onPersona,
  onToggleMobileMenu,
}: {
  persona: Persona;
  onPersona: (p: Persona) => void;
  onToggleMobileMenu: () => void;
}) {
  const meta = personaMeta[persona];
  return (
    <header className="sticky top-0 z-50 border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80 ">
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3.5">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            aria-label="Open navigation"
            className="rounded-lg border-slate-300 bg-white p-1.5 text-slate-600 transition-all duration-150 hover:border-slate-400 hover:text-slate-900 hover:brightness-110 active:scale-[0.98] cursor-pointer dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:text-slate-100 md:hidden "
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 ring-emerald-500/30 ">
            <Activity className="h-5 w-5 text-emerald-400 " />
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100 ">
              BeyondPayments <span className="text-emerald-400 dark:text-emerald-400 ">Gateway</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 ">
              Orchestration Layer · Core Switch · VAS
            </p>
          </div>
        </div>

        <div className="w-full min-w-0 sm:w-auto sm:shrink-0">
          <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {(["acquirer", "psp", "merchant"] as Persona[]).map((p) => {
              const m = personaMeta[p];
              const active = p === persona;
              return (
                <button
                  key={p}
                  onClick={() => onPersona(p)}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-150 hover:brightness-110 active:scale-[0.98] cursor-pointer ${
                    active
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                      : "border-slate-300 bg-white text-slate-500 hover:border-slate-400 hover:text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-slate-200"
                  }`}
                >
                  {m.icon}
                  <span>{m.short}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto">
          <button
            onClick={() =>
              window.dispatchEvent(
                new KeyboardEvent("keydown", { key: "k", ctrlKey: true })
              )
            }
            className="hidden items-center gap-2 rounded-lg border-slate-300 bg-white px-3 py-1.5 text-slate-500 transition-all duration-150 hover:border-slate-400 hover:text-slate-700 hover:brightness-110 active:scale-[0.98] cursor-pointer dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-slate-200 lg:inline-flex "
          >
            Search…
            <kbd className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-500 dark:bg-slate-800 dark:text-slate-400 ">
              Ctrl K
            </kbd>
          </button>
          <div className="hidden items-center gap-2 rounded-full border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 lg:flex ">
            <span className="pulse-dot h-2 w-2 rounded-full bg-emerald-400 " />
            <span className="text-[11px] font-medium text-emerald-300 ">
              All Systems Operational
            </span>
            <span className="text-emerald-500/70">
              Core Switch Latency: 142ms
            </span>
          </div>
          <div className="hidden rounded-full border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-600 lg:block dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 ">
            {meta.label}
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}