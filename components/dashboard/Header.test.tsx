import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "./Header";
import type { AcquirerBank, Persona } from "./data";

describe("Header", () => {
  const baseProps = {
    persona: "acquirer" as Persona,
    onPersona: () => {},
    onToggleMobileMenu: () => {},
    selectedBank: "ALL" as AcquirerBank,
    onSelectBank: () => {},
  };

  it("renders the brand wordmark", () => {
    render(<Header {...baseProps} />);
    expect(screen.getByText(/BeyondPayments/)).toBeInTheDocument();
    expect(screen.getByText("Gateway")).toBeInTheDocument();
  });

  it("shows the default acquirer bank label", () => {
    render(<Header {...baseProps} />);
    expect(
      screen.getByRole("button", { name: /Acquirer: All Acquirers \(Consortium View\)/i })
    ).toBeInTheDocument();
  });

  it("opens the bank dropdown and renders all bank options", async () => {
    const user = userEvent.setup();
    render(<Header {...baseProps} />);
    await user.click(
      screen.getByRole("button", { name: /Acquirer: All Acquirers \(Consortium View\)/i })
    );
    expect(screen.getByText("All Acquirers (Consortium View)")).toBeInTheDocument();
    expect(screen.getByText("QiCard (ISC)")).toBeInTheDocument();
    expect(screen.getByText("Al Qaseh Islamic Bank")).toBeInTheDocument();
    expect(screen.getByText("Tabadul Payment Switch")).toBeInTheDocument();
    expect(screen.getByText("Nass Iraq Payment Network")).toBeInTheDocument();
    expect(screen.getByText("Amwal Electronic Banking")).toBeInTheDocument();
  });

  it("selects a bank and closes the dropdown", async () => {
    const user = userEvent.setup();
    const onSelectBank = vi.fn();
    render(<Header {...baseProps} onSelectBank={onSelectBank} />);
    await user.click(
      screen.getByRole("button", { name: /Acquirer: All Acquirers \(Consortium View\)/i })
    );
    await user.click(screen.getByText("QiCard (ISC)"));
    expect(onSelectBank).toHaveBeenCalledWith("QiCard");
    expect(
      screen.queryByText("All Acquirers (Consortium View)")
    ).toBeNull();
  });

  it("switches to merchant via the Merchant HQ pill", async () => {
    const user = userEvent.setup();
    const onPersona = vi.fn();
    render(
      <Header
        persona="acquirer"
        onPersona={onPersona}
        onToggleMobileMenu={() => {}}
        selectedBank="ALL"
        onSelectBank={() => {}}
      />
    );
    await user.click(screen.getByRole("button", { name: /Merchant HQ/i }));
    expect(onPersona).toHaveBeenCalledWith("merchant");
  });

  it("switches to acquirer and opens the dropdown when started in merchant mode", async () => {
    const user = userEvent.setup();
    const onPersona = vi.fn();
    render(
      <Header
        persona="merchant"
        onPersona={onPersona}
        onToggleMobileMenu={() => {}}
        selectedBank="ALL"
        onSelectBank={() => {}}
      />
    );
    await user.click(
      screen.getByRole("button", { name: /Acquirer: All Acquirers \(Consortium View\)/i })
    );
    expect(onPersona).toHaveBeenCalledWith("acquirer");
    expect(screen.getByText("All Acquirers (Consortium View)")).toBeInTheDocument();
  });

  it("fires onToggleMobileMenu when the hamburger is clicked", async () => {
    const user = userEvent.setup();
    const onToggleMobileMenu = vi.fn();
    render(<Header {...baseProps} onToggleMobileMenu={onToggleMobileMenu} />);
    await user.click(screen.getByRole("button", { name: "Open navigation" }));
    expect(onToggleMobileMenu).toHaveBeenCalledTimes(1);
  });

  it("shows the merchant summary when merchant is selected", () => {
    render(<Header {...baseProps} persona="merchant" />);
    expect(screen.getAllByText("Merchant HQ").length).toBeGreaterThanOrEqual(1);
  });
});
