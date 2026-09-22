"use client";

import { useMemo } from "react";
import {
  Activity,
  Gauge,
  Smartphone,
  Wallet,
} from "lucide-react";
import {
  filterByBank,
  vasCatalogData,
  vasTransactionsData,
  type AcquirerBank,
  type VasCategory,
  type VasService,
  type VasTransaction,
} from "./data";
import { Badge, PanelTitle } from "./ui";

const categoryTone: Record<VasCategory, "cyan" | "blue" | "violet" | "amber" | "slate"> = {
  telecom: "cyan",
  utility: "blue",
  dcc: "violet",
  voucher: "amber",
  government: "slate",
};

const categoryLabel: Record<VasCategory, string> = {
  telecom: "Telecom",
  utility: "Utility",
  dcc: "DCC",
  voucher: "Voucher",
  government: "Government",
};

const serviceStatusTone = (
  status: VasService["status"],
): "emerald" | "amber" | "rose" | "neutral" => {
  switch (status) {
    case "ACTIVE":
      return "emerald";
    case "MAINTENANCE":
    case "DEGRADED":
      return "amber";
    case "SUSPENDED":
      return "rose";
  }
};

const txStatusTone = (
  status: VasTransaction["status"],
): "emerald" | "amber" | "rose" | "neutral" => {
  switch (status) {
    case "00 Approved":
      return "emerald";
    case "91 Switch Timeout":
      return "amber";
    default:
      return "rose";
  }
};

const fmtIqd = (n: number) => n.toLocaleString("en-US");

const fmtAmount = (amount: number, currency: "IQD" | "USD") =>
  currency === "USD"
    ? `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : `${amount.toLocaleString("en-US")} IQD`;

export default function VasTab({ bank }: { bank: AcquirerBank }) {
  const catalogRows = useMemo(() => filterByBank(vasCatalogData, bank), [bank]);
  const txRows = useMemo(() => filterByBank(vasTransactionsData, bank), [bank]);
  const totalVolume = catalogRows.reduce((s, v) => s + v.dailyVolumeIqd, 0);
  const totalTx = catalogRows.reduce((s, v) => s + v.txCount24h, 0);
  const avgSuccess =
    catalogRows.length > 0
      ? Math.round(catalogRows.reduce((s, v) => s + v.successRate, 0) / catalogRows.length)
      : 0;
  const activeProviders = catalogRows.filter((v) => v.status === "ACTIVE").length;

  const summary = [
    {
      label: "Today's VAS Volume",
      value: `${(totalVolume / 1_000_000).toFixed(1)}M IQD`,
      icon: Wallet,
      tone: "text-ink-roast ",
      bg: "bg-paper-white0/10 ring-slate-500/20 ",
    },
    {
      label: "24h VAS Transactions",
      value: `${fmtIqd(totalTx)} tx`,
      icon: Activity,
      tone: "text-cobalt-blue",
      bg: "bg-cobalt-blue/10 ring-cobalt-blue/20 ",
    },
    {
      label: "Switch Success Rate",
      value: `${avgSuccess.toFixed(1)}%`,
      icon: Gauge,
      tone: "text-emerald-green",
      bg: "bg-emerald-green/10 ring-emerald-green/20 ",
    },
    {
      label: "Active Providers",
      value: `${activeProviders} / ${vasCatalogData.length} Active`,
      icon: Smartphone,
      tone: "text-signal-orange",
      bg: "bg-signal-orange/10 ring-signal-orange/20 ",
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

      {/* Provider catalog */}
      <div className="overflow-hidden rounded-2xl border-sand-wash bg-paper-white ">
        <PanelTitle
          title="VAS Provider Catalog"
          subtitle="Billers, switches & commission schedules"
          right={<Badge tone="blue">{catalogRows.length} Services</Badge>}
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-sm ">
            <thead>
              <tr className="border-sand-wash text-[11px] uppercase tracking-wider text-ash-grey ">
                <th className="px-4 py-3 font-medium">Service Name</th>
                <th className="px-4 py-3 font-medium">Code</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Provider Switch</th>
                <th className="px-4 py-3 font-medium">Fee / Commission</th>
                <th className="px-4 py-3 font-medium">24h Volume (IQD)</th>
                <th className="px-4 py-3 font-medium">Success Rate</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {catalogRows.map((svc) => (
                <tr
                  key={svc.id}
                  className="border-sand-wash transition hover:bg-paper-white/80:bg-slate-800/40 "
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-ink-roast ">{svc.name}</div>
                    <div className="mt-0.5 flex flex-wrap gap-1">
                      {svc.supportedChannels.map((ch) => (
                        <span
                          key={ch}
                          className="rounded bg-paper-white px-1.5 py-0.5 text-[10px] font-medium text-ash-grey "
                        >
                          {ch}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-ink-roast ">
                    {svc.code}
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={categoryTone[svc.category]}>
                      {categoryLabel[svc.category]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-ink-roast ">{svc.provider}</td>
                  <td className="px-4 py-3 font-mono text-ink-roast ">
                    {svc.feeValue}
                    <span className="ml-1.5 text-[10px] uppercase text-ash-grey ">
                      {svc.feeType}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-ink-roast ">
                    {fmtIqd(svc.dailyVolumeIqd)}
                    <span className="ml-1 text-ash-grey ">
                      ({fmtIqd(svc.txCount24h)} tx)
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`font-mono text-xs font-medium ${
                        svc.successRate >= 95
                          ? "text-emerald-green"
                          : svc.successRate >= 90
                          ? "text-brand-orange-tint"
                          : "text-coral-red"
                      }`}
                    >
                      {svc.successRate.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={serviceStatusTone(svc.status)} dot>
                      {svc.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent VAS transactions */}
      <div className="overflow-hidden rounded-2xl border-sand-wash bg-paper-white ">
        <PanelTitle
          title="Recent VAS Transactions"
          subtitle="Live stream of bill payments, top-ups & FX conversions"
          right={<Badge tone="green" dot pulse>Live</Badge>}
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-sm ">
            <thead>
              <tr className="border-sand-wash text-[11px] uppercase tracking-wider text-ash-grey ">
                <th className="px-4 py-3 font-medium">Timestamp</th>
                <th className="px-4 py-3 font-medium">Correlation ID</th>
                <th className="px-4 py-3 font-medium">Service</th>
                <th className="px-4 py-3 font-medium">Provider</th>
                <th className="px-4 py-3 font-medium">Reference / Account</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Commission</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {txRows.map((tx) => (
                <tr
                  key={tx.id}
                  className="border-sand-wash transition hover:bg-paper-white/80:bg-slate-800/40 "
                >
                  <td className="px-4 py-3 font-mono text-ash-grey ">
                    {tx.timestamp}
                  </td>
                  <td className="px-4 py-3 font-mono text-ink-roast ">
                    {tx.correlationId}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-ink-roast ">{tx.serviceName}</div>
                    <div className="mt-0.5 font-mono text-ash-grey ">
                      {tx.serviceCode} · {tx.channel} · {tx.terminalId}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink-roast ">{tx.provider}</td>
                  <td className="px-4 py-3 font-mono text-ink-roast ">
                    {tx.referenceNo}
                    <div className="mt-0.5 text-ash-grey ">
                      {tx.merchantName}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs font-medium text-ink-roast ">
                    {fmtAmount(tx.amount, tx.currency)}
                  </td>
                  <td className="px-4 py-3 font-mono text-ink-roast ">
                    {fmtAmount(tx.fee, tx.currency)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={txStatusTone(tx.status)} dot>
                      {tx.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
