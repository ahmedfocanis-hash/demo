"use client";

import { useEffect, useRef, useState } from "react";
import {
  Activity,
  Check,
  ChevronDown,
  Landmark,
  Menu,
  ShieldCheck,
} from "lucide-react";
import {
  ACQUIRER_BANKS,
  acquirerBankLabel,
  acquirerBankShortLabel,
  type AcquirerBank,
  type Persona,
} from "./data";

export default function Header({
  persona,
  onPersona,
  onToggleMobileMenu,
  selectedBank,
  onSelectBank,
}: {
  persona: Persona;
  onPersona: (p: Persona) => void;
  onToggleMobileMenu: () => void;
  selectedBank: AcquirerBank;
  onSelectBank: (b: AcquirerBank) => void;
}) {
  const [bankOpen, setBankOpen] = useState(false);
  const bankRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bankOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (
        bankRef.current &&
        !bankRef.current.contains(e.target as Node)
      ) {
        setBankOpen(false);
      }
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setBankOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, [bankOpen]);

  const toggleBank = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (persona !== "acquirer") onPersona("acquirer");
    setBankOpen((o) => !o);
  };

  const pickBank = (b: AcquirerBank) => {
    if (persona !== "acquirer") onPersona("acquirer");
    onSelectBank(b);
    setBankOpen(false);
  };

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
          <div className="flex items-center gap-2 overflow-visible">
            {/* Left/Primary — Acquirer Bank Ops dropdown */}
            <div className="relative shrink-0 z-50" ref={bankRef}>
              <button
                type="button"
                onClick={toggleBank}
                aria-haspopup="listbox"
                aria-expanded={bankOpen}
                className={`inline-flex items-center gap-1.5 rounded-[8px] border px-3 py-1.5 text-xs font-medium tracking-[0.03em] transition-all duration-150 hover:brightness-110 active:scale-[0.98] cursor-pointer ${
                  persona === "acquirer"
                    ? "border-signal-orange/40 bg-[rgba(247,59,32,0.05)] text-signal-orange"
                    : "border-sand-wash bg-paper-white text-ash-grey hover:border-ash-grey/50 hover:text-ink-roast"
                }`}
              >
                <Landmark className="h-3.5 w-3.5 text-signal-orange" />
                <span>Acquirer: {acquirerBankLabel(selectedBank)}</span>
                <ChevronDown
                  className={`h-3 w-3 text-ash-grey transition-transform duration-200 ${
                    bankOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {bankOpen && (
                <div
                  role="listbox"
                  className="absolute left-0 top-full mt-1.5 z-50 shadow-2xl min-w-[240px] rounded-[12px] border border-sand-wash bg-paper-white p-1.5"
                >
                  {ACQUIRER_BANKS.map((b) => {
                    const active = b.id === selectedBank;
                    return (
                      <button
                        key={b.id}
                        role="option"
                        aria-selected={active}
                        onClick={() => pickBank(b.id)}
                        className={`flex w-full items-center justify-between rounded-[8px] px-2.5 py-2 text-xs transition ${
                          active
                            ? "bg-[rgba(247,59,32,0.05)] text-signal-orange"
                            : "text-ash-grey hover:bg-sand-wash/40 hover:text-ink-roast"
                        }`}
                      >
                        <span>{b.name}</span>
                        {active && <Check className="h-3 w-3" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right/Secondary — Merchant HQ toggle pill */}
            <button
              onClick={() =>
                onPersona(persona === "merchant" ? "acquirer" : "merchant")
              }
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-[8px] border px-3 py-1.5 text-xs font-medium tracking-[0.03em] transition-all duration-150 hover:brightness-110 active:scale-[0.98] cursor-pointer ${
                persona === "merchant"
                  ? "border-signal-orange/40 bg-[rgba(247,59,32,0.05)] text-signal-orange"
                  : "border-sand-wash bg-paper-white text-ash-grey hover:border-ash-grey/50 hover:text-ink-roast"
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Merchant HQ</span>
            </button>
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
            {persona === "merchant"
              ? "Merchant HQ"
              : `Acquirer Bank Ops · ${acquirerBankShortLabel(selectedBank)}`}
          </div>
        </div>
      </div>
    </header>
  );
}