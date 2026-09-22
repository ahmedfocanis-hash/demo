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
import { batches, filterByBank, type AcquirerBank, type BatchRow } from "./data";
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

export default function SettlementTab({ bank }: { bank: AcquirerBank }) {
  const [rows, setRows] = useState<BatchRow[]>(() => filterByBank(batches, bank));
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
      tone: "text-ink-roast ",
      bg: "bg-paper-white0/10 ring-slate-500/20 ",
    },
    {
      label: "Delivered & Acknowledged",
      value: String(delivered),
      icon: CheckCircle2,
      tone: "text-emerald-green",
      bg: "bg-emerald-green/10 ring-emerald-green/20 ",
    },
    {
      label: "NACK / Failed",
      value: String(failed),
      icon: XCircle,
      tone: "text-coral-red",
      bg: "bg-coral-red/10 ring-coral-red/20 ",
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
              className={`rounded-2xl border-sand-wash bg-white p-5 ${s.bg}`}
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-ash-grey ">{s.label}</p>
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
      <div className="overflow-hidden rounded-2xl border-sand-wash bg-paper-white ">
        <PanelTitle
          title="Settlement Delivery Lifecycle"
          subtitle="EOD batch transmission, acknowledgment & NACK handling"
          right={<Badge tone="blue">Settlement Window: Closed</Badge>}
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm ">
            <thead>
              <tr className="border-sand-wash text-[11px] uppercase tracking-wider text-ash-grey ">
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
                  className="border-sand-wash transition hover:bg-paper-white/80:bg-slate-800/40 "
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 font-mono text-xs font-semibold text-ink-roast ">
                      {row.id}
                      {row.rev && (
                        <Badge tone="violet">{row.rev}</Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink-roast ">{row.dest}</td>
                  <td className="px-4 py-3 font-mono text-xs font-medium text-ink-roast ">
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
                  <td className="px-4 py-3 font-mono text-ash-grey ">
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

      <div className="flex items-center gap-3 rounded-2xl border-coral-red/20 bg-coral-red/5 px-5 py-3 ">
        <FileX2 className="h-4 w-4 text-coral-red " />
        <p className="text-ash-grey ">
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