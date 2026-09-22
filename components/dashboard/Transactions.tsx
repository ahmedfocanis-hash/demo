"use client";

import { useEffect, useRef, useState } from "react";
import {
  Banknote,
  Braces,
  CalendarRange,
  CircleDot,
  CreditCard,
  Download,
  Loader2,
  Radio,
  Shield,
  X,
} from "lucide-react";
import { hops, txRows, filterByBank, type AcquirerBank, type Persona, type TxRow } from "./data";
import { Badge, Drawer, FieldLabel, Modal, PanelTitle, inputCls, selectCls } from "./ui";

/* ----------------------------- Metric cards ------------------------------- */

const metricDefs = [
  {
    label: "Today's Volume",
    suffix: "IQD",
    icon: Banknote,
    tone: "text-emerald-green",
    bg: "bg-emerald-green/10 ring-emerald-green/20 ",
  },
  {
    label: "Total Tx Count",
    suffix: "tx",
    icon: CircleDot,
    tone: "text-cobalt-blue",
    bg: "bg-cobalt-blue/10 ring-cobalt-blue/20 ",
  },
  {
    label: "Approval Rate",
    suffix: "%",
    icon: Radio,
    tone: "text-signal-orange",
    bg: "bg-signal-orange/10 ring-signal-orange/20 ",
  },
  {
    label: "Active Terminals",
    suffix: "dev",
    icon: CreditCard,
    tone: "text-brand-orange-tint",
    bg: "bg-brand-orange-tint/10 ring-brand-orange-tint/20 ",
  },
] as const;

const personaBanner: Record<Persona, string> = {
  acquirer: "Acquirer Estate View · National Bank Operations",
  merchant:
    "Merchant HQ Portal · Baghdad Central Supermarket (MID-772901-IRQ)",
};

const channelTone: Record<TxRow["channel"], "green" | "cyan" | "violet"> = {
  POS: "green",
  SoftPOS: "cyan",
  QR: "violet",
};

/* ------------------------- Hop latency waterfall -------------------------- */

function Waterfall() {
  const max = Math.max(...hops.map((h) => h.latency));
  return (
    <div className="space-y-3">
      {hops.map((h, i) => (
        <div key={h.name} className="flex items-center gap-3">
          <div className="w-40 shrink-0">
            <p className="text-xs font-medium text-ink-roast ">{h.label}</p>
            <p className="text-ash-grey ">{h.detail}</p>
          </div>
          <div className="relative h-6 flex-1 overflow-hidden rounded-md bg-white ring-slate-200 ">
            <div
              className="flex h-full items-center rounded-md bg-gradient-to-r from-emerald-green/20 to-emerald-green/40 pl-2 "
              style={{ width: `${Math.max((h.latency / max) * 100, 8)}%` }}
            >
              <span className="text-[10px] font-medium text-emerald-300 ">
                {h.latency}ms
              </span>
            </div>
          </div>
          <div className="w-24 shrink-0 text-right ">
            <span className="font-mono text-xs font-semibold text-ink-roast ">
              +{h.latency}ms
            </span>
            <span className="block text-ash-grey ">
              hop {i + 1}
            </span>
          </div>
        </div>
      ))}
      <div className="mt-2 flex items-center gap-2 rounded-lg border-sand-wash bg-white px-3 py-2 ">
        <span className="text-xs font-medium text-ink-roast ">
          Total End-to-End Latency
        </span>
        <span className="ml-auto font-mono text-sm font-semibold text-emerald-green ">
          276ms
        </span>
      </div>
    </div>
  );
}

/* ------------------------- Payload inspection ----------------------------- */

