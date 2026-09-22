"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  FileDown,
  RefreshCw,
  RotateCw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { stuckRows, type StuckRow, type StuckStatus } from "./data";
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
  REVERSAL_FAILED: "red",
  LATE_RESPONSE: "amber",
  DUKPT_KEY_DESYNC: "red",
};

const statusFilterOptions = [
  "All Statuses",
  "HOST_TIMEOUT",
  "UNKNOWN_OUTCOME",
  "CONFIG_DRIFT_BLOCKED",
  "REVERSAL_FAILED",
  "LATE_RESPONSE",
  "DUKPT_KEY_DESYNC",
] as const;

type StatusFilter = "All Statuses" | StuckStatus;

export default function UnresolvedQueue() {
  const [rows, setRows] = useState<StuckRow[]>(stuckRows);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All Statuses");
  const [actionToast, setActionToast] = useState<string | null>(null);
  const [forceTarget, setForceTarget] = useState<StuckRow | null>(null);
  const [checkerOk, setCheckerOk] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const masterRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!actionToast) return;
    const t = setTimeout(() => setActionToast(null), 3500);
    return () => clearTimeout(t);
  }, [actionToast]);

  const visibleRows =
    statusFilter === "All Statuses"
      ? rows
      : rows.filter((r) => r.status === statusFilter);

  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(visibleRows.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const pageRows = visibleRows.slice(
    (safeCurrentPage - 1) * pageSize,
    safeCurrentPage * pageSize
  );
  const rangeStart = visibleRows.length === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(safeCurrentPage * pageSize, visibleRows.length);

  const allVisibleSelected =
    pageRows.length > 0 && pageRows.every((r) => selectedIds.includes(r.id));

  useEffect(() => {
    if (masterRef.current) {
      masterRef.current.indeterminate =
        !allVisibleSelected && selectedIds.length > 0;
    }
  }, [allVisibleSelected, selectedIds]);

  const deselectAll = () => setSelectedIds([]);

  const toggleRow = (id: string) =>
    setSelectedIds((ids) =>
      ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]
    );

  const toggleAllVisible = () => {
    if (allVisibleSelected) {
      const pageSet = new Set(pageRows.map((r) => r.id));
      setSelectedIds((ids) => ids.filter((id) => !pageSet.has(id)));
    } else {
      setSelectedIds((ids) => {
        const add = pageRows.map((r) => r.id).filter((id) => !ids.includes(id));
        return [...ids, ...add];
      });
    }
  };

  const discardRow = (row: StuckRow) => {
    setRows((r) => r.filter((x) => x.id !== row.id));
    setSelectedIds((ids) => ids.filter((id) => id !== row.id));
    setActionToast(
      `✓ Exception record ${row.id.toUpperCase()} discarded from queue.`
    );
  };

  const bulkDiscard = () => {
    if (selectedIds.length === 0) return;
    const ids = new Set(selectedIds);
    setRows((r) => r.filter((x) => !ids.has(x.id)));
    setActionToast(
      `✓ ${selectedIds.length} transactions discarded from queue (simulated)`
    );
    setSelectedIds([]);
  };

  const bulkResolve = () => {
    if (selectedIds.length === 0) return;
    const ids = new Set(selectedIds);
    setRows((r) => r.filter((x) => !ids.has(x.id)));
    setActionToast(
      `✓ ${selectedIds.length} transactions marked as Resolved (simulated)`
    );
    setSelectedIds([]);
  };

  const bulkHostInquiry = () => {
    if (selectedIds.length === 0) return;
    const ids = new Set(selectedIds);
    setRows((r) =>
      r.map((row) =>
        ids.has(row.id)
          ? {
              ...row,
              status: "UNKNOWN_OUTCOME" as const,
              tone: "amber" as const,
              aging: "host echo verified · no terminal ACK",
            }
          : row
      )
    );
    setActionToast(
      `✓ Host switches pinged for ${selectedIds.length} transactions — 0 timeouts, 0 echoes (simulated)`
    );
    setSelectedIds([]);
  };

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
    setRows((r) => r.filter((row) => row.id !== forceTarget.id));
    setSelectedIds((ids) => ids.filter((id) => id !== forceTarget.id));
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
                {visibleRows.length} of {rows.length} items
              </Badge>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as StatusFilter);
                  setSelectedIds([]);
                  setCurrentPage(1);
                }}
                aria-label="Filter queue by status"
                className="h-[26px] rounded-[10px] border border-sand-wash bg-paper-white px-2 text-xs font-medium text-ink-roast outline-none focus:border-signal-orange/40"
              >
                {statusFilterOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>              <Badge tone="slate">monitor: 30s cadence</Badge>
            </div>
          }
        />

        {selectedIds.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 border-sand-wash bg-paper-white px-4 py-2.5">
            <span className="text-xs font-semibold text-ink-roast bg-sand-wash/60 px-2.5 py-1 rounded-[8px]">
              {selectedIds.length} items selected
            </span>
            <button
              onClick={bulkDiscard}
              className="inline-flex bg-sand-wash/60 hover:bg-coral-red hover:text-white text-ink-roast text-xs font-medium px-3 py-1.5 rounded-[10px] transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Discard Selected
            </button>
            <button
              onClick={bulkResolve}
              className="inline-flex bg-signal-orange text-white text-xs font-medium px-3 py-1.5 rounded-[10px] hover:bg-brand-orange-tint transition-colors"
            >
              <Check className="h-3.5 w-3.5 mr-1" />
              Force Resolve
            </button>
            <button
              onClick={bulkHostInquiry}
              className="inline-flex border border-sand-wash text-ink-roast text-xs font-medium px-3 py-1.5 rounded-[10px] hover:bg-sand-wash/40 transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1" />
              Host Inquiry
            </button>
            <button
              onClick={deselectAll}
              className="ml-auto text-xs font-medium text-ash-grey hover:text-signal-orange transition-colors"
            >
              Clear selection
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm ">
            <thead>
              <tr className="border-sand-wash text-[11px] uppercase tracking-wider text-ash-grey ">
                <th className="w-10 px-4 py-3">
                  <input
                    ref={masterRef}
                    type="checkbox"
                    checked={allVisibleSelected}
                    onChange={toggleAllVisible}
                    aria-label="Select all visible queue rows"
                    className="h-3.5 w-3.5 cursor-pointer accent-signal-orange"
                  />
                </th>
                <th className="px-4 py-3 font-medium">Exception / Time</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Merchant</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Aging</th>
                <th className="px-4 py-3 text-right font-medium ">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-ash-grey ">
                    <CheckCircle2 className="mx-auto mb-2 h-6 w-6 text-emerald-green " />
                    {rows.length === 0
                      ? "Queue clear — no unresolved items."
                      : "No queue items match this filter."}
                  </td>
                </tr>
              ) : (
                pageRows.map((row) => {
                  const selected = selectedIds.includes(row.id);
                  return (
                    <tr
                      key={row.id}
                      className={`border-sand-wash/60 border-l-4 border-l-signal-orange transition ${
                        selected
                          ? "bg-[rgba(247,59,32,0.08)]"
                          : "bg-[rgba(247,59,32,0.04)] hover:bg-[rgba(247,59,32,0.07)]"
                      }`}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => toggleRow(row.id)}
                          aria-label={`Select ${row.id}`}
                          className="h-3.5 w-3.5 cursor-pointer accent-signal-orange"
                        />
                      </td>
                      <td className="px-4 py-3 font-mono text-sm font-medium text-slate-100 ">
                        {row.id.toUpperCase()} · {row.time}
                      </td>
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
                      <div className="flex flex-wrap items-center justify-end gap-2">
                        <button
                          onClick={() => discardRow(row)}
                          title="Discard exception record"
                          aria-label={`Delete ${row.id} from queue`}
                          className="rounded-[8px] border border-sand-wash px-2.5 py-1 text-xs font-medium text-ash-grey hover:text-signal-orange hover:border-signal-orange/40 hover:bg-sand-wash/20 transition-colors flex items-center gap-1"
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </button>
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {visibleRows.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-sand-wash/60 bg-paper-white px-4 py-3">
            <span className="text-xs font-medium text-ash-grey">
              Showing <span className="text-slate-100 font-semibold">{rangeStart}</span> to <span className="text-slate-100 font-semibold">{rangeEnd}</span> of <span className="text-slate-100 font-semibold">{visibleRows.length}</span> items
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safeCurrentPage <= 1}
                className="rounded-[8px] border border-sand-wash px-3 py-1 text-xs font-medium text-ink-roast hover:bg-sand-wash/40 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ← Prev
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (n) => {
                    const active = n === safeCurrentPage;
                    const near = Math.abs(n - safeCurrentPage) <= 1 || n === 1 || n === totalPages;
                    if (!near && totalPages > 7 && n !== safeCurrentPage) return null;
                    return (
                      <button
                        key={n}
                        onClick={() => setCurrentPage(n)}
                        aria-current={active ? "page" : undefined}
                        className={`h-7 min-w-[28px] rounded-[8px] px-2 text-xs font-medium transition-colors ${
                          active
                            ? "bg-signal-orange text-white"
                            : "border border-sand-wash text-ash-grey hover:bg-sand-wash/40 hover:text-ink-roast"
                        }`}
                      >
                        {n}
                      </button>
                    );
                  }
                )}
              </div>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safeCurrentPage >= totalPages}
                className="rounded-[8px] border border-sand-wash px-3 py-1 text-xs font-medium text-ink-roast hover:bg-sand-wash/40 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          </div>
        )}
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

      {actionToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed right-4 top-4 z-[70] flex max-w-md items-start gap-3 rounded-[12px] border border-signal-orange/25 bg-paper-white px-4 py-3 shadow-[var(--shadow-floating)] animate-modal-pop"
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-green/15">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-green" />
          </span>
          <p className="text-sm leading-snug text-ink-roast">{actionToast}</p>
          <button
            onClick={() => setActionToast(null)}
            aria-label="Dismiss queue notification"
            className="text-ash-grey transition-colors hover:text-signal-orange"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}