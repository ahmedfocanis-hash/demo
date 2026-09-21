import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Badge,
  ButtonGhost,
  ButtonOutline,
  ButtonPrimary,
  ButtonWhitePill,
  Drawer,
  FieldLabel,
  Modal,
  PanelTitle,
  Toggle,
  inputCls,
  selectCls,
} from "./ui";

describe("Badge", () => {
  it("renders children", () => {
    render(<Badge tone="green">Approved</Badge>);
    expect(screen.getByText("Approved")).toBeInTheDocument();
  });

  it("renders a dot span when `dot` is set", () => {
    const { container } = render(
      <Badge tone="red" dot>
        Timeout
      </Badge>
    );
    // Badge has two spans when dot is set: the outer pill and the dot
    const spans = container.querySelectorAll("span");
    expect(spans.length).toBe(2);
  });

  it("does not render dot span when `dot` is false", () => {
    const { container } = render(<Badge tone="red">Timeout</Badge>);
    const spans = container.querySelectorAll("span");
    // Only the outer pill span (children "Timeout" is a text node)
    expect(spans.length).toBe(1);
  });

  it("supports all declared tones without crashing", () => {
    const tones = [
      "green",
      "red",
      "amber",
      "blue",
      "slate",
      "violet",
      "cyan",
      "emerald",
      "rose",
      "neutral",
      "orange",
    ] as const;
    for (const tone of tones) {
      const { unmount } = render(<Badge tone={tone}>x</Badge>);
      unmount();
    }
  });
});

describe("PanelTitle", () => {
  it("renders title, subtitle, updated, and right slot", () => {
    render(
      <PanelTitle
        title="Live Transactions"
        subtitle="Hop-by-hop trace"
        updated="Sep 2026"
        right={<button>Sync</button>}
      />
    );
    expect(screen.getByText("Live Transactions")).toBeInTheDocument();
    expect(screen.getByText("Hop-by-hop trace")).toBeInTheDocument();
    expect(screen.getByText(/Updated · Sep 2026/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sync" })).toBeInTheDocument();
  });

  it("skips subtitle when omitted", () => {
    const { queryByText } = render(<PanelTitle title="Only Title" />);
    expect(queryByText(/subtitle/i)).toBeNull();
  });
});

describe("Buttons", () => {
  it("ButtonPrimary fires onClick", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<ButtonPrimary onClick={onClick}>Save</ButtonPrimary>);
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("ButtonPrimary respects disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <ButtonPrimary onClick={onClick} disabled>
        Save
      </ButtonPrimary>
    );
    const btn = screen.getByRole("button", { name: "Save" }) as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
    await user.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("ButtonGhost and ButtonOutline render and are clickable", async () => {
    const user = userEvent.setup();
    const ghost = vi.fn();
    const outline = vi.fn();
    render(
      <>
        <ButtonGhost onClick={ghost}>Ghost</ButtonGhost>
        <ButtonOutline onClick={outline}>Outline</ButtonOutline>
      </>
    );
    await user.click(screen.getByRole("button", { name: "Ghost" }));
    await user.click(screen.getByRole("button", { name: "Outline" }));
    expect(ghost).toHaveBeenCalled();
    expect(outline).toHaveBeenCalled();
  });

  it("ButtonWhitePill renders", () => {
    render(<ButtonWhitePill>Filter</ButtonWhitePill>);
    expect(screen.getByRole("button", { name: "Filter" })).toBeInTheDocument();
  });
});

describe("Toggle", () => {
  it("toggles state on click", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Toggle on={false} onChange={onChange} label="Enable" />);
    const btn = screen.getByRole("button", { name: /Enable/ });
    expect(btn).toHaveAttribute("aria-pressed", "false");
    await user.click(btn);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("emits `false` when clicked while already on", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Toggle on onChange={onChange} label="Enabled" />);
    await user.click(screen.getByRole("button", { name: /Enabled/ }));
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it("exposes aria-pressed=true when on", () => {
    render(<Toggle on onChange={() => {}} label="on-state" />);
    expect(
      screen.getByRole("button", { name: /on-state/ })
    ).toHaveAttribute("aria-pressed", "true");
  });
});

describe("Drawer", () => {
  it("returns null when closed", () => {
    const { container } = render(
      <Drawer open={false} onClose={() => {}} title="Title">
        <div>content</div>
      </Drawer>
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders title and content when open", () => {
    render(
      <Drawer open onClose={() => {}} title="Session details">
        <p>Detail body</p>
      </Drawer>
    );
    expect(screen.getByText("Session details")).toBeInTheDocument();
    expect(screen.getByText("Detail body")).toBeInTheDocument();
  });

  it("close button fires onClose", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Drawer open onClose={onClose} title="Title">
        body
      </Drawer>
    );
    // The drawer's X button has no accessible name; click it via its parent aside.
    const aside = document.querySelector("aside")!;
    const btns = aside.querySelectorAll("button");
    await user.click(btns[btns.length - 1]);
    expect(onClose).toHaveBeenCalled();
  });

  it("backdrop click fires onClose", () => {
    const onClose = vi.fn();
    render(
      <Drawer open onClose={onClose} title="t">
        b
      </Drawer>
    );
    const backdrop = document.querySelector(".backdrop-blur-sm") as HTMLElement;
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalled();
  });
});

describe("Modal", () => {
  it("renders nothing when closed", () => {
    const { container } = render(
      <Modal open={false} onClose={() => {}} title="m">
        c
      </Modal>
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders title and content when open", () => {
    render(
      <Modal open onClose={() => {}} title="Force Resolve">
        <p>Confirm to force resolve REQ-MON-007?</p>
      </Modal>
    );
    expect(screen.getByText("Force Resolve")).toBeInTheDocument();
    expect(screen.getByText(/Confirm to force resolve/)).toBeInTheDocument();
  });
});

describe("FieldLabel", () => {
  it("renders as a label element", () => {
    render(<FieldLabel>Correlation ID</FieldLabel>);
    const label = screen.getByText("Correlation ID").closest("label");
    expect(label).not.toBeNull();
  });
});

describe("class constants", () => {
  it("inputCls and selectCls are non-empty class strings", () => {
    expect(typeof inputCls).toBe("string");
    expect(typeof selectCls).toBe("string");
    expect(inputCls.length).toBeGreaterThan(0);
    expect(selectCls.length).toBeGreaterThan(0);
  });
});
