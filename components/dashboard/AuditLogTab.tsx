"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  Ban,
  Filter,
  Search,
  Shield,
  UserCog,
} from "lucide-react";
import {
  auditLogsData,
  type AuditActionType,
  type AuditActorRole,
  type AuditSeverity,
} from "./data";
import { Badge, PanelTitle, inputCls, selectCls } from "./ui";

/* --------------------------------- Helpers --------------------------------- */

const severityTone: Record<AuditSeverity, "neutral" | "amber" | "rose"> = {
  INFO: "neutral",
  WARNING: "amber",
  CRITICAL: "rose",
};

// INFO = blue, WARNING = amber, CRITICAL = rose (as required by spec).
const actionTone: Record<AuditSeverity, "blue" | "amber" | "rose"> = {
  INFO: "blue",
  WARNING: "amber",
  CRITICAL: "rose",
};

const roleTone: Record<AuditActorRole, "violet" | "cyan" | "blue" | "amber" | "slate" | "green"> = {
  "Platform Admin": "violet",
  "Acquirer Ops": "cyan",
  "Settlement Ops": "blue",
  "Terminal Tech": "amber",
  System: "slate",
  "API Service": "green",
};

type AuditLogEntryChannel = "PORTAL" | "API" | "SYSTEM" | "VPN";

const channelTone: Record<AuditLogEntryChannel, "emerald" | "cyan" | "slate" | "violet"> = {
  PORTAL: "emerald",
  API: "cyan",
  SYSTEM: "slate",
  VPN: "violet",
};

/** Format ISO-8601 UTC timestamp with microsecond precision for display. */
function formatTimestamp(iso: string): { date: string; time: string; micro: string } {
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) {
    return { date: iso.slice(0, 10), time: iso.slice(11, 19), micro: iso.slice(19) };
  }
  const date = dt.toISOString().slice(0, 10);
  const time = dt.toISOString().slice(11, 19);
  // Pull fractional part directly from source for microsecond fidelity.
  const fracMatch = iso.match(/\.(\d{1,9})/);
  const micro = fracMatch ? fracMatch[1].padEnd(6, "0").slice(0, 6) : "000000";
  return { date, time, micro };
}

/* --------------------------------- Filters --------------------------------- */

const ACTION_OPTIONS: (AuditActionType | "ALL")[] = [
  "ALL",
  "LOGIN",
  "LOGOUT",
  "RULE_MODIFIED",
  "RULE_DELETED",
  "TERMINAL_PARAM_PUSH",
  "TERMINAL_KEY_ROTATION",
  "MERCHANT_ONBOARDED",
  "SETTLEMENT_RESEND",
  "USER_ROLE_CHANGED",
  "CONFIG_OVERRIDE",
  "ACCESS_DENIED",
  "EXPORT_GENERATED",
];

const SEVERITY_OPTIONS: (AuditSeverity | "ALL")[] = ["ALL", "INFO", "WARNING", "CRITICAL"];

/* --------------------------------- Component --------------------------------- */

