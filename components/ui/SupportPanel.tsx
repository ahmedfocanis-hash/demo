"use client";

import { LifeBuoy, X } from "lucide-react";
import { useState } from "react";
import { withUtm } from "@/lib/utils";
import Accordion from "./Accordion";
import SecretInput from "./SecretInput";
import { ButtonPrimary } from "../dashboard/ui";

const faqs = [
  {
    id: "settlement-cutoff",
    title: "Settlement cutoff times",
    content:
      "EOD batch cutoff is 23:30 GST. Files are delivered to member banks within 30 minutes of cutoff. Late submissions roll to the next business day.",
  },
  {
    id: "host-reversal",
    title: "Host reversal windows",
    content:
      "SAF reversals (0400) are retried for up to 24 hours. After that, items escalate to the manual force-resolve queue under dual control.",
  },
  {
    id: "api-credentials",
    title: "Rotate API credentials",
    content:
      "Use the secret rotation panel below. New keys propagate within 5 minutes. Old keys remain valid for 24 hours to prevent downtime.",
  },
];

export default function SupportPanel() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Operational support"
        className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-green text-ink-roast shadow-emerald-green/30 transition-all duration-150 hover:brightness-110 active:scale-[0.95] cursor-pointer "
        title="Operational support"
      >
        <LifeBuoy className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[80]">
          <div
            className="absolute inset-0 bg-ink-roast/40 backdrop-blur-sm "
            onClick={() => setOpen(false)}
          />
          <aside className="animate-slide-in-right absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-sand-wash bg-paper-white shadow-2xl ">
            <div className="flex items-center justify-between border-sand-wash px-5 py-4 ">
              <div className="flex items-center gap-2">
                <LifeBuoy className="h-4.5 w-4.5 text-emerald-green " />
                <h2 className="text-sm font-semibold text-slate-100 ">
                  Operational Support
                </h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close support panel"
                className="rounded-lg p-1.5 text-ash-grey transition-all duration-150 hover:bg-slate-800 hover:text-slate-200 active:scale-[0.98] cursor-pointer "
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
            <div className="flex-1 space-y-5 overflow-y-auto p-5">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ash-grey ">
                  Operational FAQs
                </p>
                <Accordion items={faqs} defaultOpenId="settlement-cutoff" />
              </div>

              <div className="rounded-xl border-sand-wash bg-paper-white p-4 ">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ash-grey ">
                  API Credential
                </p>
                <SecretInput
                  label="Current Secret"
                  defaultValue="sk_live_bp_8f2c77aa19d4"
                />
                <div className="mt-3 flex justify-end">
                  <ButtonPrimary className="px-3 py-1.5 text-xs ">
                    Rotate Secret
                  </ButtonPrimary>
                </div>
              </div>

              <div className="rounded-xl border-sand-wash bg-paper-white p-4 ">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ash-grey ">
                  Partner Docs
                </p>
                <a
                  href={withUtm("https://example.com/partner-docs")}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-xs font-medium text-emerald-green underline-offset-2 transition-all duration-150 hover:underline "
                >
                  Integration runbooks & ISO 8583 specs →
                </a>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