function PayloadInspection({ tx }: { tx: TxRow }) {
  const [view, setView] = useState<"json" | "iso">("json");
  return (
    <div>
      <div className="mb-3 flex gap-2">
        <button
          onClick={() => setView("json")}
          className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
            view === "json"
              ? "border-emerald-green/40 bg-emerald-green/10 text-emerald-300"
              : "border-sand-wash bg-white text-ash-grey hover:text-ink-roast"
          }`}
        >
          <Braces className="h-3.5 w-3.5" /> Canonical JSON
        </button>
        <button
          onClick={() => setView("iso")}
          className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
            view === "iso"
              ? "border-emerald-green/40 bg-emerald-green/10 text-emerald-300"
              : "border-sand-wash bg-white text-ash-grey hover:text-ink-roast"
          }`}
        >
          <Radio className="h-3.5 w-3.5" /> Raw ISO 8583 Bitmaps
        </button>
      </div>

      {view === "json" ? (
        <pre className="bg-[#360802] text-[#fbf7f4] font-mono text-xs p-4 rounded-[12px] border border-sand-wash/20 shadow-inner overflow-x-auto">
{`{
  "correlationId": "${tx.corrId}",
  "channel": "${tx.channel}",
  "merchant": "${tx.merchant}",
  "maskedPan": "${tx.pan}",
  "amount": ${tx.amount.replace(/,/g, "")},
  "currency": "${tx.currency}",
  "txType": "${tx.type}",
  "response": "${tx.response}",
  "origin": { "tid": "TID-10488", "mid": "MID-772901-IRQ" },
  "trace": {
    "ingress": 0,
    "protocolGateway": 8,
    "orchestration": 14,
    "vas": 85,
    "hostSwitch": 165,
    "egress": 4
  }
}`}
        </pre>
      ) : (
        <div className="bg-[#360802] text-[#fbf7f4] font-mono text-xs p-4 rounded-[12px] border border-sand-wash/20 shadow-inner overflow-x-auto">
          <div className="mb-2 flex-wrap gap-4 border-sand-wash pb-2 ">
            <span className="text-ash-grey ">MTI 0200</span>
            <span className="text-ash-grey ">Bitmap 78D840A010E28C10</span>
            <span className="text-ash-grey ">Len 092</span>
          </div>
          <div className="grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2">
            <Field n="2" d={`PAN ${tx.pan}`} />
            <Field n="3" d="00 SALE" />
            <Field n="4" d={`Amount ${tx.amount} ${tx.currency}`} />
            <Field n="11" d="STAN 062911" />
            <Field n="22" d="POI Entry 022 (MagStripe)" />
            <Field n="37" d="RRN 819204773" />
            <Field n="39" d={`Response ${tx.response}`} />
            <Field n="41" d="TID-10488" />
            <Field n="42" d="MID-772901-IRQ" />
            <Field n="49" d={`Currency ${tx.currency}`} />
            <Field n="55" d="EMV 9F26..9F10..DF21" />
            <Field n="90" d="6A (Pre-Auth)" />
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ n, d }: { n: string; d: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-emerald-green/80">F{n}</span>
      <span className="truncate text-ink-roast ">{d}</span>
    </div>
  );
}

/* ---------------------------- Main component ------------------------------ */

