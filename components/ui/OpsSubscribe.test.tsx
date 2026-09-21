import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import OpsSubscribe from "./OpsSubscribe";

describe("OpsSubscribe", () => {
  it("renders email input and Subscribe button", () => {
    render(<OpsSubscribe />);
    expect(screen.getByPlaceholderText("ops-alerts@company.com")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Subscribe/i })).toBeInTheDocument();
  });

  it("does nothing when submitted empty", async () => {
    const user = userEvent.setup();
    render(<OpsSubscribe />);
    await user.click(screen.getByRole("button", { name: /Subscribe/i }));
    expect(screen.queryByText(/Subscribed/i)).toBeNull();
  });

  it("subscribes and switches to success state", async () => {
    const user = userEvent.setup();
    render(<OpsSubscribe />);
    await user.type(
      screen.getByPlaceholderText("ops-alerts@company.com"),
      "ops@acquirer.com"
    );
    await user.click(screen.getByRole("button", { name: /Subscribe/i }));
    expect(screen.getByText(/Subscribed/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Subscribe/i })).toBeNull();
  });
});
