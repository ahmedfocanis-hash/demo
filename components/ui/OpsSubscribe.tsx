"use client";

import { Check } from "lucide-react";
import { useState } from "react";

export default function OpsSubscribe() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setDone(true);
  };

  return (
    <form onSubmit={submit} className="flex items-center gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="ops-alerts@company.com"
        className="w-56 rounded-lg border-slate-700 bg-slate-900 px-3 py-1.5 text-slate-200 outline-none transition focus:border-emerald-500/50 focus:ring-emerald-500/20 "
      />
      {done ? (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400 ">
          <Check className="h-4 w-4" /> Subscribed
        </span>
      ) : (
        <button
          type="submit"
          className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-slate-950 transition-all duration-150 hover:brightness-110 active:scale-[0.98] cursor-pointer "
        >
          Subscribe
        </button>
      )}
    </form>
  );
}
