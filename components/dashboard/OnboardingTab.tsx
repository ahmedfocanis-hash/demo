"use client";

import { useState } from "react";
import {
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CloudUpload,
  Hash,
  Landmark,
  Plus,
  Send,
  Store,
  Users,
} from "lucide-react";
import {
  Badge,
  ButtonGhost,
  ButtonPrimary,
  FieldLabel,
  inputCls,
  PanelTitle,
  selectCls,
  Toggle,
} from "./ui";

const FEATURES = [
  { key: "loyalty", label: "Loynova Loyalty" },
  { key: "aqsati", label: "Aqsati Installments" },
  { key: "tasdeed", label: "Tasdeed Bill Pay" },
  { key: "preauth", label: "Cross-Terminal Pre-Auth" },
] as const;

export default function OnboardingTab() {
  const [step, setStep] = useState(0);
  const [tidCount, setTidCount] = useState(3);
  const [features, setFeatures] = useState({
    loyalty: true,
    aqsati: true,
    tasdeed: false,
    preauth: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [checkerOk, setCheckerOk] = useState(false);

  const canNext = step < 2 || checkerOk;
  const canPrev = step > 0;

  const next = () => {
    if (step === 2) {
      setSubmitted(true);
    } else {
      setStep((s) => s + 1);
    }
  };

  const reset = () => {
    setStep(0);
    setSubmitted(false);
    setCheckerOk(false);
  };

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-2xl border-sand-wash bg-paper-white ">
        <PanelTitle
          title="Merchant Onboarding & Propagation"
          subtitle="3-step wizard → downstream TMS / Switch / VAS sync"
          right={<Badge tone="violet">CFG-v2026.09.1</Badge>}
        />

        {/* Step indicator */}
        <div className="flex items-center gap-3 border-sand-wash px-5 py-4 ">
          {["Profile", "MID & TIDs", "Features & VAS"].map((label, i) => (
            <div key={label} className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold ${
                    i < step
                      ? "bg-emerald-green text-ink-roast"
                      : i === step
                      ? "bg-emerald-green/15 text-emerald-300 ring-emerald-green/40"
                      : "bg-slate-800 text-ash-grey"
                  }`}
                >
                  {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </span>
                <span
                  className={`text-xs font-medium ${
                    i === step ? "text-slate-100" : "text-ash-grey"
                  }`}
                >
                  {label}
                </span>
              </div>
              {i < 2 && <span className="h-px w-8 bg-slate-800 " />}
            </div>
          ))}
        </div>

        <div className="p-6">
          {!submitted ? (
            <>
              {/* Step 1 */}
              {step === 0 && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <FieldLabel>Legal Name</FieldLabel>
                    <input
                      className={inputCls}
                      defaultValue="Al-Noor Trading Company WLL"
                      placeholder="Registered legal name"
                    />
                  </div>
                  <div>
                    <FieldLabel>Trade Name</FieldLabel>
                    <input
                      className={inputCls}
                      defaultValue="Al-Noor Electronics"
                      placeholder="Trade / DBA name"
                    />
                  </div>
                  <div>
                    <FieldLabel>MCC</FieldLabel>
                    <select className={selectCls} defaultValue="5732">
                      <option value="5732">5732 · Electronics Store</option>
                      <option value="5411">5411 · Grocery</option>
                      <option value="5812">5812 · Restaurants</option>
                    </select>
                  </div>
                  <div>
                    <FieldLabel>City</FieldLabel>
                    <input
                      className={inputCls}
                      defaultValue="Baghdad"
                      placeholder="Operating city"
                    />
                  </div>
                </div>
              )}

              {/* Step 2 */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-xl border-sand-wash bg-paper-white px-4 py-3 ">
                    <div>
                      <p className="text-ash-grey">Merchant ID</p>
                      <p className="mt-0.5 flex items-center gap-2 font-mono text-lg font-semibold text-emerald-green ">
                        <Hash className="h-4 w-4" />
                        MID-772901-IRQ
                      </p>
                    </div>
                    <Badge tone="blue">Auto-generated</Badge>
                  </div>
                  <div>
                    <FieldLabel>Terminal (TID) Count</FieldLabel>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setTidCount((c) => Math.max(1, c - 1))}
                        className="rounded-lg border-sand-wash bg-paper-white px-3 py-2 text-ash-grey transition hover:bg-slate-800 "
                      >
                        −
                      </button>
                      <input
                        readOnly
                        value={tidCount}
                        className="w-20 text-center font-mono text-sm font-semibold text-slate-100 "
                      />
                      <button
                        onClick={() => setTidCount((c) => c + 1)}
                        className="rounded-lg border-sand-wash bg-paper-white px-3 py-2 text-ash-grey transition hover:bg-slate-800 "
                      >
                        +
                      </button>
                      <span className="ml-2 text-ash-grey ">
                        TIDs will be pre-provisioned as TID-77301…TID-{77300 + tidCount}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3 */}
              {step === 2 && (
                <div className="space-y-2">
                  {FEATURES.map((f) => (
                    <div
                      key={f.key}
                      className="flex items-center justify-between rounded-xl border-sand-wash bg-paper-white px-4 py-3 "
                    >
                      <span className="text-sm font-medium text-slate-200 ">
                        {f.label}
                      </span>
                      <Toggle
                        on={features[f.key]}
                        onChange={(v) => setFeatures((s) => ({ ...s, [f.key]: v }))}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Nav + checkers */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <ButtonGhost onClick={reset} disabled={!canPrev}>
                    <ChevronLeft className="h-4 w-4" /> Back
                  </ButtonGhost>
                  <div className="flex items-center gap-2">
                    <span className="text-ash-grey">Checker</span>
                    <Toggle on={checkerOk} onChange={setCheckerOk} />
                  </div>
                </div>
                <ButtonPrimary
                  onClick={next}
                  disabled={step === 2 && !checkerOk}
                >
                  {step === 2 ? (
                    <>
                      <Send className="h-4 w-4" /> Submit & Propagate
                    </>
                  ) : (
                    <>
                      Continue <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </ButtonPrimary>
              </div>
            </>
          ) : (
            /* ------------------------ Propagation sync ------------------------ */
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CloudUpload className="h-5 w-5 text-emerald-green " />
                <p className="text-sm font-semibold text-slate-100 ">
                  Propagation complete — downstream estate synced
                </p>
                <Badge tone="green" dot pulse>
                  Synced
                </Badge>
              </div>

              <div className="space-y-2">
                {[
                  { label: "TMS Platform", value: "[✓ Synced]" },
                  { label: "Core Switch", value: "[✓ Synced]" },
                  { label: "VAS Adapters", value: "[✓ Synced]" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="flex items-center justify-between rounded-xl border-sand-wash bg-paper-white px-4 py-3 "
                  >
                    <span className="flex items-center gap-2 text-sm font-medium text-slate-200 ">
                      <CheckCircle2 className="h-4 w-4 text-emerald-green " />
                      {s.label}
                    </span>
                    <span className="font-mono text-emerald-300 ">
                      {s.value}
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between rounded-xl border-emerald-green/20 bg-emerald-green/5 px-4 py-3 ">
                  <span className="flex items-center gap-2 text-sm font-medium text-slate-200 ">
                    <Landmark className="h-4 w-4 text-emerald-green " />
                    Config Revision
                  </span>
                  <span className="font-mono text-emerald-300 ">
                    CFG-v2026.09.1
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 border-sand-wash pt-4 ">
                <div className="flex -space-x-2">
                  <Users className="h-5 w-5 rounded-full bg-slate-800 p-1 text-ash-grey ring-slate-900 " />
                  <Users className="h-5 w-5 rounded-full bg-slate-800 p-1 text-ash-grey ring-slate-900 " />
                </div>
                <p className="text-ash-grey">
                  Sync initiated by Ops · Maker-Checker approved · audit ref
                  ONB-2417
                </p>
                <ButtonGhost onClick={reset} className="ml-auto">
                  <Plus className="h-4 w-4" /> New Onboarding
                </ButtonGhost>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}