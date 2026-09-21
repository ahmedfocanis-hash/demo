import { describe, expect, it } from "vitest";
import { cn, withUtm } from "../lib/utils";

describe("cn", () => {
  it("joins class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("ignores falsy inputs", () => {
    expect(cn("a", null, false, undefined, "", "b")).toBe("a b");
  });

  it("resolves Tailwind conflicts (last wins)", () => {
    expect(cn("text-sm", "text-lg")).toBe("text-lg");
    expect(cn("bg-red-500", "bg-emerald-500")).toBe("bg-emerald-500");
  });

  it("supports object and array inputs", () => {
    expect(cn("base", { "hover:x": true, "hover:y": false }, ["a", "b"])).toBe(
      "base hover:x a b"
    );
  });
});

describe("withUtm", () => {
  it("adds utm_source and utm_medium when absent", () => {
    const out = withUtm("https://example.com/landing");
    expect(out).toContain("utm_source=bp_gateway");
    expect(out).toContain("utm_medium=console");
  });

  it("does not overwrite an existing utm_source", () => {
    const out = withUtm("https://example.com/landing?utm_source=partner");
    expect(out).toContain("utm_source=partner");
    expect(out).not.toContain("utm_source=bp_gateway");
  });

  it("returns the original string when URL parsing fails", () => {
    expect(withUtm("not-a-url")).toBe("not-a-url");
  });

  it("preserves other existing query params", () => {
    const out = withUtm("https://example.com/x?a=1&b=2");
    expect(out).toContain("a=1");
    expect(out).toContain("b=2");
    expect(out).toContain("utm_source=bp_gateway");
  });
});
