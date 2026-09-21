import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SecretInput from "./SecretInput";

describe("SecretInput", () => {
  it("renders as a password field by default", () => {
    render(<SecretInput label="API Key" defaultValue="abc123" />);
    const input = screen.getByDisplayValue("abc123");
    expect(input).toHaveAttribute("type", "password");
    expect(screen.getByText("API Key")).toBeInTheDocument();
  });

  it("shows the secret when the eye toggle is clicked", async () => {
    const user = userEvent.setup();
    render(<SecretInput defaultValue="secret-value" />);
    const input = screen.getByDisplayValue("secret-value");
    expect(input).toHaveAttribute("type", "password");
    await user.click(screen.getByRole("button", { name: "Show secret" }));
    expect(input).toHaveAttribute("type", "text");
  });

  it("hides the secret again when the eye toggle is clicked a second time", async () => {
    const user = userEvent.setup();
    render(<SecretInput defaultValue="secret-value" />);
    const input = screen.getByDisplayValue("secret-value");
    await user.click(screen.getByRole("button", { name: "Show secret" }));
    await user.click(screen.getByRole("button", { name: "Hide secret" }));
    expect(input).toHaveAttribute("type", "password");
  });

  it("skips label when not provided", () => {
    const { container } = render(<SecretInput defaultValue="x" />);
    expect(container.querySelector("label")).toBeNull();
  });

  it("renders placeholder when provided", () => {
    render(<SecretInput placeholder="Enter secret" />);
    expect(screen.getByPlaceholderText("Enter secret")).toBeInTheDocument();
  });
});
