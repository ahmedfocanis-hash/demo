"use client";

import { AlertTriangle, X } from "lucide-react";
import type { ReactNode } from "react";

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  danger = true,
  children,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  danger?: boolean;
  children?: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm "
        onClick={onClose}
      />
      <div className="animate-modal-pop relative w-full max-w-md rounded-2xl border-slate-800 bg-slate-950 shadow-2xl ">
        <div className="flex items-center justify-between border-slate-800 px-5 py-4 ">
          <div className="flex items-center gap-2.5">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                danger
                  ? "bg-rose-500/10 text-rose-400 ring-rose-500/30"
                  : "bg-amber-500/10 text-amber-400 ring-amber-500/30"
              }`}
            >
              <AlertTriangle className="h-4 w-4" />
            </span>
            <h3 className="text-sm font-semibold text-slate-100 ">{title}</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-1.5 text-slate-400 transition-all duration-150 hover:bg-slate-800 hover:text-slate-200 active:scale-[0.98] cursor-pointer "
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>
        <div className="space-y-3 px-5 py-4">
          {description && (
            <p className="text-xs leading-relaxed text-slate-400 ">
              {description}
            </p>
          )}
          {children}
        </div>
        <div className="flex justify-end gap-2 border-slate-800 px-5 py-4 ">
          <button
            onClick={onClose}
            className="rounded-lg border-slate-700 bg-slate-900 px-3.5 py-2 text-sm font-medium text-slate-200 transition-all duration-150 hover:bg-slate-800 hover:brightness-110 active:scale-[0.98] cursor-pointer "
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition-all duration-150 active:scale-[0.98] cursor-pointer hover:brightness-110 ${
              danger
                ? "bg-rose-500 text-white shadow-rose-500/20"
                : "bg-amber-500 text-slate-950"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
