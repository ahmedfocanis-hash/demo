"use client";

import type { ReactNode } from "react";
import { Activity, Landmark, Layers, Menu, ShieldCheck } from "lucide-react";
import type { Persona } from "./data";

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
    <header className="sticky top-0 z-50 border-b border-sand-wash bg-paper-white/80 backdrop-blur-[20px]">
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            aria-label="Open navigation"
            className="rounded-[8px] border border-sand-wash p-2 text-ash-grey transition-all duration-150 hover:bg-sand-wash/40 hover:text-ink-roast active:scale-[0.98] cursor-pointer md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[rgba(247,59,32,0.05)] ring-1 ring-inset ring-signal-orange/20">
            <Activity className="h-5 w-5 text-signal-orange" />
          </div>
          <div>
            <h1 className="text-[17px] font-medium leading-tight tracking-[-0.01em] text-ink-roast">
              BeyondPayments <span className="text-signal-orange">Gateway</span>
            </h1>
            <p className="text-[11px] font-medium uppercase tracking-[0.03em] text-ash-grey">
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
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-[8px] border px-3 py-1.5 text-xs font-medium tracking-[0.03em] transition-all duration-150 hover:brightness-110 active:scale-[0.98] cursor-pointer ${
                    active
                      ? "border-signal-orange/40 bg-[rgba(247,59,32,0.05)] text-signal-orange"
                      : "border-sand-wash bg-paper-white text-ash-grey hover:border-ash-grey/50 hover:text-ink-roast"
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
            className="hidden items-center gap-2 rounded-[8px] border border-sand-wash bg-paper-white px-3 py-1.5 text-xs text-ash-grey transition-all duration-150 hover:border-ash-grey/50 hover:text-ink-roast active:scale-[0.98] cursor-pointer lg:inline-flex"
          >
            Search…
            <kbd className="rounded-[4px] bg-sand-wash/60 px-1.5 py-0.5 font-mono text-[10px] font-medium text-ink-roast">
              Ctrl K
            </kbd>
          </button>
          <div className="hidden items-center gap-2 rounded-full bg-sand-wash/50 px-3 py-1.5 lg:flex">
            <span className="pulse-dot h-2 w-2 rounded-full bg-signal-orange" />
            <span className="text-[11px] font-medium tracking-[0.03em] text-ink-roast">
              All Systems Operational
            </span>
            <span className="text-[11px] text-ash-grey">
              Core Switch Latency: 142ms
            </span>
          </div>
          <div className="hidden rounded-full bg-sand-wash/50 px-3 py-1.5 text-[11px] font-medium tracking-[0.03em] text-ink-roast lg:block">
            {meta.label}
          </div>
        </div>
      </div>
    </header>
  );
}