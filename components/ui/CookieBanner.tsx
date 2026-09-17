"use client";

import { Check } from "lucide-react";
import { useEffect, useState } from "react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("bp-cookie-consent")) setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-slate-800 bg-slate-950/95 backdrop-blur-md ">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <p className="text-slate-400">
          This platform uses telemetry cookies for fraud monitoring and
          operational analytics.
        </p>
        <button
          onClick={() => {
            localStorage.setItem("bp-cookie-consent", "accepted");
            setVisible(false);
          }}
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3.5 py-1.5 text-xs font-semibold text-slate-950 transition-all duration-150 hover:brightness-110 active:scale-[0.98] cursor-pointer "
        >
          <Check className="h-3.5 w-3.5" /> Accept
        </button>
      </div>
    </div>
  );
}
