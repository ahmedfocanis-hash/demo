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
      <aside className="hidden md:flex md:w-72 md:flex-col md:shrink-0 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <NavContent active={active} onSelect={onSelect} persona={persona} />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={onCloseMobile}
            aria-hidden
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
            <button
              onClick={onCloseMobile}
              aria-label="Close menu"
              className="absolute right-3 top-3 z-10 rounded-lg border-slate-300 bg-white p-1.5 text-slate-600 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
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
      <div className="flex-1 overflow-y-auto py-4">
        <p className="px-4 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-600 ">
          Console
        </p>
        <nav className="space-y-1 px-2">
          {visibleTabs.map((t) => {
            const Icon = t.icon;
            const isActive = t.id === active;
            return (
              <button
                key={t.id}
                onClick={() => onSelect(t.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all duration-150 hover:brightness-110 active:scale-[0.98] cursor-pointer ${
                  isActive
                    ? "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-300"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200"
                }`}
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />
                <span className="flex-1">
                  <span className="block text-sm font-medium ">{t.label}</span>
                  <span className="block text-slate-500 ">{t.desc}</span>
                </span>
              </button>
            );
          })}
        </nav>
      </div>
      <div className="border-slate-200 p-4 dark:border-slate-800 ">
        <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 dark:bg-slate-900 ">
          <Settings className="h-4 w-4 text-slate-500 dark:text-slate-500 " />
          <div className="text-xs">
            <p className="font-medium text-slate-700 dark:text-slate-300 ">Ops Console</p>
            <p className="text-slate-500 dark:text-slate-500 ">CFG-v2026.09.1</p>
          </div>
        </div>
      </div>
    </>
  );
}