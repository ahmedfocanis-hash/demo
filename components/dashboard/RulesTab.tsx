"use client";

import { useMemo, useState } from "react";
import type { ChangeEvent, ReactNode } from "react";
import {
  ArrowRight,
  Beaker,
  Braces,
  Cable,
  CheckCircle2,
  Globe,
  GitBranch,
  KeyRound,
  Network,
  Play,
  Plug,
  Plus,
  Rocket,
  Route,
  Server,
  Send,
  ShieldCheck,
  Upload,
  Wifi,
  Workflow,
} from "lucide-react";
import {
  destinationOptionsFor,
  destinationHosts,
  routingRules,
  sourceChannels,
  sourceInstitutions,
  transactionTypes,
  vasStages,
  dccProviders,
} from "./data";
import type {
  DccProvider,
  DriftMode,
  IntegrationProtocolSpec,
  RuleCategory,
  RoutingRule,
  SourceChannel,
  SourceInstitution,
  TransactionType,
  TlsMode,
  VasStage,
} from "./data";
import {
  Badge,
  ButtonGhost,
  ButtonPrimary,
  FieldLabel,
  Modal,
  PanelTitle,
  inputCls,
  selectCls,
  Toggle,
} from "./ui";

function fmtMoney(value: number): string {
  return value.toLocaleString("en-US");
}

function fmtSocket(rule: RoutingRule): string {
  return `${rule.hostIp}:${rule.hostPort}`;
}

function compactInstitution(name: SourceInstitution): string {
  return name === "CBI" ? "CBI" : name;
}

function tlsSummary(mode: TlsMode): string {
  if (mode.startsWith("mTLS")) return "mTLS Active";
  if (mode.startsWith("One-Way")) return "One-Way TLS";
  return "TCP Direct";
}

function socketSummary(mode: TlsMode, certName: string): string {
  if (mode === "None / TCP Direct") return "TCP Direct — no certificate";
  return `${tlsSummary(mode)} · ${certName}`;
}

function nextRuleId(existing: string[]): string {
  const max = existing.reduce((acc, id) => {
    const n = Number(id.replace(/\D/g, ""));
    return Number.isFinite(n) ? Math.max(acc, n) : acc;
  }, 0);
  return `R-${String(max + 1).padStart(3, "0")}`;
}

function StepBadge({ index, title }: { index: number; title: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-emerald-500/15 font-mono text-[11px] font-bold text-emerald-300 ring-1 ring-inset ring-emerald-500/30">
        {index}
      </span>
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
        {title}
      </span>
    </div>
  );
}

function PillButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
        active
          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
          : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
      }`}
    >
      {children}
    </button>
  );
}

function RuleCard({ rule }: { rule: RoutingRule }) {
  const hasThreshold =
    typeof rule.amountThresholdIqd === "number" && rule.amountThresholdIqd > 0;

  const leftSpec = rule.category === "Transaction Route"
    ? rule.transactionType
    : "VAS Request";
  const dccTag = rule.dccEnabled && rule.dccProvider
    ? ` [DCC: ${rule.dccProvider}]`
    : "";

  return (
    <div className="rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
      <div className="flex items-center justify-between gap-3">
        <Badge tone={rule.tone}>{rule.id}</Badge>
        <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {rule.category}
        </span>
      </div>

      <h4 className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
        {rule.name}
      </h4>

      <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2.5 font-mono text-[11.5px] text-slate-700 dark:text-slate-300">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-1.5 py-0.5 font-sans font-semibold text-emerald-600 dark:text-emerald-300">
          <Plug className="h-3 w-3" />
          {compactInstitution(rule.sourceInstitution)}
        </span>
        <span className="text-slate-400 dark:text-slate-500">
          {rule.sourceChannel}
        </span>
        <span className="text-slate-400 dark:text-slate-500">·</span>
        <span>
          {leftSpec}
          {dccTag}
        </span>
        <ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate-400" />
        <span className="inline-flex items-center gap-1.5 rounded-md bg-sky-500/10 px-1.5 py-0.5 font-sans font-semibold text-sky-600 dark:text-sky-300">
          <Server className="h-3 w-3" />
          {rule.hostName}
        </span>
        <span className="text-slate-500 dark:text-slate-400">
          ({fmtSocket(rule)})
        </span>
      </div>

      {hasThreshold && (
        <p className="mt-2.5 text-xs text-slate-500 dark:text-slate-400">
          Ticket threshold:{" "}
          <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
            Amount &gt; {fmtMoney(rule.amountThresholdIqd!)} IQD
          </span>
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <Badge tone="amber">
          <Braces className="h-3 w-3" />
          {rule.mediationType}
        </Badge>
        <Badge tone={rule.tlsMode === "None / TCP Direct" ? "red" : "green"}>
          <ShieldCheck className="h-3 w-3" />
          {tlsSummary(rule.tlsMode)}
        </Badge>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 border-slate-200 dark:border-slate-800 pt-3 text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <span className="flex items-center gap-1.5">
          <GitBranch className="h-3.5 w-3.5" />
          Orchestration Core · {rule.evaluatedMs}ms
        </span>
        <span className="flex items-center gap-1.5">
          <Route className="h-3.5 w-3.5" />
          {rule.matchRate}% match
        </span>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  hint,
  className = "",
}: {
  label: string;
  children: ReactNode;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <FieldLabel>{label}</FieldLabel>
      {children}
      {hint && (
        <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
          {hint}
        </p>
      )}
    </div>
  );
}

interface IntegrationRequest {
  switchName: string;
  spec: IntegrationProtocolSpec;
  targetIp: string;
  port: string;
  timeoutMs: string;
  mtls: boolean;
  keyMaterial: boolean;
  dukpt: boolean;
  specUrl: string;
}

const emptyIntegration: IntegrationRequest = {
  switchName: "",
  spec: "ISO 8583",
  targetIp: "",
  port: "7010",
  timeoutMs: "8000",
  mtls: true,
  keyMaterial: true,
  dukpt: false,
  specUrl: "",
};

const integrationSecurityOptions = [
  { key: "mtls", label: "mTLS", desc: "Client + server certs" },
  {
    key: "keyMaterial",
    label: "MK / WK (ZMK/ZPK)",
    desc: "Master & working key exchange",
  },
  {
    key: "dukpt",
    label: "DUKPT",
    desc: "Per-transaction key derivation",
  },
] as const;

function IntegrationRequestModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: () => void;
}) {
  const [form, setForm] = useState<IntegrationRequest>(emptyIntegration);

  const patch = (partial: Partial<IntegrationRequest>) =>
    setForm((f) => ({ ...f, ...partial }));

  const canSubmit =
    form.switchName.trim().length > 0 && form.targetIp.trim().length > 0;

  return (
    <Modal
      open={true}
      onClose={onClose}
      maxWidth="max-w-2xl"
      title={
        <span className="flex items-center gap-2">
          <Plug className="h-4 w-4 text-sky-400" />
          Request New Destination Integration
        </span>
      }
    >
      <div className="space-y-5">
        <p className="rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs text-slate-500 dark:text-slate-400">
          Intake only — Switch Engineering provisions the outbound socket,
          validates the specification, and returns a deployable destination.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Destination Switch Name" className="sm:col-span-2">
            <input
              className={inputCls}
              value={form.switchName}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                patch({ switchName: e.target.value })
              }
              placeholder="e.g. Al-Rafidain Core"
            />
          </Field>

          <Field label="Target Protocol Specification">
            <select
              className={selectCls}
              value={form.spec}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                patch({ spec: e.target.value as IntegrationProtocolSpec })
              }
            >
              <option>ISO 8583</option>
              <option>AS 2805</option>
              <option>Custom Binary</option>
              <option>XML/SOAP</option>
            </select>
          </Field>

          <Field label="Connection Timeout (ms)">
            <input
              className={`${inputCls} font-mono`}
              value={form.timeoutMs}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                patch({ timeoutMs: e.target.value })
              }
              placeholder="8000"
            />
          </Field>

          <Field label="Target IP">
            <input
              className={`${inputCls} font-mono`}
              value={form.targetIp}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                patch({ targetIp: e.target.value })
              }
              placeholder="196.21.x.x"
            />
          </Field>

          <Field label="Target Port">
            <input
              className={`${inputCls} font-mono`}
              value={form.port}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                patch({ port: e.target.value })
              }
              placeholder="7010"
            />
          </Field>
        </div>

        <div className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4">
          <div className="mb-3 flex items-center gap-2">
            <KeyRound className="h-3.5 w-3.5 text-emerald-400" />
            <p className="text-sm font-medium text-slate-900 dark:text-slate-200">
              Security Requirements
            </p>
          </div>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            {integrationSecurityOptions.map((opt) => {
              const on = form[opt.key];
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => patch({ [opt.key]: !on })}
                  className={`flex items-start gap-2 rounded-lg border px-3 py-2.5 text-left transition ${
                    on
                      ? "border-emerald-500/40 bg-emerald-500/10"
                      : "border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                      on
                        ? "border-emerald-500 bg-emerald-500"
                        : "border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-950"
                    }`}
                  >
                    {on && (
                      <CheckCircle2 className="h-3.5 w-3.5 text-slate-950" />
                    )}
                  </span>
                  <span>
                    <span
                      className={`block text-xs font-semibold ${
                        on
                          ? "text-emerald-700 dark:text-emerald-300"
                          : "text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {opt.label}
                    </span>
                    <span className="block text-[10.5px] text-slate-500 dark:text-slate-400">
                      {opt.desc}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <Field label="Specification URL" className="grid grid-cols-1 gap-2">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 shrink-0 text-slate-400" />
            <input
              className={inputCls}
              value={form.specUrl}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                patch({ specUrl: e.target.value })
              }
              placeholder="https://docs.switch-eng.example/spec-al-rafidain.pdf"
            />
          </div>
        </Field>

        <div>
          <FieldLabel>Specification Document Upload</FieldLabel>
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-slate-400 bg-white dark:border-slate-600 dark:bg-slate-950 px-3 py-4 text-xs text-slate-500 dark:text-slate-400 transition hover:border-emerald-500/50 hover:text-emerald-300">
            <Upload className="h-4 w-4" />
            Drop .pdf / .docx specification, or click to browse
            <input
              type="file"
              accept=".pdf,.docx,.xlsx,.txt"
              className="hidden"
              onChange={() => undefined}
            />
          </label>
        </div>

        <div className="flex justify-end gap-2 border-slate-200 dark:border-slate-800 pt-3 dark:border-slate-800">
          <ButtonGhost onClick={onClose}>Cancel</ButtonGhost>
          <ButtonPrimary
            disabled={!canSubmit}
            onClick={() => {
              onClose();
              onSubmit();
            }}
          >
            <Send className="h-4 w-4" />
            Submit Integration Request
          </ButtonPrimary>
        </div>
      </div>
    </Modal>
  );
}

