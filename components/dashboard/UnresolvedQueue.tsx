"use client";

import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  FileDown,
  RefreshCw,
  RotateCw,
  Search,
} from "lucide-react";
import { stuckRows, type StuckRow } from "./data";
import ConfirmDialog from "../ui/ConfirmDialog";
import {
  Badge,
  ButtonGhost,
  FieldLabel,
  inputCls,
  Modal,
  PanelTitle,
  Toggle,
} from "./ui";

const statusTone: Record<StuckRow["status"], "red" | "amber" | "blue"> = {
  HOST_TIMEOUT: "red",
  UNKNOWN_OUTCOME: "amber",
  CONFIG_DRIFT_BLOCKED: "blue",
};

export default function UnresolvedQueue() {
  const [rows, setRows] = useState<StuckRow[]>(stuckRows);
  const [forceTarget, setForceTarget] = useState<StuckRow | null>(null);
  const [checkerOk, setCheckerOk] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [resolved, setResolved] = useState<string[]>([]);

  const hostInquiry = (id: string) => {
    setRows((r) =>
      r.map((row) =>
        row.id === id
          ? {
              ...row,
              aging: "re-checked · no host echo",
              status: "UNKNOWN_OUTCOME" as const,
              tone: "amber",
            }
          : row
      )
    );
  };

  const redrive = (id: string) => {
    setRows((r) =>
      r.map((row) =>
        row.id === id
          ? { ...row, aging: "0400 reversal queued" }
          : row
      )
    );
  };

  const forceResolve = () => {
    if (!forceTarget) return;
    setResolved((x) => [...x, forceTarget.id]);
    setRows((r) => r.filter((row) => row.id !== forceTarget.id));
    setForceTarget(null);
    setCheckerOk(false);
    setConfirmOpen(false);
  };

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-2xl border-sand-wash bg-paper-white ">
        <PanelTitle
          title="Stuck & Unresolved Queue"
          subtitle="REQ-MON-007 → 013 · non-terminal transactions requiring intervention"
          right={
            <div className="flex items-center gap-2">
              <Badge tone="red" dot>
                {rows.length} items
              </Badge>
              <Badge tone="slate">monitor: 30s cadence</Badge>
            </div>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm ">
            <thead>
              <tr className="border-sand-wash text-[11px] uppercase tracking-wider text-ash-grey ">
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Merchant</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Aging</th>
                <th className="px-4 py-3 text-right font-medium ">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-ash-grey ">
                    <CheckCircle2 className="mx-auto mb-2 h-6 w-6 text-emerald-green " />
                    Queue clear — no unresolved items.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-sand-wash/60 bg-[rgba(247,59,32,0.04)] border-l-4 border-l-signal-orange transition hover:bg-[rgba(247,59,32,0.07)] "
                  >
                    <td className="px-4 py-3 font-mono text-sm font-medium text-slate-100 ">
                      {row.amount}{" "}
                      <span className="text-ash-grey">IQD</span>
                    </td>
                    <td className="px-4 py-3 text-xs font-medium text-ash-grey ">
                      {row.type}
                    </td>
                    <td className="px-4 py-3 text-ash-grey ">{row.merchant}</td>
                    <td className="px-4 py-3">
                      <Badge tone={statusTone[row.status]} dot>
                        {row.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-mono text-ash-grey ">
                      {row.aging}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap justify-end gap-2">
                        <button
                          onClick={() => hostInquiry(row.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg border-sand-wash bg-paper-white px-2.5 py-1.5 text-xs font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-800 "
                        >
                          <Search className="h-3.5 w-3.5" /> Host Inquiry
                        </button>
                        <button
                          onClick={() => redrive(row.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg border-sand-wash bg-paper-white px-2.5 py-1.5 text-xs font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-800 "
                        >
                          <RotateCw className="h-3.5 w-3.5" /> Redrive Reversal (0400)
                        </button>
                        <button
                          onClick={() => setForceTarget(row)}
                          className="inline-flex items-center gap-1.5 rounded-lg border-emerald-green/30 bg-emerald-green/10 px-2.5 py-1.5 text-xs font-medium text-emerald-300 transition hover:bg-emerald-green/20 "
                        >
                          <RefreshCw className="h-3.5 w-3.5" /> Force Resolve
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dual-control force resolve modal */}
      <Modal
        open={!!forceTarget}
        onClose={() => setForceTarget(null)}
        title={
          <span className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-brand-orange-tint " />
            Manual Force Resolve
          </span>
        }
      >
        {forceTarget && (
          <div className="space-y-4">
            <p className="text-ash-grey">
              Resolving{" "}
              <span className="font-semibold text-slate-200 ">
                {forceTarget?.amount} IQD
              </span>{" "}
              — {forceTarget.type} ({forceTarget.merchant}). Dual-control
              sign-off is required.
            </p>

            <div>
              <FieldLabel>Ticket Reference</FieldLabel>
              <input
                className={inputCls}
                placeholder="e.g. TICKET-2417"
                defaultValue={`TICKET-24${forceTarget.id.slice(-2)}`}
              />
            </div>

            <div>
              <FieldLabel>Reason Notes</FieldLabel>
              <textarea
                className={`${inputCls} min-h-[80px] resize-none`}
                placeholder="Describe the resolution rationale for audit trail…"
              />
            </div>

            <div className="flex items-center justify-between rounded-xl bg-[rgba(247,59,32,0.04)] border-l-4 border-l-signal-orange px-4 py-3 ">
              <div>
                <p className="text-sm font-medium text-slate-200 ">
                  Checker Approval Sign-off
                </p>
                <p className="text-ash-grey">
                  Maker proposes · Checker approves. Requires a second operator.
                </p>
              </div>
              <Toggle on={checkerOk} onChange={setCheckerOk} />
            </div>

            <div className="flex items-center justify-between gap-3 pt-1">
              <p className="text-ash-grey">
                <FileDown className="mr-1 inline h-3.5 w-3.5" />
                Audit trail auto-appended to ticket
              </p>
              <div className="flex gap-2">
                <ButtonGhost onClick={() => setForceTarget(null)}>
                  Cancel
                </ButtonGhost>
                <button
                  onClick={() => setConfirmOpen(true)}
                  disabled={!checkerOk}
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-green px-4 py-2 text-sm font-semibold text-ink-roast transition-all duration-150 hover:bg-emerald-green hover:brightness-110 active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 "
                >
                  <CheckCircle2 className="h-4 w-4" /> Confirm Resolve
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={forceResolve}
        title="Confirm Manual Force Resolve"
        confirmLabel="Resolve"
        description={`Permanently resolve ${forceTarget?.amount} IQD — ${forceTarget?.type} at ${forceTarget?.merchant}? This action writes to the audit trail and cannot be undone.`}
      />
    </div>
  );
}