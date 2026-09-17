"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";

/* ---------------------------------- Badge ---------------------------------- */

type BadgeTone =
  | "green"
  | "red"
  | "amber"
  | "blue"
  | "slate"
  | "violet"
  | "cyan"
  | "emerald"
  | "rose"
  | "neutral";

const toneMap: Record<BadgeTone, string> = {
  green:
    "bg-emerald-500/10 text-emerald-400 ring-emerald-500/30 ",
  red: "bg-rose-500/10 text-rose-400 ring-rose-500/30 ",
  amber:
    "bg-amber-500/10 text-amber-400 ring-amber-500/30 ",
  blue: "bg-sky-500/10 text-sky-400 ring-sky-500/30 ",
  slate: "bg-slate-500/10 text-slate-500 dark:text-slate-400 ring-slate-500/30 ",
  emerald:
    "bg-emerald-500/10 text-emerald-400 ring-emerald-500/30 ",
  rose: "bg-rose-500/10 text-rose-400 ring-rose-500/30 ",
  neutral: "bg-slate-500/10 text-slate-500 dark:text-slate-400 ring-slate-500/30 ",
  violet:
    "bg-violet-500/10 text-violet-400 ring-violet-500/30 ",
  cyan: "bg-cyan-500/10 text-cyan-400 ring-cyan-500/30 ",
};

export function Badge({
  tone = "slate",
  dot = false,
  children,
  pulse = false,
}: {
  tone?: BadgeTone;
  dot?: boolean;
  pulse?: boolean;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-inset ${toneMap[tone]}`}
    >
      {dot && (
        <span
          className={`h-1.5 w-1.5 rounded-full bg-current ${
            pulse ? "pulse-dot" : ""
          }`}
        />
      )}
      {children}
    </span>
  );
}

/* ------------------------------ Section header ----------------------------- */

export function PanelTitle({
  title,
  subtitle,
  right,
  updated = "Sep 2026",
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  updated?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-slate-200 dark:border-slate-800 px-5 py-4 ">
      <div>
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 ">{title}</h3>
          <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:text-slate-400 ">
            Updated: {updated}
          </span>
        </div>
        {subtitle && (
          <p className="mt-0.5 text-slate-500 dark:text-slate-400 ">{subtitle}</p>
        )}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}

/* --------------------------------- Buttons --------------------------------- */

export function ButtonPrimary({
  children,
  onClick,
  className = "",
  disabled = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition-all duration-150 hover:bg-emerald-400 hover:brightness-110 active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

export function ButtonGhost({
  children,
  onClick,
  className = "",
  disabled = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm font-medium text-slate-900 dark:text-slate-200 transition-all duration-150 hover:border-slate-400 dark:hover:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-100 dark:bg-slate-800 hover:brightness-110 active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

/* ---------------------------- Toggle / switch ------------------------------ */

export function Toggle({
  on,
  onChange,
  label,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <button
      onClick={() => onChange(!on)}
      className="inline-flex items-center gap-2.5"
      aria-pressed={on}
    >
      <span
        className={`relative h-5.5 w-10 rounded-full transition-colors ${
          on ? "bg-emerald-500" : "bg-slate-700"
        }`}
      >
        <span
          className={`absolute top-0.5 h-4.5 w-4.5 rounded-full bg-white transition-all ${
            on ? "left-[20px]" : "left-0.5"
          }`}
        />
      </span>
      {label && (
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 ">{label}</span>
      )}
    </button>
  );
}

/* ------------------------- Drawer (slide-over) ----------------------------- */

export function Drawer({
  open,
  onClose,
  title,
  children,
  width = "w-full sm:w-[480px] md:w-[580px]",
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  width?: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm "
        onClick={onClose}
      />
      <aside
        className={`absolute right-0 top-0 flex h-full w-full ${width}animate-slide-in-right flex-col border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-2xl `}
      >
        <div className="flex items-center justify-between border-slate-200 dark:border-slate-800 px-4 py-4 sm:px-6 ">
          <div className="min-w-0 truncate text-sm font-semibold text-slate-900 dark:text-slate-100 ">{title}</div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-lg p-1.5 text-slate-500 dark:text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-100 dark:bg-slate-800 hover:text-slate-900 dark:text-slate-200 "
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </aside>
    </div>
  );
}

/* ------------------------------- Modal ------------------------------------- */

export function Modal({
  open,
  onClose,
  title,
  children,
  maxWidth = "max-w-lg",
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  maxWidth?: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm "
        onClick={onClose}
      />
      <div
        className={`relative flex max-h-[90vh] w-full flex-col ${maxWidth}animate-modal-pop rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl `}
      >
        <div className="flex items-center justify-between border-slate-200 dark:border-slate-800 px-4 py-4 sm:px-6 ">
          <div className="min-w-0 truncate text-sm font-semibold text-slate-900 dark:text-slate-100 ">{title}</div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-lg p-1.5 text-slate-500 dark:text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-100 dark:bg-slate-800 hover:text-slate-900 dark:text-slate-200 "
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
}

/* ------------------------- Form field helpers ------------------------------ */

export function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-slate-400 ">
      {children}
    </label>
  );
}

export const inputCls =
  "w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-slate-900 dark:text-slate-200 placeholder:text-slate-600 outline-none transition focus:border-emerald-500/60 focus:ring-emerald-500/20 ";

export const selectCls =
  "w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-slate-900 dark:text-slate-200 outline-none transition focus:border-emerald-500/60 focus:ring-emerald-500/20 ";