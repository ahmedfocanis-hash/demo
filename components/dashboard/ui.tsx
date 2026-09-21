"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";

/* ================================================
   Badge — restrained Jeton tones
   Only the `dot` keeps a semantic color hint; the
   surface + text is always sand-wash + ink-roast.
   ================================================ */

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
  | "neutral"
  | "orange";

const toneSurface: Record<BadgeTone, string> = {
  orange: "bg-[rgba(247,59,32,0.08)] text-signal-orange ring-signal-orange/25",
  green: "bg-sand-wash/60 text-ink-roast ring-sand-wash",
  emerald: "bg-sand-wash/60 text-ink-roast ring-sand-wash",
  red: "bg-[rgba(251,45,84,0.08)] text-ink-roast ring-coral-red/25",
  rose: "bg-[rgba(251,45,84,0.08)] text-ink-roast ring-coral-red/25",
  amber: "bg-[rgba(247,59,32,0.08)] text-ink-roast ring-signal-orange/20",
  blue: "bg-[rgba(71,126,233,0.08)] text-ink-roast ring-cobalt-blue/25",
  cyan: "bg-[rgba(71,126,233,0.08)] text-ink-roast ring-cobalt-blue/25",
  violet: "bg-[rgba(71,126,233,0.08)] text-ink-roast ring-cobalt-blue/25",
  slate: "bg-sand-wash/60 text-ink-roast ring-sand-wash",
  neutral: "bg-sand-wash/60 text-ink-roast ring-sand-wash",
};

/* Semantic dot colors — kept muted and small, only as an
   auxiliary cue, never as the primary signal. */
const dotColor: Record<BadgeTone, string> = {
  orange: "bg-signal-orange",
  green: "bg-emerald-green",
  emerald: "bg-emerald-green",
  red: "bg-coral-red",
  rose: "bg-coral-red",
  amber: "bg-signal-orange",
  blue: "bg-cobalt-blue",
  cyan: "bg-cobalt-blue",
  violet: "bg-cobalt-blue",
  slate: "bg-ash-grey",
  neutral: "bg-ash-grey",
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
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium tracking-[0.03em] ring-1 ring-inset ${toneSurface[tone]}`}
    >
      {dot && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${dotColor[tone]} ${pulse ? "pulse-dot" : ""}`}
        />
      )}
      {children}
    </span>
  );
}

/* ================================================
   PanelTitle — section header with typography-led hierarchy
   ================================================ */

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
    <div className="flex items-start justify-between gap-4 px-5 py-4">
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <h3 className="text-[17px] font-medium leading-tight tracking-[-0.01em] text-ink-roast">
            {title}
          </h3>
          <span className="text-[11px] font-medium uppercase tracking-[0.03em] text-ash-grey">
            Updated · {updated}
          </span>
        </div>
        {subtitle && (
          <p className="mt-1 text-sm text-ash-grey">{subtitle}</p>
        )}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}

/* ================================================
   Buttons — Jeton primary / ghost / outline
   ================================================ */

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
      className={`inline-flex items-center justify-center gap-2 rounded-[12px] bg-signal-orange px-4 py-2 text-sm font-medium tracking-[0.03em] text-white transition-all duration-150 hover:bg-brand-orange-tint active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
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
      className={`inline-flex items-center justify-center gap-2 rounded-[8px] border border-signal-orange/60 bg-transparent px-3.5 py-2 text-sm font-medium tracking-[0.03em] text-signal-orange transition-all duration-150 hover:bg-[rgba(247,59,32,0.05)] active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

export function ButtonOutline({
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
      className={`inline-flex items-center justify-center gap-2 rounded-[12px] border border-sand-wash bg-paper-white px-3.5 py-2 text-sm font-medium tracking-[0.03em] text-ink-roast transition-all duration-150 hover:border-ash-grey/60 hover:bg-sand-wash/40 active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

export function ButtonWhitePill({
  children,
  onClick,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-[84px] border border-sand-wash bg-transparent px-4 py-1.5 text-sm font-medium tracking-[0.03em] text-ink-roast transition-all duration-150 hover:bg-sand-wash/40 active:scale-[0.98] cursor-pointer ${className}`}
    >
      {children}
    </button>
  );
}

/* ================================================
   Toggle / switch
   ================================================ */

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
          on ? "bg-signal-orange" : "bg-sand-wash"
        }`}
      >
        <span
          className="absolute top-0.5 h-4.5 w-4.5 rounded-full bg-white shadow-[rgba(0,0,0,0.04)_0_2px_8px_-2px] transition-all"
          style={{ left: on ? 20 : 2 }}
        />
      </span>
      {label && (
        <span className="text-sm font-medium text-ink-roast">{label}</span>
      )}
    </button>
  );
}

/* ================================================
   Drawer (slide-over)
   ================================================ */

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
        className="absolute inset-0 bg-ink-roast/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <aside
        className={`absolute right-0 top-0 flex h-full w-full ${width}animate-slide-in-right flex-col bg-paper-white shadow-[var(--shadow-floating)]`}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <div className="min-w-0 truncate text-[23px] font-medium leading-tight tracking-[-0.01em] text-ink-roast">
            {title}
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-[8px] p-2 text-ash-grey transition hover:bg-sand-wash/60 hover:text-ink-roast"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </aside>
    </div>
  );
}

/* ================================================
   Modal
   ================================================ */

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
        className="absolute inset-0 bg-ink-roast/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`relative flex max-h-[90vh] w-full flex-col ${maxWidth}animate-modal-pop rounded-[16px] bg-paper-white shadow-[var(--shadow-floating)]`}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <div className="min-w-0 truncate text-[23px] font-medium leading-tight tracking-[-0.01em] text-ink-roast">
            {title}
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-[8px] p-2 text-ash-grey transition hover:bg-sand-wash/60 hover:text-ink-roast"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ================================================
   Form field helpers
   ================================================ */

export function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.03em] text-ash-grey">
      {children}
    </label>
  );
}

export const inputCls =
  "w-full rounded-[16px] bg-[rgba(247,59,32,0.05)] px-4 py-2.5 text-ink-roast placeholder:text-ash-grey outline-none transition focus:bg-[rgba(247,59,32,0.08)]";

export const selectCls =
  "w-full rounded-[12px] border border-sand-wash bg-paper-white px-3 py-2 text-ink-roast outline-none transition focus:border-signal-orange/40";