export default function Transactions({ persona, bank }: { persona: Persona; bank: AcquirerBank }) {
  const [selected, setSelected] = useState<TxRow | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [exportToast, setExportToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!exportToast) return;
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setExportToast(null), 4000);
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, [exportToast]);

  const rows = filterByBank(txRows, bank);
  const volumeIqd = rows.reduce(
    (sum, tx) => sum + Number(tx.amount.replace(/,/g, "")),
    0
  );
  const approvalRate = rows.length
    ? Math.round(
        (rows.filter((tx) => tx.response === "00 Approved").length / rows.length) *
          1000
      ) / 10
    : 0;
  const activeTerminals = new Set(
    rows.map((tx) => (tx.pan ? tx.pan : tx.corrId))
  ).size;
  const values: [string, string, string, string] = [
    volumeIqd.toLocaleString("en-US"),
    rows.length.toLocaleString("en-US"),
    approvalRate.toFixed(1),
    activeTerminals.toLocaleString("en-US"),
  ];
  const metricCards = metricDefs.map((m, i) => ({ ...m, value: values[i] }));

  return (
    <div className="space-y-5">
      {/* Role banner */}
      <div className="flex items-center gap-3 rounded-2xl border-emerald-green/20 bg-emerald-green/5 px-4 py-3 ">
        <Shield className="h-4 w-4 shrink-0 text-emerald-green " />
        <p className="text-xs font-medium text-emerald-300 ">
          {personaBanner[persona]}
        </p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.label}
              className={`rounded-2xl border-sand-wash bg-white p-5 ${m.bg}`}
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-ash-grey ">{m.label}</p>
                <Icon className={`h-4 w-4 ${m.tone}`} />
              </div>
              <p className="mt-3 flex items-baseline gap-1.5">
                <span className={`text-[33px] font-medium tracking-tight text-ink-roast leading-none ${m.tone}`}>
                  {m.value}
                </span>
                <span className="text-ash-grey ">{m.suffix}</span>
              </p>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-sand-wash bg-white shadow-xs">
        <PanelTitle
          title="Live Transaction Stream"
          subtitle="Real-time hop-by-hop tracing across the orchestration estate"
          right={
            <div className="flex items-center gap-2">
              <Badge tone="green" dot pulse>
                Streaming
              </Badge>
              <Badge tone="slate">14,290 today</Badge>
              <button
                onClick={() => setExportOpen(true)}
                className="rounded-[12px] border border-sand-wash px-3 py-1.5 text-xs font-medium text-ink-roast hover:bg-sand-wash/40 transition-colors flex items-center"
              >
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Bulk Export
              </button>
            </div>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm ">
            <thead>
              <tr className="border-b border-sand-wash bg-paper-white ">
                <th className="text-[11px] font-semibold uppercase tracking-wider text-ash-grey border-b border-sand-wash py-3 px-4">Timestamp</th>
                <th className="text-[11px] font-semibold uppercase tracking-wider text-ash-grey border-b border-sand-wash py-3 px-4">Correlation ID</th>
                <th className="text-[11px] font-semibold uppercase tracking-wider text-ash-grey border-b border-sand-wash py-3 px-4">Channel</th>
                <th className="text-[11px] font-semibold uppercase tracking-wider text-ash-grey border-b border-sand-wash py-3 px-4">Merchant</th>
                <th className="text-[11px] font-semibold uppercase tracking-wider text-ash-grey border-b border-sand-wash py-3 px-4">Masked PAN</th>
                <th className="text-[11px] font-semibold uppercase tracking-wider text-ash-grey border-b border-sand-wash py-3 px-4">Amount</th>
                <th className="text-[11px] font-semibold uppercase tracking-wider text-ash-grey border-b border-sand-wash py-3 px-4">Type</th>
                <th className="text-[11px] font-semibold uppercase tracking-wider text-ash-grey border-b border-sand-wash py-3 px-4">Response</th>
                <th className="text-[11px] font-semibold uppercase tracking-wider text-ash-grey border-b border-sand-wash py-3 px-4 text-right ">Trace</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((tx) => (
                <tr
                  key={tx.id}
                  className="border-b border-sand-wash transition hover:bg-paper-white/80:bg-slate-800/40 "
                >
                  <td className="px-4 py-3 font-mono text-ash-grey ">
                    {tx.time}
                  </td>
                  <td className="px-4 py-3 font-mono text-ink-roast ">
                    {tx.corrId}
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={channelTone[tx.channel]}>{tx.channel}</Badge>
                  </td>
                  <td className="px-4 py-3 font-medium text-ink-roast ">
                    {tx.merchant}
                  </td>
                  <td className="px-4 py-3 font-mono text-ash-grey ">
                    {tx.pan}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs font-medium text-ink-roast ">
                    {tx.amount}
                    <span className="ml-1 text-ash-grey ">
                      {tx.currency}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium text-ink-roast ">
                      {tx.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={tx.tone}>{tx.response}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right ">
                    <button
                      onClick={() => setSelected(tx)}
                      className="inline-flex items-center gap-1 rounded-lg border-emerald-green/30 bg-emerald-green/10 px-2.5 py-1.5 text-xs font-medium text-emerald-300 transition hover:bg-emerald-green/20 "
                    >
                      <Radio className="h-3.5 w-3.5" />
                      View Trace
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail drawer */}
      <Drawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title={
          <div className="flex items-center gap-3">
            <span>Transaction Detail</span>
            {selected && (
              <span className="font-mono text-emerald-green ">
                {selected.corrId}
              </span>
            )}
          </div>
        }
        width="w-full sm:w-[520px] md:w-[640px]"
      >
        {selected && (
          <div className="space-y-6 p-4 sm:p-6">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              <Meta label="Merchant" value={selected.merchant} />
              <Meta label="Masked PAN" value={selected.pan} mono />
              <Meta
                label="Amount"
                value={`${selected.amount} ${selected.currency}`}
                mono
              />
              <Meta label="Channel" value={selected.channel} />
              <Meta label="Type" value={selected.type} />
              <Meta label="Response" value={selected.response} />
            </div>

            <section>
              <SectionHeading title="Hop-by-Hop Latency Waterfall" />
              <Waterfall />
            </section>

            <section>
              <SectionHeading title="Payload Inspection" />
              <PayloadInspection tx={selected} />
            </section>
          </div>
        )}
      </Drawer>

      <BulkExportModal
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        onQueued={(jobId) =>
          setExportToast(
            `✓ Export Job #${jobId} queued: 14,290 records compiled as CSV. (Demo mode: generation simulated)`
          )
        }
      />

      {exportToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed right-4 top-4 z-[70] flex max-w-md items-start gap-3 rounded-[12px] border border-signal-orange/25 bg-paper-white px-4 py-3 shadow-[var(--shadow-floating)] animate-modal-pop"
        >
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-green/15 text-emerald-300">
            <span className="text-[11px] font-semibold">✓</span>
          </span>
          <p className="flex-1 text-xs font-medium leading-relaxed text-ink-roast">
            {exportToast}
          </p>
          <button
            onClick={() => setExportToast(null)}
            aria-label="Dismiss export notification"
            className="shrink-0 rounded-md p-1 text-ash-grey transition hover:bg-sand-wash/60 hover:text-ink-roast"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

/* ------------------------- Bulk export (simulated) ------------------------ */

type ExportFormat = "CSV Spreadsheet" | "JSON Ledger" | "ISO 8583 Binary Trace (.dat)";

const datePresetDefs = [
  { label: "Today", from: "2026-09-22", to: "2026-09-22" },
  { label: "Last 7 Days", from: "2026-09-16", to: "2026-09-22" },
  { label: "Month to Date", from: "2026-09-01", to: "2026-09-22" },
] as const;

function BulkExportModal({
  open,
  onClose,
  onQueued,
}: {
  open: boolean;
  onClose: () => void;
  onQueued: (jobId: string) => void;
}) {
  const [from, setFrom] = useState("2026-09-01");
  const [to, setTo] = useState("2026-09-22");
  const [channel, setChannel] = useState("All Channels");
  const [status, setStatus] = useState("All Statuses");
  const [format, setFormat] = useState<ExportFormat>("CSV Spreadsheet");
  const [compiling, setCompiling] = useState(false);

  const generate = () => {
    if (compiling) return;
    setCompiling(true);
    setTimeout(() => {
      setCompiling(false);
      onClose();
      onQueued(`EXP-2026-09`);
    }, 1200);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Export Transaction Ledger"
      subtitle="Configure temporal window, channel constraints, and target format for bulk reporting."
      maxWidth="max-w-xl"
      footer={
        <div className="flex items-center justify-between gap-3">
          <p className="hidden text-[11px] leading-relaxed text-ash-grey sm:block">
            No payloads leave this sandbox — export jobs are simulated for demo purposes.
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              disabled={compiling}
              className="rounded-[12px] border border-sand-wash px-4 py-2 text-sm font-medium text-ink-roast transition-colors hover:bg-sand-wash/40 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={generate}
              disabled={compiling}
              className="inline-flex items-center gap-2 rounded-[12px] bg-signal-orange px-4 py-2 text-sm font-medium text-white transition-all hover:bg-brand-orange-tint active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {compiling ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Compiling Ledger Archive...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Generate Export
                </>
              )}
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Estimated volume banner */}
        <div className="flex items-start gap-3 rounded-[12px] border border-signal-orange/20 bg-signal-orange/5 px-4 py-3">
          <CalendarRange className="mt-0.5 h-4 w-4 shrink-0 text-signal-orange" />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-ink-roast">
              Estimated Volume: ~14,290 transactions (~1.84B IQD)
            </p>
            <p className="mt-0.5 text-[11px] leading-relaxed text-ash-grey">
              Window {from} → {to} · {channel} · {status} · {format}
            </p>
          </div>
        </div>

        {/* Date range */}
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-[11px] font-medium uppercase tracking-[0.03em] text-ash-grey">
              Quick Range
            </span>
            {datePresetDefs.map((preset) => {
              const active = from === preset.from && to === preset.to;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    setFrom(preset.from);
                    setTo(preset.to);
                  }}
                  className={`rounded-[84px] border px-2.5 py-1 text-[11px] font-medium transition-colors ${
                    active
                      ? "border-signal-orange/50 bg-signal-orange/10 text-signal-orange"
                      : "border-sand-wash bg-paper-white text-ink-roast hover:bg-sand-wash/40"
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Date From</FieldLabel>
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <FieldLabel>Date To</FieldLabel>
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <FieldLabel>Channel Filter</FieldLabel>
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              className={selectCls}
            >
              <option>All Channels</option>
              <option>Physical POS</option>
              <option>SoftPOS SDK</option>
              <option>Dynamic QR</option>
            </select>
          </div>
          <div>
            <FieldLabel>Status Filter</FieldLabel>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={selectCls}
            >
              <option>All Statuses</option>
              <option>00 Approved Only</option>
              <option>Declined / Non-Zero Only</option>
              <option>91 Timeout &amp; Exception</option>
            </select>
          </div>
        </div>

        {/* Format selector */}
        <div>
          <FieldLabel>Export Format</FieldLabel>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {(["CSV Spreadsheet", "JSON Ledger", "ISO 8583 Binary Trace (.dat)"] as const).map(
              (option) => {
                const active = format === option;
                return (
                  <button
                    key={option}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setFormat(option)}
                    className={`rounded-[12px] border px-3 py-2 text-left text-[11px] font-medium leading-snug transition-colors ${
                      active
                        ? "border-signal-orange/50 bg-signal-orange/10 text-signal-orange"
                        : "border-sand-wash bg-paper-white text-ink-roast hover:bg-sand-wash/40"
                    }`}
                  >
                    {option}
                  </button>
                );
              }
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

function Meta({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-wider text-ash-grey ">
        {label}
      </p>
      <p
        className={`mt-0.5 text-sm font-medium text-ink-roast ${
          mono ? "font-mono text-xs" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span className="h-2 w-2 rounded-full bg-emerald-green " />
      <h4 className="text-sm font-semibold text-ink-roast ">{title}</h4>
    </div>
  );
}