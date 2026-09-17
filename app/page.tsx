"use client";

import { useState } from "react";
import Header from "@/components/dashboard/Header";
import Sidebar, { type TabId, personaTabs } from "@/components/dashboard/Sidebar";
import Transactions from "@/components/dashboard/Transactions";
import UnresolvedQueue from "@/components/dashboard/UnresolvedQueue";
import OnboardingTab from "@/components/dashboard/OnboardingTab";
import RulesTab from "@/components/dashboard/RulesTab";
import TerminalsTab from "@/components/dashboard/TerminalsTab";
import SettlementTab from "@/components/dashboard/SettlementTab";
import VasTab from "@/components/dashboard/VasTab";
import AuditLogTab from "@/components/dashboard/AuditLogTab";
import type { Persona } from "@/components/dashboard/data";
import CommandPalette from "@/components/ui/CommandPalette";
import CookieBanner from "@/components/ui/CookieBanner";
import SupportPanel from "@/components/ui/SupportPanel";
import ScrollProgress from "@/components/ui/ScrollProgress";
import ScrollTopButton from "@/components/ui/ScrollTopButton";

export default function Home() {
  const [active, setActive] = useState<TabId>("transactions");
  const [persona, setPersona] = useState<Persona>("acquirer");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fallback guard: if the active tab isn't permitted for the current
  // persona (e.g. after switching personas), fall back to the first
  // permitted tab instead of rendering a disallowed view.
  const effectiveTab: TabId = personaTabs[persona].includes(active)
    ? active
    : personaTabs[persona][0];

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-100 font-sans text-slate-900 dark:bg-slate-950 dark:text-slate-200">
      <Header
        persona={persona}
        onPersona={setPersona}
        onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
      />
      <div className="flex w-full flex-1 overflow-hidden">
        <Sidebar
          active={effectiveTab}
          onSelect={setActive}
          persona={persona}
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />
        <main className="w-full min-w-0 flex-1 overflow-y-auto space-y-6 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          {effectiveTab === "transactions" && (
            <Transactions persona={persona} />
          )}
          {effectiveTab === "queue" && <UnresolvedQueue />}
          {effectiveTab === "onboarding" && <OnboardingTab />}
          {effectiveTab === "rules" && <RulesTab />}
          {effectiveTab === "terminals" && <TerminalsTab />}
          {effectiveTab === "settlement" && <SettlementTab />}
          {effectiveTab === "vas" && <VasTab />}
          {effectiveTab === "audit" && <AuditLogTab />}
        </main>
      </div>

      <ScrollProgress />
      <CommandPalette onNavigate={setActive} />
      <CookieBanner />
      <SupportPanel />
      <ScrollTopButton />
    </div>
  );
}
