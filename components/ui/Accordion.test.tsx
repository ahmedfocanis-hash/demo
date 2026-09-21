import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Accordion from "./Accordion";

const items = [
  { id: "a", title: "Section A", content: "Content A" },
  { id: "b", title: "Section B", content: "Content B" },
  { id: "c", title: "Section C", content: "Content C" },
];

describe("Accordion", () => {
  it("renders all item titles", () => {
    render(<Accordion items={items} />);
    expect(screen.getByText("Section A")).toBeInTheDocument();
    expect(screen.getByText("Section B")).toBeInTheDocument();
    expect(screen.getByText("Section C")).toBeInTheDocument();
  });

  it("closes all items by default when no defaultOpenId is provided", () => {
    render(<Accordion items={items} />);
    expect(screen.queryByText("Content A")).toBeNull();
    expect(screen.queryByText("Content B")).toBeNull();
    expect(screen.queryByText("Content C")).toBeNull();
  });

  it("opens the item matching defaultOpenId", () => {
    render(<Accordion items={items} defaultOpenId="b" />);
    expect(screen.getByText("Content B")).toBeInTheDocument();
    expect(screen.queryByText("Content A")).toBeNull();
  });

  it("opens an item on click and closes it on second click", async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} />);
    const aBtn = screen.getByText("Section A").closest("button")!;
    expect(aBtn).toHaveAttribute("aria-expanded", "false");
    await user.click(aBtn);
    expect(screen.getByText("Content A")).toBeInTheDocument();
    expect(aBtn).toHaveAttribute("aria-expanded", "true");
    await user.click(aBtn);
    expect(screen.queryByText("Content A")).toBeNull();
  });

  it("collapses previously-open item when another is opened (single-open behavior)", async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} defaultOpenId="a" />);
    expect(screen.getByText("Content A")).toBeInTheDocument();
    await user.click(screen.getByText("Section B").closest("button")!);
    expect(screen.getByText("Content B")).toBeInTheDocument();
    expect(screen.queryByText("Content A")).toBeNull();
  });
});
