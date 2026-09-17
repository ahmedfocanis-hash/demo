"use client";

import { useEffect } from "react";

export default function MetaMaskGuard() {
  useEffect(() => {
    const handleRejection = (event: PromiseRejectionEvent) => {
      const msg = event.reason?.message || "";
      const stack = event.reason?.stack || "";
      if (
        msg.includes("MetaMask") ||
        msg.includes("Failed to connect to MetaMask") ||
        stack.includes("chrome-extension://")
      ) {
        event.stopImmediatePropagation();
        event.preventDefault();
      }
    };

    window.addEventListener("unhandledrejection", handleRejection);
    return () => window.removeEventListener("unhandledrejection", handleRejection);
  }, []);

  return null;
}
