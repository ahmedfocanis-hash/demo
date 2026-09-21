import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ConfirmDialog from "./ConfirmDialog";

describe("ConfirmDialog", () => {
  it("returns null when closed", () => {
    const { container } = render(
      <ConfirmDialog
        open={false}
        onClose={() => {}}
        onConfirm={() => {}}
        title="t"
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders title and description when open", () => {
    render(
      <ConfirmDialog
        open
        onClose={() => {}}
        onConfirm={() => {}}
        title="Force Resolve"
        description="This is irreversible."
        confirmLabel="Confirm Resolve"
      />
    );
    expect(screen.getByText("Force Resolve")).toBeInTheDocument();
    expect(screen.getByText("This is irreversible.")).toBeInTheDocument();
  });

  it("Confirm button calls onConfirm then onClose", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onClose = vi.fn();
    render(
      <ConfirmDialog
        open
        onClose={onClose}
        onConfirm={onConfirm}
        title="t"
        confirmLabel="Confirm Resolve"
      />
    );
    await user.click(screen.getByRole("button", { name: "Confirm Resolve" }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("Cancel button calls only onClose", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onClose = vi.fn();
    render(
      <ConfirmDialog
        open
        onClose={onClose}
        onConfirm={onConfirm}
        title="t"
      />
    );
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onConfirm).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("Close (X) button calls onClose", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <ConfirmDialog open onClose={onClose} onConfirm={() => {}} title="t" />
    );
    await user.click(screen.getByRole("button", { name: "Close dialog" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("Backdrop click closes the dialog", () => {
    const onClose = vi.fn();
    render(
      <ConfirmDialog open onClose={onClose} onConfirm={() => {}} title="t" />
    );
    const backdrop = document.querySelector(".backdrop-blur-sm") as HTMLElement;
    expect(backdrop).not.toBeNull();
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalled();
  });

  it("renders children slot when provided", () => {
    render(
      <ConfirmDialog open onClose={() => {}} onConfirm={() => {}} title="t">
        <div>Extra details</div>
      </ConfirmDialog>
    );
    expect(screen.getByText("Extra details")).toBeInTheDocument();
  });
});
