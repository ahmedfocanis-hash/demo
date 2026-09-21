import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "./Header";
import type { Persona } from "./data";

describe("Header", () => {
  const baseProps = {
    persona: "acquirer" as Persona,
    onPersona: () => {},
    onToggleMobileMenu: () => {},
  };

  it("renders the brand wordmark", () => {
    render(<Header {...baseProps} />);
    expect(screen.getByText(/BeyondPayments/)).toBeInTheDocument();
    expect(screen.getByText("Gateway")).toBeInTheDocument();
  });

  it("renders three persona pills: Acquirer, PSP, Merchant", () => {
    render(<Header {...baseProps} />);
    expect(screen.getByRole("button", { name: /Acquirer Bank Ops/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Institution \/ PSP/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Merchant HQ/ })).toBeInTheDocument();
  });

  it("marks the current persona pill as active via accent class", () => {
    render(<Header {...baseProps} />);
    const acquirerBtn = screen.getByRole("button", { name: /Acquirer Bank Ops/ });
    // Active persona uses signal-orange class
    expect(acquirerBtn.className).toContain("signal-orange");
    const pspBtn = screen.getByRole("button", { name: /Institution \/ PSP/ });
    expect(pspBtn.className).not.toContain("signal-orange");
  });

  it("switches persona via onPersona callback", async () => {
    const user = userEvent.setup();
    const onPersona = vi.fn();
    render(<Header persona="acquirer" onPersona={onPersona} onToggleMobileMenu={() => {}} />);
    await user.click(screen.getByRole("button", { name: /Merchant HQ/ }));
    expect(onPersona).toHaveBeenCalledWith("merchant");
  });

  it("fires onToggleMobileMenu when the hamburger is clicked", async () => {
    const user = userEvent.setup();
    const onToggleMobileMenu = vi.fn();
    render(
      <Header
        persona="acquirer"
        onPersona={() => {}}
        onToggleMobileMenu={onToggleMobileMenu}
      />
    );
    await user.click(screen.getByRole("button", { name: "Open navigation" }));
    expect(onToggleMobileMenu).toHaveBeenCalledTimes(1);
  });

  it("shows the current persona label summary on wide viewports", () => {
    render(<Header persona="psp" onPersona={() => {}} onToggleMobileMenu={() => {}} />);
    expect(screen.getAllByText("Institution / PSP").length).toBeGreaterThanOrEqual(1);
  });
});
