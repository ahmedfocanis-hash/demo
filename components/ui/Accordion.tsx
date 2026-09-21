"use client";

import { ChevronDown } from "lucide-react";
import { useState, type ReactNode } from "react";

export type AccordionItem = {
  id: string;
  title: string;
  content: ReactNode;
};

export default function Accordion({
  items,
  defaultOpenId,
}: {
  items: AccordionItem[];
  defaultOpenId?: string;
}) {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? null);

  return (
    <div className="divide-sand-wash overflow-hidden rounded-2xl border-sand-wash bg-paper-white ">
      {items.map((item) => {
        const open = openId === item.id;
        return (
          <div key={item.id}>
            <button
              onClick={() => setOpenId(open ? null : item.id)}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition-all duration-150 hover:bg-slate-800/40 active:scale-[0.995] cursor-pointer "
            >
              <span className="text-sm font-medium text-slate-200 ">
                {item.title}
              </span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-ash-grey transition-transform duration-200 ${
                  open ? "rotate-180 text-emerald-green" : ""
                }`}
              />
            </button>
            {open && (
              <div className="animate-fade-in-up border-sand-wash/60 px-4 py-3.5 text-xs leading-relaxed text-ash-grey ">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
