import { describe, expect, it } from "vitest";
import { txRows } from "../components/dashboard/data";

describe("transactions-scoping", () => {
  const merchantScoped = txRows.filter(
    (tx) => tx.merchant === "Baghdad Central Supermarket"
  );

  it("yields a non-empty merchant-scoped dataset", () => {
    expect(merchantScoped.length).toBeGreaterThan(0);
  });

  it("only contains Baghdad Central Supermarket rows", () => {
    for (const row of merchantScoped) {
      expect(row.merchant).toBe("Baghdad Central Supermarket");
    }
  });

  it("excludes unrelated merchants entirely", () => {
    const unrelated = [
      "Kurdistan Galleria",
      "Baghdad Al-Ghazal Pharmacy",
      "Basra Souq Market",
      "Erbil Zheen Hotel",
      "Mosul Car Rentals",
      "Najaf Hypermarket",
      "Kirkuk Fuel Station",
      "Sulaymaniyah Tech Store",
      "Erbil Tech",
      "Al-Mansour Medical",
    ];

    for (const name of unrelated) {
      expect(merchantScoped.some((r) => r.merchant === name)).toBe(false);
    }
  });

  it("excludes rows whose merchant is not Baghdad Central Supermarket", () => {
    const scopedIds = new Set(merchantScoped.map((r) => r.id));
    for (const tx of txRows) {
      if (tx.merchant !== "Baghdad Central Supermarket") {
        expect(scopedIds.has(tx.id)).toBe(false);
      } else {
        expect(scopedIds.has(tx.id)).toBe(true);
      }
    }
  });

  it("every merchant-scoped row is a real txRow", () => {
    const ids = merchantScoped.map((r) => r.id);
    for (const id of ids) {
      expect(txRows.some((t) => t.id === id)).toBe(true);
    }
  });

  it("captures every Baghdad Central Supermarket txRow in the dataset", () => {
    const scopedIds = new Set(merchantScoped.map((r) => r.id));
    const datasetIds = txRows
      .filter((t) => t.merchant === "Baghdad Central Supermarket")
      .map((t) => t.id);
    expect(scopedIds.size).toBe(datasetIds.length);
    for (const id of datasetIds) {
      expect(scopedIds.has(id)).toBe(true);
    }
  });
});
