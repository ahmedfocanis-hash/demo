"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function SecretInput({
  label,
  defaultValue = "",
  placeholder,
  className = "",
}: {
  label?: string;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className={className}>
      {label && (
        <label className="mb-1.5 block text-xs font-medium text-ash-grey ">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="w-full rounded-lg border-sand-wash bg-paper-white px-3.5 py-2 pr-10 font-mono text-slate-200 outline-none transition focus:border-emerald-green/50 focus:ring-emerald-green/20 "
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? "Hide secret" : "Show secret"}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-ash-grey transition-all duration-150 hover:bg-slate-800 hover:text-slate-200 active:scale-[0.95] cursor-pointer "
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
