"use client";

import type { LucideIcon } from "lucide-react";
import {
  Activity,
  AlertTriangle,
  Boxes,
  Cog,
  FileText,
  Shield,
  Settings,
  Smartphone,
  Terminal,
  X,
} from "lucide-react";

import type { Persona } from "./data";

export type TabId =
  | "transactions"
  | "queue"
  | "onboarding"
  | "rules"
  | "terminals"
  | "settlement"
  | "vas"
  | "audit";

export const tabs: {
  id: TabId;
  label: string;
  icon: LucideIcon;
  desc: string;
}[] = [
  {
    id: "transactions",
    label: "Live Transactions",
    icon: Activity,
    desc: "Hop-by-hop trace",
  },
  {
    id: "queue",
    label: "Unresolved Queue",
    icon: AlertTriangle,
    desc: "Stuck items",
  },
  {
    id: "onboarding",
    label: "Onboarding",
    icon: Boxes,
    desc: "Propagation",
  },
  {
    id: "rules",
    label: "Routing Rules",
    icon: Cog,
    desc: "Configurator",
  },
  {
    id: "terminals",
    label: "Terminal Fleet",
    icon: Terminal,
    desc: "Drift mgmt",
  },
  {
    id: "settlement",
    label: "Settlement",
    icon: FileText,
    desc: "EOD delivery",
  },
  {
    id: "vas",
    label: "VAS Services",
    icon: Smartphone,
    desc: "Value-added",
  },
  {
    id: "audit",
    label: "Audit Log",
    icon: Shield,
    desc: "Immutable trail",
  },
];

export const personaTabs: Record<Persona, TabId[]> = {
  acquirer: [
    "transactions",
    "queue",
    "onboarding",
    "rules",
    "terminals",
    "settlement",
    "vas",
    "audit",
  ],
  psp: ["transactions", "onboarding", "terminals", "settlement"],
  merchant: ["transactions", "terminals", "settlement", "vas"],
};

export default function Sidebar({
  active,
  onSelect,
  persona,
  mobileOpen = false,
  onCloseMobile,
}: {
  active: TabId;
  onSelect: (t: TabId) => void;
  persona: Persona;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}) {
  return (
    <>
      <aside className="hidden md:flex md:w-72 md:flex-col md:shrink-0 border-r border-sand-wash bg-paper-white">
        <NavContent active={active} onSelect={onSelect} persona={persona} />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-ink-roast/40 backdrop-blur-sm"
            onClick={onCloseMobile}
            aria-hidden
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col border-r border-sand-wash bg-paper-white">
            <button
              onClick={onCloseMobile}
              aria-label="Close menu"
              className="absolute right-3 top-3 z-10 rounded-[8px] border border-sand-wash p-2 text-ash-grey hover:text-ink-roast"
            >
              <X className="h-5 w-5" />
            </button>
            <NavContent
              active={active}
              onSelect={(t) => {
                onSelect(t);
                onCloseMobile?.();
              }}
              persona={persona}
            />
          </aside>
        </div>
      )}
    </>
  );
}

function NavContent({
  active,
  onSelect,
  persona,
}: {
  active: TabId;
  onSelect: (t: TabId) => void;
  persona: Persona;
}) {
  const visibleTabs = tabs.filter((t) => personaTabs[persona].includes(t.id));

  return (
    <>
      <div className="flex-1 overflow-y-auto py-6">
        <p className="px-6 pb-3 text-[11px] font-medium uppercase tracking-[0.03em] text-ash-grey">
          Console
        </p>
        <nav className="space-y-1 px-3">
          {visibleTabs.map((t) => {
            const Icon = t.icon;
            const isActive = t.id === active;
            return (
              <button
                key={t.id}
                onClick={() => onSelect(t.id)}
                className={`relative flex w-full items-center gap-3 rounded-[12px] px-3 py-3 text-left transition-all duration-150 active:scale-[0.98] cursor-pointer ${
                  isActive
                    ? "bg-[rgba(247,59,32,0.05)] text-signal-orange"
                    : "text-ink-roast/70 hover:bg-sand-wash/50 hover:text-ink-roast"
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-6 -translate-y-1/2 w-[3px] rounded-full bg-signal-orange" />
                )}
                <Icon
                  className={`h-4.5 w-4.5 shrink-0 ${isActive ? "text-signal-orange" : "text-ash-grey"}`}
                />
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-medium tracking-[-0.005em]">
                    {t.label}
                  </span>
                  <span className="block text-xs text-ash-grey">{t.desc}</span>
                </span>
              </button>
            );
          })}
        </nav>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 rounded-[12px] bg-sand-wash/50 px-3 py-2.5">
          <Settings className="h-4 w-4 text-ash-grey" />
          <div className="text-xs">
            <p className="font-medium text-ink-roast">Ops Console</p>
            <p className="text-ash-grey tracking-[0.03em]">CFG-v2026.09.1</p>
          </div>
        </div>
      </div>
    </>
  );
}