export default function AuditLogTab() {
  const [query, setQuery] = useState("");
  const [actionFilter, setActionFilter] = useState<AuditActionType | "ALL">("ALL");
  const [severityFilter, setSeverityFilter] = useState<AuditSeverity | "ALL">("ALL");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return auditLogsData.filter((entry) => {
      if (actionFilter !== "ALL" && entry.action !== actionFilter) return false;
      if (severityFilter !== "ALL" && entry.severity !== severityFilter) return false;
      if (!q) return true;
      const haystack = [
        entry.id,
        entry.actor.name,
        entry.actor.email,
        entry.actor.role,
        entry.action,
        entry.targetType,
        entry.targetId,
        entry.ipAddress,
        entry.channel,
        entry.diff?.before ?? "",
        entry.diff?.after ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [query, actionFilter, severityFilter]);

  /* KPI metrics (24h snapshot from the mock stream) */
  const totalEvents = auditLogsData.length * 214; // realistic 24h volume extrapolation
  const criticalOverrides = auditLogsData.filter(
    (e) => e.action === "CONFIG_OVERRIDE" && e.severity === "CRITICAL",
  ).length;
  const activeAdmins = new Set(
    auditLogsData
      .filter((e) => e.actor.role === "Platform Admin")
      .map((e) => e.actor.email),
  ).size;
  const blockedAttempts = auditLogsData.filter((e) => e.status === "BLOCKED").length;

  const summary = [
    {
      label: "Total Events (24h)",
      value: totalEvents.toLocaleString("en-US"),
      icon: Activity,
      tone: "text-cobalt-blue",
      bg: "bg-cobalt-blue/10 ring-cobalt-blue/20 ",
    },
    {
      label: "Critical Overrides",
      value: String(criticalOverrides),
      icon: Shield,
      tone: "text-coral-red",
      bg: "bg-coral-red/10 ring-coral-red/20 ",
    },
    {
      label: "Active Admins",
      value: String(activeAdmins),
      icon: UserCog,
      tone: "text-signal-orange",
      bg: "bg-signal-orange/10 ring-signal-orange/20 ",
    },
    {
      label: "Blocked Attempts",
      value: String(blockedAttempts),
      icon: Ban,
      tone: "text-brand-orange-tint",
      bg: "bg-brand-orange-tint/10 ring-brand-orange-tint/20 ",
    },
  ];

  return (
    <div className="space-y-5">
      {/* KPI summary */}
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

      {/* Main audit trail */}
      <div className="overflow-hidden rounded-2xl border-sand-wash bg-paper-white ">
        <PanelTitle
          title="Immutable Audit Trail"
          subtitle="Every user and system modification across the portal, WORM-logged"
          right={
            <Badge tone="neutral" dot pulse>
              {filtered.length} / {auditLogsData.length} events
            </Badge>
          }
        />

        {/* Filter toolbar */}
        <div className="grid-cols-1 gap-3 border-sand-wash px-5 py-4 md:grid-cols-[1fr_220px_180px] ">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ash-grey " />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by actor, entity ID, IP, or diff content…"
              className={`${inputCls} pl-9`}
              aria-label="Search audit log"
            />
          </div>
          <div className="relative">
            <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ash-grey " />
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value as AuditActionType | "ALL")}
              className={`${selectCls} pl-9`}
              aria-label="Filter by action type"
            >
              {ACTION_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === "ALL" ? "All Actions" : opt}
                </option>
              ))}
            </select>
          </div>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as AuditSeverity | "ALL")}
            className={selectCls}
            aria-label="Filter by severity"
          >
            {SEVERITY_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt === "ALL" ? "All Severities" : opt}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px] text-sm ">
            <thead>
              <tr className="border-sand-wash text-[11px] uppercase tracking-wider text-ash-grey ">
                <th className="px-4 py-3 font-medium">Timestamp</th>
                <th className="px-4 py-3 font-medium">Actor</th>
                <th className="px-4 py-3 font-medium">Action</th>
                <th className="px-4 py-3 font-medium">Target Entity</th>
                <th className="px-4 py-3 font-medium">Modification Diff</th>
                <th className="px-4 py-3 font-medium">IP &amp; Channel</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-ash-grey "
                  >
                    No audit events match the current filter.
                  </td>
                </tr>
              ) : (
                filtered.map((entry) => {
                  const ts = formatTimestamp(entry.timestamp);
                  const isBlocked = entry.status === "BLOCKED";
                  return (
                    <tr
                      key={entry.id}
                      className={`border-sand-wash transition hover:bg-paper-white/80:bg-slate-800/40 ${
                        isBlocked ? "bg-coral-red/5" : ""
                      }`}
                    >
                      {/* Timestamp (microsecond precision) */}
                      <td className="px-4 py-3 align-top">
                        <div className="font-mono text-xs font-semibold text-ink-roast ">
                          {ts.date}
                        </div>
                        <div className="font-mono text-ash-grey ">
                          {ts.time}
                          <span className="text-ash-grey ">.{ts.micro}</span>
                          <span className="ml-1 text-ash-grey ">Z</span>
                        </div>
                        <div className="mt-1 font-mono text-ink-roast/80 ">
                          {entry.id}
                        </div>
                      </td>

                      {/* Actor */}
                      <td className="px-4 py-3 align-top">
                        <div className="font-medium text-ink-roast ">
                          {entry.actor.name}
                        </div>
                        <div className="mt-0.5 truncate font-mono text-ash-grey ">
                          {entry.actor.email}
                        </div>
                        <div className="mt-1.5">
                          <Badge tone={roleTone[entry.actor.role]} dot>
                            {entry.actor.role}
                          </Badge>
                        </div>
                      </td>

                      {/* Action (severity colored) */}
                      <td className="px-4 py-3 align-top">
                        <Badge tone={actionTone[entry.severity]} dot pulse={entry.severity === "CRITICAL"}>
                          {entry.action}
                        </Badge>
                        <div className="mt-1.5">
                          <Badge tone={severityTone[entry.severity]}>
                            {entry.severity}
                          </Badge>
                        </div>
                      </td>

                      {/* Target entity */}
                      <td className="px-4 py-3 align-top">
                        <div className="text-xs font-medium uppercase tracking-wide text-ash-grey ">
                          {entry.targetType}
                        </div>
                        <div className="mt-1 font-mono text-xs font-semibold text-ink-roast ">
                          {entry.targetId}
                        </div>
                      </td>

                      {/* Modification diff */}
                      <td className="px-4 py-3 align-top">
                        {entry.diff ? (
                          <div className="space-y-1.5">
                            <div className="flex items-start gap-2">
                              <span className="mt-0.5 shrink-0 rounded bg-coral-red/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase text-coral-red ring-coral-red/30 ">
                                before
                              </span>
                              <span className="truncate font-mono text-rose-300/90 ">
                                {entry.diff.before}
                              </span>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="mt-0.5 shrink-0 rounded bg-emerald-green/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase text-emerald-green ring-emerald-green/30 ">
                                after
                              </span>
                              <span className="truncate font-mono text-emerald-300/90 ">
                                {entry.diff.after}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span className="font-mono text-[11px] italic text-ash-grey ">
                            (no mutation)
                          </span>
                        )}
                      </td>

                      {/* IP & Channel */}
                      <td className="px-4 py-3 align-top">
                        <div className="font-mono text-xs font-semibold text-ink-roast ">
                          {entry.ipAddress}
                        </div>
                        <div className="mt-1.5">
                          <Badge tone={channelTone[entry.channel]}>
                            {entry.channel}
                          </Badge>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3 align-top">
                        <Badge tone={isBlocked ? "rose" : "green"} dot pulse={isBlocked}>
                          {entry.status}
                        </Badge>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
