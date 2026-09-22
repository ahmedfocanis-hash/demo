import { describe, expect, it } from "vitest";
import {
  stuckRows,
  terminals,
  txRows,
  type TxRow,
} from "./data";
import { personaTabs, tabs, type TabId } from "./Sidebar";

const ALL_TAB_IDS = tabs.map((t) => t.id) as TabId[];

type StuckRowStatus = (typeof stuckRows)[number]["status"];

describe("txRows", () => {
  it("has a non-empty dataset", () => {
    expect(txRows.length).toBeGreaterThan(0);
  });

  it("every row has a valid response and tone", () => {
    const validResponses: TxRow["response"][] = [
      "00 Approved",
      "51 Insufficient Funds",
      "91 Timeout",
    ];
    const validTones: TxRow["tone"][] = ["green", "red", "amber"];
    const validChannels: TxRow["channel"][] = ["POS", "SoftPOS", "QR"];
    const validCurrencies: TxRow["currency"][] = ["IQD", "USD"];
    const validTypes: TxRow["type"][] = ["SALE", "PRE_AUTH", "COMPLETION"];

    for (const r of txRows) {
      expect(r.id).toMatch(/^tx-\d+$/);
      expect(validResponses).toContain(r.response);
      expect(validTones).toContain(r.tone);
      expect(validChannels).toContain(r.channel);
      expect(validCurrencies).toContain(r.currency);
      expect(validTypes).toContain(r.type);
      // PANs are masked with pattern 4-4-**-****-4
      expect(r.pan).toMatch(/^\d{4}-\d{2}\*\*-\*\*\*\*-\d{4}$/);
    }
  });

  it("ids are unique", () => {
    const ids = txRows.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("stuckRows", () => {
  it("contains at least 50 records", () => {
    expect(stuckRows.length).toBeGreaterThanOrEqual(50);
  });

  it("every stuck row has a valid status, tone, and unique id", () => {
    const validStatuses: StuckRowStatus[] = [
      "HOST_TIMEOUT",
      "UNKNOWN_OUTCOME",
      "CONFIG_DRIFT_BLOCKED",
      "REVERSAL_FAILED",
      "LATE_RESPONSE",
      "DUKPT_KEY_DESYNC",
    ];
    const seen = new Set<string>();
    for (const r of stuckRows) {
      expect(validStatuses).toContain(r.status);
      expect(r.tone).toMatch(/^(green|red|amber|blue)$/);
      expect(r.id).toMatch(/^STK-\d{2}$/);
      expect(seen.has(r.id)).toBe(false);
      seen.add(r.id);
    }
  });
});

describe("terminals", () => {
  it("every terminal has a required identifier", () => {
    for (const t of terminals) {
      expect(t.tid).toMatch(/^TID-/);
    }
  });
});

describe("personaTabs", () => {
  it("union of all personas covers every declared tab", () => {
    const union = new Set<TabId>();
    for (const persona of Object.keys(personaTabs) as (keyof typeof personaTabs)[]) {
      for (const id of personaTabs[persona]) union.add(id);
    }
    for (const id of ALL_TAB_IDS) expect(union.has(id)).toBe(true);
  });

  it("every persona at minimum gets transactions", () => {
    for (const persona of Object.keys(personaTabs) as (keyof typeof personaTabs)[]) {
      expect(personaTabs[persona]).toContain("transactions");
    }
  });

  it("acquirer has all tabs", () => {
    expect(personaTabs.acquirer).toHaveLength(ALL_TAB_IDS.length);
    for (const id of ALL_TAB_IDS) expect(personaTabs.acquirer).toContain(id);
  });

  it("psp and merchant are strict subsets of acquirer", () => {
    for (const id of personaTabs.psp) expect(personaTabs.acquirer).toContain(id);
    for (const id of personaTabs.merchant) expect(personaTabs.acquirer).toContain(id);
  });
});
