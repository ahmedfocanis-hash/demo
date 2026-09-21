import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import MetaMaskGuard from "../components/MetaMaskGuard";

function fireRejection(reason: unknown): { defaultPrevented: boolean } {
  const event = new CustomEvent("unhandledrejection", {
    bubbles: true,
    cancelable: true,
  });
  // jsdom CustomEvent does not ship a `reason` slot — attach it manually.
  (event as unknown as { reason: unknown }).reason = reason;
  window.dispatchEvent(event);
  return { defaultPrevented: event.defaultPrevented };
}

describe("MetaMaskGuard", () => {
  it("prevents default when a MetaMask rejection bubbles", () => {
    render(<MetaMaskGuard />);

    const { defaultPrevented } = fireRejection({
      message: "Failed to connect to MetaMask",
    });

    expect(defaultPrevented).toBe(true);
  });

  it("does NOT swallow unrelated rejections", () => {
    render(<MetaMaskGuard />);

    const { defaultPrevented } = fireRejection({
      message: "NetworkError: Failed to fetch",
    });

    expect(defaultPrevented).toBe(false);
  });

  it("prevents default when the stack mentions chrome-extension://", () => {
    render(<MetaMaskGuard />);

    const { defaultPrevented } = fireRejection({
      message: "Something broke",
      stack:
        "Error: Something broke\n    at chrome-extension://nhbbllf.../bg.js:12:34",
    });

    expect(defaultPrevented).toBe(true);
  });
});
