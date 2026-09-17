"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Download,
  FileX2,
  Package,
  RefreshCcw,
  Server,
  Trash2,
  XCircle,
} from "lucide-react";
import { batches, type BatchRow } from "./data";
import ConfirmDialog from "../ui/ConfirmDialog";
import { Badge, ButtonGhost, PanelTitle } from "./ui";

const statusTone: Record<
  BatchRow["status"],
  "green" | "amber" | "red"
> = {
  ACK_RECEIVED: "green",
  TRANSMITTED: "amber",
  NACK_REJECTED: "red",
};

const transportTone: Record<BatchRow["transport"], "slate" | "cyan"> = {
  SFTP: "slate",
  "API Push": "cyan",
};

export default function SettlementTab() {
  const [rows, setRows] = useState<BatchRow[]>(batches);
  const [revisions, setRevisions] = useState<Record<string, number>>({});
  const [purgeTarget, setPurgeTarget] = useState<BatchRow | null>(null);

  const delivered = rows.filter((r) => r.status !== "NACK_REJECTED").length;
  const failed = rows.length - delivered;

  const download = (id: string) => {
    // Placeholder — triggers the file download for the batch.
    window.alert(`Downloading ${id} settlement file…`);
  };

  const regenerate = (id: string) => {
    const n = (revisions[id] ?? 0) + 1;
    setRevisions((x) => ({ ...x, [id]: n }));
    setRows((r) =>
      r.map((row) =>
        row.id === id
          ? { ...row, status: "TRANSMITTED", rev: `REV-${n + 1}` }
          : row
      )
    );
  };

  const summary = [
    {
      label: "Total Batches",
      value: String(rows.length),
      icon: Package,
      tone: "text-slate-700 dark:text-slate-300 ",
      bg: "bg-slate-500/10 ring-slate-500/20 ",
    },
    {
      label: "Delivered & Acknowledged",
      value: String(delivered),
      icon: CheckCircle2,
      tone: "text-emerald-400",
      bg: "bg-emerald-500/10 ring-emerald-500/20 ",
    },
    {
      label: "NACK / Failed",
      value: String(failed),
      icon: XCircle,
      tone: "text-rose-400",
      bg: "bg-rose-500/10 ring-rose-500/20 ",
    },
  ];

  return (
    <div className="space-y-5">
      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summary.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className={`rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 ${s.bg}`}
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 ">{s.label}</p>
                <Icon className={`h-4 w-4 ${s.tone}`} />
              </div>
              <p className={`mt-3 font-mono text-3xl font-semibold ${s.tone}`}>
                {s.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Batch table */}
      <div className="overflow-hidden rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-900 ">
        <PanelTitle
          title="Settlement Delivery Lifecycle"
          subtitle="EOD batch transmission, acknowledgment & NACK handling"
          right={<Badge tone="blue">Settlement Window: Closed</Badge>}
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm ">
            <thead>
              <tr className="border-slate-200 dark:border-slate-800 text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 ">
                <th className="px-4 py-3 font-medium">Batch ID</th>
                <th className="px-4 py-3 font-medium">Acquirer / Destination</th>
                <th className="px-4 py-3 font-medium">Amount (IQD)</th>
                <th className="px-4 py-3 font-medium">Transport</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Timestamp</th>
                <th className="px-4 py-3 text-right font-medium ">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-slate-200 dark:border-slate-800/60 transition hover:bg-slate-50/80 dark:hover:bg-slate-800/40 "
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 font-mono text-xs font-semibold text-slate-900 dark:text-slate-100 ">
                      {row.id}
                      {row.rev && (
                        <Badge tone="violet">{row.rev}</Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300 ">{row.dest}</td>
                  <td className="px-4 py-3 font-mono text-xs font-medium text-slate-900 dark:text-slate-100 ">
                    {Number(row.volume).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={transportTone[row.transport]}>{row.transport}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={statusTone[row.status]} dot>
                      {row.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-500 dark:text-slate-400 ">
                    {row.timestamp}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <ButtonGhost onClick={() => download(row.id)}>
                        <Download className="h-4 w-4" /> Download File
                      </ButtonGhost>
                      <ButtonGhost onClick={() => regenerate(row.id)}>
                        <RefreshCcw className="h-4 w-4" /> Regenerate Batch
                      </ButtonGhost>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border-rose-500/20 bg-rose-500/5 px-5 py-3 ">
        <FileX2 className="h-4 w-4 text-rose-400 " />
        <p className="text-slate-500 dark:text-slate-400 ">
          <span className="font-semibold text-rose-300 ">
            STL-88217 · Zain Cash PSP
          </span>{" "}
          returned NACK — checksum mismatch on hash total. Regenerate batch to
          re-transmit via API Push.
        </p>
      </div>
    </div>
  );
}