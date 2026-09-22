import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Sidebar, { personaTabs, tabs } from "./Sidebar";
import type { Persona } from "./data";

const baseProps = {
  active: "transactions" as const,
  onSelect: () => {},
  persona: "acquirer" as Persona,
};

describe("Sidebar", () => {
  it("acquirer sees every declared tab", () => {
    render(<Sidebar {...baseProps} />);
    for (const t of tabs) {
      // Nav label appears inside a <button>
      expect(screen.getByRole("button", { name: new RegExp(t.label, "i") })).toBeInTheDocument();
    }
  });

  it("merchant sees only a subset of tabs", () => {
    render(<Sidebar {...baseProps} persona="merchant" />);
    for (const id of personaTabs.merchant) {
      const label = tabs.find((t) => t.id === id)!.label;
      expect(screen.getByRole("button", { name: new RegExp(label, "i") })).toBeInTheDocument();
    }
    const absentIds = tabs.map((t) => t.id).filter((id) => !personaTabs.merchant.includes(id));
    for (const id of absentIds) {
      const label = tabs.find((t) => t.id === id)!.label;
      expect(screen.queryByRole("button", { name: new RegExp(label, "i") })).toBeNull();
    }
  });

  it("marks the active tab with an accent class", () => {
    render(<Sidebar {...baseProps} active="settlement" />);
    const btn = screen.getByRole("button", { name: /Settlement/i }) as HTMLButtonElement;
    expect(btn.className).toContain("signal-orange");
  });

  it("fires onSelect with the tab id on click", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Sidebar {...baseProps} onSelect={onSelect} />);
    await user.click(screen.getByRole("button", { name: /Routing Rules/i }));
    expect(onSelect).toHaveBeenCalledWith("rules");
  });

  it("mobile overlay is hidden by default", () => {
    render(<Sidebar {...baseProps} />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("renders a dialog when mobileOpen is true", () => {
    render(<Sidebar {...baseProps} mobileOpen />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Close menu" })).toBeInTheDocument();
  });

  it("closes mobile overlay on close button click", async () => {
    const user = userEvent.setup();
    const onCloseMobile = vi.fn();
    render(<Sidebar {...baseProps} mobileOpen onCloseMobile={onCloseMobile} />);
    await user.click(screen.getByRole("button", { name: "Close menu" }));
    expect(onCloseMobile).toHaveBeenCalledTimes(1);
  });

  it("closing via a nav click calls both onSelect and onCloseMobile", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const onCloseMobile = vi.fn();
    render(
      <Sidebar {...baseProps} mobileOpen onSelect={onSelect} onCloseMobile={onCloseMobile} />
    );
    // Desktop nav (matches[0]) does not close mobile; only the mobile overlay's NavContent does.
    const matches = screen.getAllByRole("button", { name: /Live Transactions/i });
    await user.click(matches[1]);
    expect(onSelect).toHaveBeenCalledWith("transactions");
    expect(onCloseMobile).toHaveBeenCalled();
  });
});
