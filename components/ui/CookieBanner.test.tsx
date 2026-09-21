import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CookieBanner from "./CookieBanner";

describe("CookieBanner", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("renders when no consent has been given", () => {
    render(<CookieBanner />);
    expect(screen.getByText(/telemetry cookies/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Accept/i })).toBeInTheDocument();
  });

  it("does not render when consent is already stored", () => {
    localStorage.setItem("bp-cookie-consent", "accepted");
    const { container } = render(<CookieBanner />);
    expect(container).toBeEmptyDOMElement();
  });

  it("stores consent and disappears on Accept click", async () => {
    const user = userEvent.setup();
    render(<CookieBanner />);
    await user.click(screen.getByRole("button", { name: /Accept/i }));
    expect(localStorage.getItem("bp-cookie-consent")).toBe("accepted");
    expect(screen.queryByText(/telemetry cookies/i)).toBeNull();
  });
});
