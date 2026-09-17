"use client";

import { Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { txRows, stuckRows, terminals } from "../dashboard/data";
import { tabs, type TabId } from "../dashboard/Sidebar";

type Result = {
  id: string;
  group: string;
  label: string;
  detail?: string;
  tab?: TabId;
};

const ruleResults: Result[] = [
  { id: "R-001", group: "Rules", label: "High-Value POS → Switch B", tab: "rules" },
  { id: "R-004", group: "Rules", label: "SoftPOS Mid-Ticket → Switch A", tab: "rules" },
  { id: "R-009", group: "Rules", label: "QR Low-Value → Fast Lane", tab: "rules" },
];

export default function CommandPalette({
  onNavigate,
}: {
  onNavigate: (tab: TabId) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const results = useMemo<Result[]>(() => {
    const q = query.trim().toLowerCase();
    const nav: Result[] = tabs.map((t) => ({
      id: `nav-${t.id}`,
      group: "Navigation",
      label: t.label,
      detail: t.desc,
      tab: t.id,
    }));
    const tx: Result[] = txRows.map((r) => ({
      id: `tx-${r.id}`,
      group: "Transactions",
      label: `${r.corrId} · ${r.merchant}`,
      detail: `${r.amount} ${r.currency} · ${r.response}`,
      tab: "transactions",
    }));
    const stuck: Result[] = stuckRows.map((r) => ({
      id: `stuck-${r.id}`,
      group: "Unresolved Queue",
      label: `${r.id} · ${r.merchant}`,
      detail: r.status,
      tab: "queue",
    }));
    const terms: Result[] = terminals.map((t) => ({
      id: `term-${t.tid}`,
      group: "Terminals",
      label: t.tid,
      detail: "Terminal fleet",
      tab: "terminals",
    }));
    const all = [...nav, ...tx, ...stuck, ...terms, ...ruleResults];
    if (!q) return all.slice(0, 12);
    return all
      .filter(
        (r) =>
          r.label.toLowerCase().includes(q) ||
          (r.detail ?? "").toLowerCase().includes(q)
      )
      .slice(0, 12);
  }, [query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center p-4 pt-[12vh]">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm "
        onClick={() => setOpen(false)}
      />
      <div className="animate-modal-pop relative w-full max-w-lg overflow-hidden rounded-2xl border-slate-800 bg-slate-950 shadow-2xl ">
        <div className="flex items-center gap-2.5 border-slate-800 px-4 py-3 ">
          <Search className="h-4 w-4 text-slate-500 " />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search transactions, terminals, rules, tabs…"
            className="flex-1 bg-transparent text-slate-100 outline-none placeholder:text-slate-500 "
          />
          <button
            onClick={() => setOpen(false)}
            aria-label="Close search"
            className="rounded-md p-1 text-slate-500 transition hover:bg-slate-800 hover:text-slate-200 cursor-pointer "
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-80 overflow-y-auto py-2">
          {results.length === 0 ? (
            <p className="px-4 py-6 text-slate-500 ">
              No results for “{query}”.
            </p>
          ) : (
            results.map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  if (r.tab) onNavigate(r.tab);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left transition-all duration-150 hover:bg-slate-900 active:scale-[0.99] cursor-pointer "
              >
                <span>
                  <span className="block text-sm font-medium text-slate-200 ">
                    {r.label}
                  </span>
                  {r.detail && (
                    <span className="block text-slate-500 ">
                      {r.detail}
                    </span>
                  )}
                </span>
                <span className="shrink-0 rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-400 ">
                  {r.group}
                </span>
              </button>
            ))
          )}
        </div>
        <div className="border-slate-800 px-4 py-2 text-slate-600 ">
          Ctrl/⌘ + K to toggle · Esc to close
        </div>
      </div>
    </div>
  );
}
