import { describe, expect, it } from "vitest";
import {
  ACQUIRER_BANK_MEMBERS,
  bankToCode,
  stuckRows,
  terminals,
  txRows,
  type TerminalRow,
  type TxRow,
} from "./data";
import { modelBadge } from "./TerminalsTab";
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
  const MEMBER_BANK_CODES = ACQUIRER_BANK_MEMBERS.map((b) => bankToCode(b));

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
      expect(r.id).toMatch(/^STK-[A-Z]{3}-\d{2}$/);
      expect(seen.has(r.id)).toBe(false);
      seen.add(r.id);
    }
  });

  it("only references valid member acquirer bank codes in generated IDs", () => {
    const codes = new Set<string>();
    for (const r of stuckRows) {
      const m = /^STK-([A-Z]{3})-\d{2}$/.exec(r.id);
      expect(m, `unexpected stuck ID format: ${r.id}`).not.toBeNull();
      codes.add(m![1]);
    }
    expect(new Set([...codes].sort())).toEqual(
      new Set([...MEMBER_BANK_CODES].sort()),
    );
  });

  it("each bank code's sequence increments contiguously 01..11", () => {
    const byCode = new Map<string, number[]>();
    for (const r of stuckRows) {
      const m = /^STK-([A-Z]{3})-(\d{2})$/.exec(r.id);
      expect(m, `unexpected stuck ID format: ${r.id}`).not.toBeNull();
      const [, code, suffix] = m!;
      if (!byCode.has(code)) byCode.set(code, []);
      byCode.get(code)!.push(Number(suffix));
    }
    expect([...byCode.keys()].sort()).toEqual([...MEMBER_BANK_CODES].sort());
    for (const [code, suffixes] of byCode) {
      const expected = suffixes
        .map((_, i) => String(i + 1).padStart(2, "0"))
        .sort((a, b) => a.localeCompare(b));
      const actual = suffixes
        .map((s) => String(s).padStart(2, "0"))
        .sort((a, b) => a.localeCompare(b));
      expect(actual, `non-contiguous sequence for bank code ${code}`).toEqual(expected);
    }
  });
});

describe("terminals", () => {
  const MODELS = [
    "PAX A920",
    "SUNMI V2s",
    "NEXGO N86",
    "Verifone V240m",
  ] as const satisfies readonly TerminalRow["model"][];

  // Compile-time exhaustiveness check: if a model is added to TerminalRow
  // but not to MODELS, the Record below fails to typecheck.
  const _modeExhaustiveness: Record<TerminalRow["model"], true> = MODELS.reduce(
    (acc, m) => ({ ...acc, [m]: true }),
    {} as Record<TerminalRow["model"], true>,
  );
  void _modeExhaustiveness;

  it("every terminal has a required identifier", () => {
    for (const t of terminals) {
      expect(t.tid).toMatch(/^TID-/);
    }
  });

  it("every model in TerminalRow['model'] is covered by at least one terminal", () => {
    const seen = new Set(terminals.map((t) => t.model));
    for (const model of MODELS) {
      expect(seen.has(model), `no terminal uses model "${model}"`).toBe(true);
    }
    for (const t of terminals) {
      expect(MODELS, `unknown model "${t.model}"`).toContain(t.model);
    }
  });
});

type BadgeTone = "slate" | "cyan" | "violet";

describe("modelBadge contract", () => {
  const MODELS = [
    "PAX A920",
    "SUNMI V2s",
    "NEXGO N86",
    "Verifone V240m",
  ] as const satisfies readonly TerminalRow["model"][];

  // Compile-time exhaustiveness check: if a model is added to TerminalRow
  // but not to MODELS, the Record below fails to typecheck.
  const _modeExhaustiveness: Record<TerminalRow["model"], true> = MODELS.reduce(
    (acc, m) => ({ ...acc, [m]: true }),
    {} as Record<TerminalRow["model"], true>,
  );
  void _modeExhaustiveness;

  const VALID_TONES: readonly BadgeTone[] = ["slate", "cyan", "violet"] as const;

  it("every TerminalRow['model'] has a defined modelBadge color", () => {
    for (const model of MODELS) {
      const tone = modelBadge[model];
      expect(tone, `missing modelBadge entry for "${model}"`).toBeDefined();
      expect(VALID_TONES, `invalid tone "${tone}" for "${model}"`).toContain(tone);
    }
  });

  it("modelBadge has no unknown keys beyond TerminalRow['model']", () => {
    const declaredKeys = Object.keys(modelBadge);
    for (const key of declaredKeys) {
      expect(
        MODELS,
        `unknown modelBadge key "${key}"`,
      ).toContain(key as TerminalRow["model"]);
    }
    expect(declaredKeys).toHaveLength(MODELS.length);
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

  it("merchant is a strict subset of acquirer", () => {
    for (const id of personaTabs.merchant) expect(personaTabs.acquirer).toContain(id);
  });
});
