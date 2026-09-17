"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function ScrollTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      className="animate-fade-in-up fixed bottom-24 right-6 z-40 flex h-10 w-10 items-center justify-center rounded-full border-slate-700 bg-slate-900/90 text-slate-300 shadow-xl backdrop-blur transition-all duration-150 hover:border-emerald-500/40 hover:text-emerald-300 hover:brightness-110 active:scale-[0.95] cursor-pointer "
    >
      <ArrowUp className="h-4.5 w-4.5" />
    </button>
  );
}
