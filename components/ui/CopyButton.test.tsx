import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import CopyButton from "./CopyButton";

describe("CopyButton", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("renders default label and copy icon state", () => {
    render(<CopyButton value="abc123" />);
    expect(screen.getByRole("button", { name: /Copy/i })).toBeInTheDocument();
  });

  it("uses custom label when provided", () => {
    render(<CopyButton value="abc" label="Copy ID" />);
    expect(screen.getByRole("button", { name: /Copy ID/i })).toBeInTheDocument();
  });

  it("writes the value to the clipboard and switches to Copied! state", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
      writable: true,
    });
    render(<CopyButton value="hello-world" />);
    fireEvent.click(screen.getByRole("button"));
    expect(writeText).toHaveBeenCalledWith("hello-world");
    await waitFor(() =>
      expect(screen.getByText("Copied!")).toBeInTheDocument()
    );
  });

  it("falls back to execCommand when clipboard API is unavailable", async () => {
    // Remove the clipboard property entirely so CopyButton takes its fallback branch.
    Object.defineProperty(navigator, "clipboard", {
      value: undefined,
      configurable: true,
    });
    const execMock = vi.fn().mockReturnValue(true);
    Object.defineProperty(document, "execCommand", {
      value: execMock,
      configurable: true,
    });
    render(<CopyButton value="fallback-value" />);
    fireEvent.click(screen.getByRole("button"));
    expect(execMock).toHaveBeenCalledWith("copy");
    await waitFor(() =>
      expect(screen.getByText("Copied!")).toBeInTheDocument()
    );
  });

  it("reverts to Copy state after ~1.6s", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });
    render(<CopyButton value="x" label="Copy" />);
    fireEvent.click(screen.getByRole("button"));
    await waitFor(() => expect(screen.getByText("Copied!")).toBeInTheDocument());
    // Wait for the 1600ms reset timer to fire.
    await waitFor(
      () => expect(screen.getByText("Copy")).toBeInTheDocument(),
      { timeout: 2500 }
    );
  });
});
