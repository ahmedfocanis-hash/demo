"use client";

import { useState } from "react";
import { RefreshCw, Send, Settings2 } from "lucide-react";
import { terminals, type TerminalRow } from "./data";
import { Badge, ButtonGhost, PanelTitle, Toggle } from "./ui";

type UpdateState = Record<string, "Idle" | "Updating..." | "Updated">;

const driftTone: Record<TerminalRow["drift"], "green" | "red"> = {
  "In Sync": "green",
  "Drift Detected": "red",
};

const modelBadge: Record<TerminalRow["model"], "slate" | "cyan" | "violet"> = {
  "PAX A920": "slate",
  "SUNMI V2s": "cyan",
  "NEXGO N86": "violet",
};

export default function TerminalsTab() {
  const [rows, setRows] = useState<TerminalRow[]>(terminals);
  const [updates, setUpdates] = useState<UpdateState>({});
  const [autoPush, setAutoPush] = useState(true);

  const triggerPush = (tid: string) => {
    setUpdates((u) => ({ ...u, [tid]: "Updating..." }));
    // Simulate RPM push completion after a short delay.
    setTimeout(() => {
      setUpdates((u) => ({ ...u, [tid]: "Updated" }));
      setRows((r) =>
        r.map((row) =>
          row.tid === tid
            ? { ...row, paramVer: "v2.4", drift: "In Sync", lastPing: "just now" }
            : row
        )
      );
    }, 1200);
  };

  const pushAll = () => {
    rows
      .filter((r) => r.drift === "Drift Detected")
      .forEach((r) => triggerPush(r.tid));
  };

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-900 ">
        <PanelTitle
          title="Terminal Fleet & Drift Management"
          subtitle="Runtime parameter health vs authoritative baseline (v2.4)"
          right={
            <div className="flex items-center gap-2">
              <Badge tone="amber" dot>
                {rows.filter((r) => r.drift === "Drift Detected").length} drift
              </Badge>
              <ButtonGhost onClick={pushAll}>
                <Send className="h-4 w-4" /> Push All Drifted
              </ButtonGhost>
            </div>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm ">
            <thead>
              <tr className="border-slate-200 dark:border-slate-800 text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 ">
                <th className="px-4 py-3 font-medium">TID</th>
                <th className="px-4 py-3 font-medium">Model</th>
                <th className="px-4 py-3 font-medium">Merchant</th>
                <th className="px-4 py-3 font-medium">App Version</th>
                <th className="px-4 py-3 font-medium">Parameter Version</th>
                <th className="px-4 py-3 font-medium">Drift Status</th>
                <th className="px-4 py-3 font-medium">Last Heartbeat</th>
                <th className="px-4 py-3 text-right font-medium ">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const state = updates[row.tid] ?? "Idle";
                const paramMismatch = row.paramVer !== "v2.4";
                return (
                  <tr
                    key={row.tid}
                    className="border-slate-200 dark:border-slate-800/60 transition hover:bg-slate-50/80 dark:hover:bg-slate-800/40 "
                  >
                    <td className="px-4 py-3 font-mono text-xs font-medium text-slate-900 dark:text-slate-100 ">
                      {row.tid}
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={modelBadge[row.model]}>{row.model}</Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300 ">{row.merchant}</td>
                    <td className="px-4 py-3 font-mono text-slate-700 dark:text-slate-300 ">
                      {row.appVer}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs ">
                      <span
                        className={
                          paramMismatch ? "text-amber-400" : "text-slate-700 dark:text-slate-300 "
                        }
                      >
                        {row.paramVer}
                      </span>
                      {paramMismatch && (
                        <span className="ml-2 text-slate-500 dark:text-slate-400 ">
                          baseline v2.4
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={driftTone[row.drift]} dot>
                        {row.drift}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-500 dark:text-slate-400 ">
                      {row.lastPing}
                    </td>
                    <td className="px-4 py-3 text-right ">
                      {state === "Idle" ? (
                        <button
                          onClick={() => triggerPush(row.tid)}
                          disabled={!paramMismatch}
                          className="inline-flex items-center gap-1.5 rounded-lg border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1.5 text-xs font-medium text-emerald-300 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-40 "
                        >
                          <Send className="h-3.5 w-3.5" /> Trigger Silent RPM Push
                        </button>
                      ) : state === "Updating..." ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-300 ">
                          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                          Updating...
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-300 ">
                          <Settings2 className="h-3.5 w-3.5" /> v2.4 Applied
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-4 ">
        <div>
          <p className="text-sm font-medium text-slate-900 dark:text-slate-200 ">
            Silent RPM Auto-Push
          </p>
          <p className="text-slate-500 dark:text-slate-400 ">
            Out-of-band heartbeat suppresses user-visible alert during push.
          </p>
        </div>
        <Toggle on={autoPush} onChange={setAutoPush} />
      </div>
    </div>
  );
}