function Toast({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-6 right-6 z-[80]">
      <div className="flex items-center gap-2.5 rounded-xl border-slate-700 bg-slate-900 px-4 py-3 text-sm font-medium text-slate-100 shadow-2xl ring-1 ring-emerald-500/30">
        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
        {message}
      </div>
    </div>
  );
}

export default function RulesTab() {
  const [rules, setRules] = useState<RoutingRule[]>(routingRules);

  const [category, setCategory] = useState<RuleCategory>("Transaction Route");
  const [txType, setTxType] = useState<TransactionType>("0200 - Sale / Purchase");
  const [vasStage, setVasStage] = useState<VasStage>("Synchronous In-Flight (Pre-Host)");
  const [dccEnabled, setDccEnabled] = useState(false);
  const [dccProvider, setDccProvider] = useState<DccProvider>("QiCard DCC Middleware");

  const [institution, setInstitution] = useState<SourceInstitution>("QiCard");
  const [channel, setChannel] = useState<SourceChannel>("POS Terminal");
  const [useThreshold, setUseThreshold] = useState(false);
  const [threshold, setThreshold] = useState("1,000,000");

  const destinationOptions = useMemo(
    () => destinationOptionsFor(category),
    [category]
  );

  const [destinationId, setDestinationId] = useState<string>(
    destinationOptions[0].id
  );
  const [hostName, setHostName] = useState(destinationOptions[0].hostName);
  const [hostIp, setHostIp] = useState(destinationOptions[0].hostIp);
  const [hostPort, setHostPort] = useState(destinationOptions[0].hostPort);
  const [tlsMode, setTlsMode] = useState<TlsMode>(destinationOptions[0].tlsMode);
  const [certName, setCertName] = useState(destinationOptions[0].certName);
  const [outboundProtocol, setOutboundProtocol] = useState(
    destinationOptions[0].outboundProtocol
  );
  const [mediationType, setMediationType] = useState(
    destinationOptions[0].mediationType
  );

  const [mode, setMode] = useState<DriftMode>("Warn-and-Allow");
  const [enforce, setEnforce] = useState(true);
  const [dryRun, setDryRun] = useState(false);
  const [integrationOpen, setIntegrationOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const selectedDestination =
    destinationHosts.find((h) => h.id === destinationId) ??
    destinationOptions[0];

  function selectCategory(nextCategory: RuleCategory) {
    setCategory(nextCategory);
    const options = destinationOptionsFor(nextCategory);
    const seed = options[0];
    setDestinationId(seed.id);
    setHostName(seed.hostName);
    setHostIp(seed.hostIp);
    setHostPort(seed.hostPort);
    setTlsMode(seed.tlsMode);
    setCertName(seed.certName);
    setOutboundProtocol(seed.outboundProtocol);
    setMediationType(seed.mediationType);
  }

  function selectDestination(id: string) {
    const seed = destinationOptions.find((d) => d.id === id) ?? destinationOptions[0];
    setDestinationId(seed.id);
    setHostName(seed.hostName);
    setHostIp(seed.hostIp);
    setHostPort(seed.hostPort);
    setTlsMode(seed.tlsMode);
    setCertName(seed.certName);
    setOutboundProtocol(seed.outboundProtocol);
    setMediationType(seed.mediationType);
  }

  function saveRule() {
    const parsedPort = Number(hostPort);
    const parsedThreshold = Number(threshold.replace(/[^0-9.]/g, ""));
    const specLabel = category === "Transaction Route" ? txType : vasStage;

    const rule: RoutingRule = {
      id: nextRuleId(rules.map((r) => r.id)),
      name: `${institution} / ${channel} / ${selectedDestination.label}`,
      category,
      sourceInstitution: institution,
      sourceChannel: channel,
      transactionType: category === "Transaction Route" ? txType : undefined,
      vasStage: category === "VAS Service Route" ? vasStage : undefined,
      useThreshold,
      amountThresholdIqd:
        useThreshold && Number.isFinite(parsedThreshold) ? parsedThreshold : undefined,
      dccEnabled,
      dccProvider: dccEnabled ? dccProvider : undefined,
      destinationId,
      hostName: hostName || selectedDestination.hostName,
      hostIp: hostIp || selectedDestination.hostIp,
      hostPort: Number.isFinite(parsedPort) && parsedPort > 0 ? parsedPort : 7010,
      destProtocol: outboundProtocol,
      tlsMode,
      certName: tlsMode === "None / TCP Direct" ? "" : certName,
      mediationType,
      tone: category === "Transaction Route" ? "emerald" : "amber",
      matchRate: 0,
      evaluatedMs: 14,
      updatedAt: "just now",
    };

    setRules((prev) => [rule, ...prev]);
    setToast(`Rule ${rule.id} deployed to Orchestration Core`);
    void specLabel;
  }

  return (
    <div className="space-y-5">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Active Institutional Routing Deck
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              Multi-tenant protocol mediation · transaction + VAS destination matrix
            </p>
          </div>
          <Badge tone="green" dot pulse>
            {rules.length} rules live
          </Badge>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {rules.map((r) => (
            <RuleCard key={r.id} rule={r} />
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-900">
        <PanelTitle
          title="Rule Builder"
          subtitle="Compose rule type, source criteria, then bind a mediated destination"
          right={
            <Badge tone="blue">{nextRuleId(rules.map((r) => r.id))}</Badge>
          }
        />

        <div className="space-y-5 p-6">
          <div className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <StepBadge index={1} title="Rule Type & Processing Specification" />
              <span className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                <Workflow className="h-3.5 w-3.5" />
                Transaction vs VAS service path
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(220px,260px)_1fr]">
              <Field label="Rule Category">
                <div className="flex flex-wrap gap-2">
                  {(["Transaction Route", "VAS Service Route"] as RuleCategory[]).map((c) => (
                    <PillButton key={c} active={category === c} onClick={() => selectCategory(c)}>
                      {c}
                    </PillButton>
                  ))}
                </div>
              </Field>

              {category === "Transaction Route" ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Transaction Type">
                      <select
                        className={selectCls}
                        value={txType}
                        onChange={(e) => setTxType(e.target.value as TransactionType)}
                      >
                        {transactionTypes.map((v) => (
                          <option key={v}>{v}</option>
                        ))}
                      </select>
                    </Field>

                    <Field label="Dynamic Currency Conversion (DCC)">
                      <div className="flex items-center justify-between rounded-lg border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2">
                        <span className="text-sm text-slate-600 dark:text-slate-300">
                          Enable DCC routing
                        </span>
                        <Toggle on={dccEnabled} onChange={setDccEnabled} />
                      </div>
                    </Field>
                  </div>

                  {dccEnabled && (
                    <Field label="DCC Provider Middleware">
                      <select
                        className={selectCls}
                        value={dccProvider}
                        onChange={(e) => setDccProvider(e.target.value as DccProvider)}
                      >
                        {dccProviders.map((v) => (
                          <option key={v}>{v}</option>
                        ))}
                      </select>
                    </Field>
                  )}
                </div>
              ) : (
                <Field label="VAS Processing Stage">
                  <select
                    className={selectCls}
                    value={vasStage}
                    onChange={(e) => setVasStage(e.target.value as VasStage)}
                  >
                    {vasStages.map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </Field>
              )}
            </div>
          </div>

          <div className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <StepBadge index={2} title="Source Criteria" />
              <span className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                <Plug className="h-3.5 w-3.5" />
                Tenant / channel / threshold
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Source Institution">
                <select
                  className={selectCls}
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value as SourceInstitution)}
                >
                  {sourceInstitutions.map((v) => (
                    <option key={v}>{v === "CBI" ? "CBI (Commercial Bank of Iraq)" : v}</option>
                  ))}
                </select>
              </Field>

              <Field label="Source Channel">
                <select
                  className={selectCls}
                  value={channel}
                  onChange={(e) => setChannel(e.target.value as SourceChannel)}
                >
                  {sourceChannels.map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-900">
              <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={useThreshold}
                  onChange={(e) => setUseThreshold(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 accent-emerald-500"
                />
                Amount ticket threshold
              </label>
              {useThreshold && (
                <span className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Amount &gt;
                  </span>
                  <input
                    value={threshold}
                    onChange={(e) => setThreshold(e.target.value)}
                    className="w-28 rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-1.5 font-mono text-sm text-slate-900 dark:text-slate-200 outline-none transition focus:border-emerald-500/60 focus:ring-emerald-500/20"
                  />
                  <span className="text-xs text-slate-500 dark:text-slate-400">IQD</span>
                </span>
              )}
            </div>
          </div>

          <div className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <StepBadge index={3} title="Mediated Destination Criteria" />
              <span className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                <Network className="h-3.5 w-3.5" />
                Predefined host matrix
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Destination Host / Service">
                <select
                  className={selectCls}
                  value={destinationId}
                  onChange={(e) => selectDestination(e.target.value)}
                >
                  {destinationOptions.map((d) => (
                    <option key={d.id}>{d.label}</option>
                  ))}
                </select>
              </Field>

              <Field label="Outbound Protocol">
                <input className={inputCls} value={outboundProtocol} readOnly />
              </Field>

              <Field label="Target Hostname">
                <input className={inputCls} value={hostName} readOnly />
              </Field>

              <Field label="Target IP">
                <input className={`${inputCls} font-mono`} value={hostIp} readOnly />
              </Field>

              <Field label="Target Port">
                <input className={`${inputCls} font-mono`} value={hostPort} readOnly />
              </Field>

              <Field label="TLS Security">
                <input className={inputCls} value={tlsMode} readOnly />
              </Field>

              <Field label="Client Certificate / Secret">
                <input className={inputCls} value={certName} readOnly />
              </Field>

              <Field label="Mediation Pipeline">
                <span className="inline-flex w-full items-center gap-2 rounded-full bg-amber-500/10 px-3.5 py-2 text-xs font-semibold text-amber-300 ring-1 ring-inset ring-amber-500/30">
                  <Braces className="h-3.5 w-3.5" />
                  {mediationType}
                </span>
              </Field>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2.5 rounded-lg border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2.5 font-mono text-xs text-slate-700 dark:text-slate-300">
              <Cable className="h-3.5 w-3.5 text-sky-400" />
              <span className="font-sans font-semibold text-slate-900 dark:text-slate-100">
                {hostName}
              </span>
              <span>{hostIp}:{hostPort}</span>
              <Wifi
                className={`h-3.5 w-3.5 ${
                  tlsMode === "None / TCP Direct"
                    ? "text-rose-400"
                    : "text-emerald-400"
                }`}
              />
              <span className="font-sans">{socketSummary(tlsMode, certName)}</span>
            </div>
          </div>

          <div className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4">
            <p className="mb-3 text-sm font-medium text-slate-900 dark:text-slate-200">
              Parameter Drift Enforcement
            </p>
            <div className="flex flex-wrap gap-2">
              {(["Warn-and-Allow", "Strict Reject"] as const).map((m) => (
                <PillButton key={m} active={mode === m} onClick={() => setMode(m)}>
                  {m}
                </PillButton>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between rounded-lg bg-white dark:bg-slate-900 px-3 py-2">
              <span className="text-slate-500 dark:text-slate-400">
                Auto-failover on drift when host unreachable
              </span>
              <Toggle on={enforce} onChange={setEnforce} />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-slate-200 dark:border-slate-800 pt-1 dark:border-slate-800">
            <p className="font-mono text-[12.5px] text-slate-300">
              [{institution}] {channel} ·{" "}
              {category === "Transaction Route" ? txType : vasStage}
              {dccEnabled ? ` [DCC: ${dccProvider}]` : ""} ──► {hostName} ({hostIp}:{hostPort}) · JSON ──► {mediationType}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <ButtonGhost onClick={() => setDryRun(true)}>
                <Play className="h-4 w-4" />
                Dry-Run Simulation
              </ButtonGhost>
              <ButtonGhost onClick={() => setIntegrationOpen(true)}>
                <Plus className="h-4 w-4" />
                Request New Destination Integration
              </ButtonGhost>
              <ButtonPrimary onClick={saveRule}>
                <Rocket className="h-4 w-4" />
                Save & Deploy Rule
              </ButtonPrimary>
            </div>
          </div>
        </div>
      </div>

      {integrationOpen && (
        <IntegrationRequestModal
          onClose={() => setIntegrationOpen(false)}
          onSubmit={() => {
            setToast("Integration request dispatched to Switch Engineering Team");
            setIntegrationOpen(false);
          }}
        />
      )}

      <Modal
        open={dryRun}
        onClose={() => setDryRun(false)}
        title={
          <span className="flex items-center gap-2">
            <Beaker className="h-4 w-4 text-emerald-400" />
            Dry-Run Simulation
          </span>
        }
      >
        <div className="space-y-4">
          <div className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 text-center">
            <p className="font-mono text-slate-700 dark:text-slate-300">
              100 Synthetic ISO messages tested
            </p>
            <div className="mt-2 flex items-center justify-center gap-6">
              <div>
                <p className="font-mono text-2xl font-semibold text-emerald-400">98%</p>
                <p className="text-slate-500 dark:text-slate-400">Route Match</p>
              </div>
              <div>
                <p className="font-mono text-2xl font-semibold text-amber-400">+12ms</p>
                <p className="text-slate-500 dark:text-slate-400">
                  Avg Latency
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <Route className="h-4 w-4 text-emerald-400" />
            No live traffic affected — simulation only.
          </div>
          <div className="flex justify-end">
            <ButtonGhost onClick={() => setDryRun(false)}>Close</ButtonGhost>
          </div>
        </div>
      </Modal>

      <Toast message={toast} />
    </div>
  );
}

