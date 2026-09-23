export type Persona = "acquirer" | "merchant";

/* -------------------------- Acquirer Bank Scope --------------------------- */

export type AcquirerBank = "ALL" | "QiCard" | "Al Qaseh" | "Tabadul" | "Nass" | "Amwal";

export type MemberAcquirerBank = Exclude<AcquirerBank, "ALL">;

export interface AcquirerBankMeta {
  id: AcquirerBank;
  name: string;
  code: string;
  binPrefix: string;
  clearingAccountId: string;
}

export const ACQUIRER_BANKS: AcquirerBankMeta[] = [
  { id: "ALL", name: "All Acquirers (Consortium View)", code: "ALL", binPrefix: "*", clearingAccountId: "CBI-CONSORTIUM-POOL" },
  { id: "QiCard", name: "QiCard (ISC)", code: "QIC", binPrefix: "5061", clearingAccountId: "CBI-QIC-RTGS-01" },
  { id: "Al Qaseh", name: "Al Qaseh Islamic Bank", code: "QSH", binPrefix: "4719", clearingAccountId: "CBI-QSH-ISLAMIC-02" },
  { id: "Tabadul", name: "Tabadul Payment Switch", code: "TBD", binPrefix: "5544", clearingAccountId: "CBI-TBD-RETAIL-03" },
  { id: "Nass", name: "Nass Iraq Payment Network", code: "NSS", binPrefix: "4159", clearingAccountId: "CBI-NSS-COMM-04" },
  { id: "Amwal", name: "Amwal Electronic Banking", code: "AMW", binPrefix: "4024", clearingAccountId: "CBI-AMW-SOFTPOS-05" },
];

export const ACQUIRER_BANK_MEMBERS: MemberAcquirerBank[] = [
  "QiCard",
  "Al Qaseh",
  "Tabadul",
  "Nass",
  "Amwal",
];

export const acquirerBankLabel = (bank: AcquirerBank): string =>
  ACQUIRER_BANKS.find((b) => b.id === bank)?.name ?? bank;

export function filterByBank<T extends { bank: AcquirerBank }>(
  rows: T[],
  bank: AcquirerBank,
): T[] {
  if (bank === "ALL") return rows;
  return rows.filter((r) => r.bank === bank);
}

export function acquirerBankShortLabel(bank: AcquirerBank): string {
  switch (bank) {
    case "ALL":
      return "All Banks";
    case "QiCard":
      return "QiCard";
    case "Al Qaseh":
      return "Al Qaseh";
    case "Tabadul":
      return "Tabadul";
    case "Nass":
      return "Nass";
    case "Amwal":
      return "Amwal";
    default:
      return bank;
  }
}

/* ------------------------------ Live Transactions -------------------------------- */

export type Channel = "POS" | "SoftPOS" | "QR";

export interface TxRow {
  id: string;
  time: string;
  corrId: string;
  channel: Channel;
  merchant: string;
  mid: string;
  terminalId: string;
  pan: string;
  amount: string;
  currency: "IQD" | "USD";
  type: "SALE" | "PRE_AUTH" | "COMPLETION";
  response: "00 Approved" | "51 Insufficient Funds" | "91 Timeout";
  tone: "green" | "red" | "amber";
  bank: AcquirerBank;
}

export const txRows: TxRow[] = [
  /* ---------------- QiCard Transactions (Primary Retail & Merchant HQ) ---------------- */
  {
    id: "tx-01",
    time: "14:32:11.084",
    corrId: "b9f2-1c4a-88e7-03f2",
    channel: "POS",
    merchant: "Baghdad Central Supermarket",
    mid: "MID-772901-IRQ",
    terminalId: "TID-QIC-101",
    pan: "5061-65**-****-1029",
    amount: "1,842,500",
    currency: "IQD",
    type: "SALE",
    response: "00 Approved",
    tone: "green",
    bank: "QiCard",
  },
  {
    id: "tx-02",
    time: "14:31:42.118",
    corrId: "c18a-992d-44ef-1123",
    channel: "POS",
    merchant: "Baghdad Central Supermarket",
    mid: "MID-772901-IRQ",
    terminalId: "TID-QIC-102",
    pan: "5061-88**-****-4412",
    amount: "486,000",
    currency: "IQD",
    type: "SALE",
    response: "00 Approved",
    tone: "green",
    bank: "QiCard",
  },
  {
    id: "tx-03",
    time: "14:30:19.554",
    corrId: "d91e-332a-55bc-9801",
    channel: "QR",
    merchant: "Baghdad Central Supermarket",
    mid: "MID-772901-IRQ",
    terminalId: "TID-QIC-103",
    pan: "5061-22**-****-8843",
    amount: "92,500",
    currency: "IQD",
    type: "SALE",
    response: "00 Approved",
    tone: "green",
    bank: "QiCard",
  },
  {
    id: "tx-04",
    time: "14:28:55.302",
    corrId: "a1ff-9092-4b37-5e2a",
    channel: "POS",
    merchant: "Kurdistan Galleria",
    mid: "MID-772902-IRQ",
    terminalId: "TID-QIC-104",
    pan: "4159-77**-****-5561",
    amount: "965,000",
    currency: "IQD",
    type: "COMPLETION",
    response: "00 Approved",
    tone: "green",
    bank: "QiCard",
  },
  {
    id: "tx-05",
    time: "14:26:10.104",
    corrId: "9e02-b7c4-6d31-08aa",
    channel: "SoftPOS",
    merchant: "Erbil Grand Mall",
    mid: "MID-772903-IRQ",
    terminalId: "TID-QIC-105",
    pan: "5061-88**-****-2214",
    amount: "1,650,000",
    currency: "IQD",
    type: "PRE_AUTH",
    response: "00 Approved",
    tone: "green",
    bank: "QiCard",
  },

  /* ---------------- Al Qaseh Islamic Bank Transactions ---------------- */
  {
    id: "tx-06",
    time: "14:31:58.912",
    corrId: "a771-c93b-4d12-9a80",
    channel: "SoftPOS",
    merchant: "Baghdad Al-Ghazal Pharmacy",
    mid: "MID-881201-IRQ",
    terminalId: "TID-QSH-201",
    pan: "4719-22**-****-3317",
    amount: "120,000",
    currency: "IQD",
    type: "SALE",
    response: "51 Insufficient Funds",
    tone: "red",
    bank: "Al Qaseh",
  },
  {
    id: "tx-07",
    time: "14:30:41.320",
    corrId: "d20c-33d8-1b66-9044",
    channel: "QR",
    merchant: "Al-Mansour Medical",
    mid: "MID-881202-IRQ",
    terminalId: "TID-QSH-202",
    pan: "4719-41**-****-6610",
    amount: "60.00",
    currency: "USD",
    type: "SALE",
    response: "00 Approved",
    tone: "green",
    bank: "Al Qaseh",
  },
  {
    id: "tx-08",
    time: "14:28:52.316",
    corrId: "52af-0e69-d4b2-7c3e",
    channel: "POS",
    merchant: "Al-Mansour Medical",
    mid: "MID-881202-IRQ",
    terminalId: "TID-QSH-203",
    pan: "4719-90**-****-3357",
    amount: "2,780,000",
    currency: "IQD",
    type: "SALE",
    response: "00 Approved",
    tone: "green",
    bank: "Al Qaseh",
  },
  {
    id: "tx-09",
    time: "14:25:12.771",
    corrId: "f11a-44c2-90ab-3321",
    channel: "POS",
    merchant: "Karkh Medical Supplies",
    mid: "MID-881203-IRQ",
    terminalId: "TID-QSH-204",
    pan: "4719-33**-****-1190",
    amount: "840,000",
    currency: "IQD",
    type: "SALE",
    response: "00 Approved",
    tone: "green",
    bank: "Al Qaseh",
  },

  /* ---------------- Tabadul Payment Switch Transactions ---------------- */
  {
    id: "tx-10",
    time: "14:31:47.630",
    corrId: "c03d-5e10-b2aa-77fc",
    channel: "QR",
    merchant: "Basra Souq Market",
    mid: "MID-663401-IRQ",
    terminalId: "TID-TBD-301",
    pan: "5544-90**-****-7712",
    amount: "84.75",
    currency: "USD",
    type: "SALE",
    response: "00 Approved",
    tone: "green",
    bank: "Tabadul",
  },
  {
    id: "tx-11",
    time: "14:30:22.981",
    corrId: "f9b7-88c1-04dd-51e3",
    channel: "POS",
    merchant: "Sulaymaniyah Tech Store",
    mid: "MID-663402-IRQ",
    terminalId: "TID-TBD-302",
    pan: "5544-19**-****-1028",
    amount: "1,150,000",
    currency: "IQD",
    type: "SALE",
    response: "00 Approved",
    tone: "green",
    bank: "Tabadul",
  },
  {
    id: "tx-12",
    time: "14:28:30.147",
    corrId: "c6b3-77d1-18fa-95e2",
    channel: "POS",
    merchant: "Babylon Food Express",
    mid: "MID-663403-IRQ",
    terminalId: "TID-TBD-303",
    pan: "5544-65**-****-5512",
    amount: "1,240,000",
    currency: "IQD",
    type: "COMPLETION",
    response: "00 Approved",
    tone: "green",
    bank: "Tabadul",
  },
  {
    id: "tx-13",
    time: "14:24:18.902",
    corrId: "a28c-9011-44ef-7711",
    channel: "SoftPOS",
    merchant: "Basra Souq Market",
    mid: "MID-663401-IRQ",
    terminalId: "TID-TBD-304",
    pan: "5544-88**-****-3310",
    amount: "325,000",
    currency: "IQD",
    type: "SALE",
    response: "00 Approved",
    tone: "green",
    bank: "Tabadul",
  },

  /* ---------------- Nass Iraq Payment Network Transactions ---------------- */
  {
    id: "tx-14",
    time: "14:31:32.205",
    corrId: "e84f-21ab-9f1d-cc08",
    channel: "POS",
    merchant: "Erbil Zheen Hotel",
    mid: "MID-554101-IRQ",
    terminalId: "TID-NSS-401",
    pan: "4159-88**-****-2041",
    amount: "2,400,000",
    currency: "IQD",
    type: "PRE_AUTH",
    response: "00 Approved",
    tone: "green",
    bank: "Nass",
  },
  {
    id: "tx-15",
    time: "14:27:44.819",
    corrId: "7d41-9ab2-c05e-1f88",
    channel: "POS",
    merchant: "Kirkuk Fuel Station",
    mid: "MID-554102-IRQ",
    terminalId: "TID-NSS-402",
    pan: "4159-77**-****-7729",
    amount: "75,000",
    currency: "IQD",
    type: "SALE",
    response: "00 Approved",
    tone: "green",
    bank: "Nass",
  },
  {
    id: "tx-16",
    time: "14:23:51.611",
    corrId: "331a-88bc-9912-4411",
    channel: "QR",
    merchant: "Mosul Logistics Hub",
    mid: "MID-554103-IRQ",
    terminalId: "TID-NSS-403",
    pan: "4159-33**-****-9901",
    amount: "1,450,000",
    currency: "IQD",
    type: "SALE",
    response: "00 Approved",
    tone: "green",
    bank: "Nass",
  },
  {
    id: "tx-17",
    time: "14:21:05.419",
    corrId: "bb90-1123-4411-9988",
    channel: "POS",
    merchant: "Erbil Zheen Hotel",
    mid: "MID-554101-IRQ",
    terminalId: "TID-NSS-401",
    pan: "4159-11**-****-2234",
    amount: "890,000",
    currency: "IQD",
    type: "SALE",
    response: "00 Approved",
    tone: "green",
    bank: "Nass",
  },

  /* ---------------- Amwal Electronic Banking Transactions ---------------- */
  {
    id: "tx-18",
    time: "14:31:19.777",
    corrId: "b551-7cde-3aa4-19d6",
    channel: "SoftPOS",
    merchant: "Mosul Car Rentals",
    mid: "MID-441901-IRQ",
    terminalId: "TID-AMW-501",
    pan: "4024-10**-****-8890",
    amount: "350,000",
    currency: "IQD",
    type: "SALE",
    response: "91 Timeout",
    tone: "amber",
    bank: "Amwal",
  },
  {
    id: "tx-19",
    time: "14:29:41.205",
    corrId: "3c98-55f7-2e6b-a410",
    channel: "QR",
    merchant: "Najaf Hospitality Center",
    mid: "MID-441902-IRQ",
    terminalId: "TID-AMW-502",
    pan: "4024-22**-****-8843",
    amount: "185,000",
    currency: "IQD",
    type: "SALE",
    response: "00 Approved",
    tone: "green",
    bank: "Amwal",
  },
  {
    id: "tx-20",
    time: "14:26:02.119",
    corrId: "881a-44ef-11bc-9921",
    channel: "POS",
    merchant: "Wasit Electronics",
    mid: "MID-441903-IRQ",
    terminalId: "TID-AMW-503",
    pan: "4024-99**-****-5511",
    amount: "1,920,000",
    currency: "IQD",
    type: "SALE",
    response: "00 Approved",
    tone: "green",
    bank: "Amwal",
  },
  {
    id: "tx-21",
    time: "14:22:40.887",
    corrId: "cc71-8892-3311-2290",
    channel: "SoftPOS",
    merchant: "Mosul Car Rentals",
    mid: "MID-441901-IRQ",
    terminalId: "TID-AMW-501",
    pan: "4024-77**-****-4419",
    amount: "520,000",
    currency: "IQD",
    type: "PRE_AUTH",
    response: "00 Approved",
    tone: "green",
    bank: "Amwal",
  },
];

/* --------------------- Hop-By-Hop Latency Waterfall ------------------------ */

export interface Hop {
  name: string;
  label: string;
  latency: number;
  detail: string;
  tone: string;
}

export const hops: Hop[] = [
  {
    name: "Ingress",
    label: "Acceptance Channel",
    latency: 0,
    detail: "Encrypted POS / SoftPOS / QR ingress accepted",
    tone: "bg-emerald-green",
  },
  {
    name: "Protocol Gateway",
    label: "ISO 8583 parse to JSON",
    latency: 8,
    detail: "Bitmap parse · data element projection",
    tone: "bg-cobalt-blue",
  },
  {
    name: "Orchestration Core",
    label: "Routing rule evaluation",
    latency: 14,
    detail: "Rule engine match · tenant policy verification",
    tone: "bg-cobalt-blue",
  },
  {
    name: "Synchronous VAS",
    label: "Aqsaty installment validation",
    latency: 85,
    detail: "VAS eligibility · pre-auth amount split",
    tone: "bg-signal-orange",
  },
  {
    name: "Host Payment Switch",
    label: "Authorization Flight",
    latency: 165,
    detail: "Issuer routing · authorization response 0210",
    tone: "bg-brand-orange-tint",
  },
  {
    name: "Egress",
    label: "Response Serialized",
    latency: 4,
    detail: "ISO 8583 rebuild · terminal socket delivery",
    tone: "bg-emerald-green",
  },
];

/* ------------------------ Stuck / Unresolved Queue ------------------------ */

export type StuckStatus =
  | "HOST_TIMEOUT"
  | "UNKNOWN_OUTCOME"
  | "CONFIG_DRIFT_BLOCKED"
  | "REVERSAL_FAILED"
  | "LATE_RESPONSE"
  | "DUKPT_KEY_DESYNC";

export interface StuckRow {
  id: string;
  amount: string;
  type: string;
  status: StuckStatus;
  aging: string;
  tone: "red" | "amber" | "blue";
  time: string;
  merchant: string;
  bank: AcquirerBank;
}

const SQ_BANK_MERCHANTS: Record<Exclude<AcquirerBank, "ALL">, string[]> = {
  QiCard: ["Baghdad Central Supermarket", "Kurdistan Galleria", "Erbil Grand Mall"],
  "Al Qaseh": ["Baghdad Al-Ghazal Pharmacy", "Al-Mansour Medical", "Karkh Medical Supplies"],
  Tabadul: ["Basra Souq Market", "Sulaymaniyah Tech Store", "Babylon Food Express"],
  Nass: ["Erbil Zheen Hotel", "Kirkuk Fuel Station", "Mosul Logistics Hub"],
  Amwal: ["Mosul Car Rentals", "Najaf Hospitality Center", "Wasit Electronics"],
};

const SQ_TYPES = [
  { t: "POS Sale (0200)", a: "485,000" },
  { t: "SoftPOS Purchase", a: "128,500" },
  { t: "Pre-Auth Completion (0200)", a: "1,240,000" },
  { t: "QR Dynamic Checkout", a: "64,800" },
  { t: "Tasdeed Bill Payment", a: "320,000" },
  { t: "Refund / Return (0200)", a: "215,750" },
  { t: "Incremental Auth", a: "875,000" },
] as const;

const SQ_STATUSES: { s: StuckStatus; tone: "red" | "amber" | "blue" }[] = [
  { s: "HOST_TIMEOUT", tone: "red" },
  { s: "UNKNOWN_OUTCOME", tone: "amber" },
  { s: "CONFIG_DRIFT_BLOCKED", tone: "blue" },
  { s: "REVERSAL_FAILED", tone: "red" },
  { s: "LATE_RESPONSE", tone: "amber" },
  { s: "DUKPT_KEY_DESYNC", tone: "red" },
];

const SQ_AGINGS = ["2m", "6m", "11m", "18m", "24m", "38m", "56m", "74m", "92m", "118m", "145m"] as const;

const SQ_ANCHOR = 14 * 3600 + 32 * 60;
function sqTimeOffset(min: number): string {
  const total = SQ_ANCHOR - min * 60;
  const h = Math.floor(total / 3600) % 24;
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

const BANK_CODE: Record<MemberAcquirerBank, string> = {
  QiCard: "QIC",
  "Al Qaseh": "QSH",
  Tabadul: "TBD",
  Nass: "NSS",
  Amwal: "AMW",
};

/**
 * Resolves the short three-letter bank code used in stuck-row IDs.
 * Throws instead of guessing if a member bank is missing from the map —
 * keeps the STK-<CODE>-<NN> format honest rather than silently emitting
 * truncated bank names.
 */
export function bankToCode(bank: MemberAcquirerBank): string {
  const code = BANK_CODE[bank];
  if (!code) {
    throw new Error(`No bank code registered for member acquirer "${bank}"`);
  }
  return code;
}

export const stuckRows: StuckRow[] = Array.from({ length: 55 }, (_, i) => {
  const bank = ACQUIRER_BANK_MEMBERS[i % ACQUIRER_BANK_MEMBERS.length];
  const merchantPool = SQ_BANK_MERCHANTS[bank];
  const merchant = merchantPool[i % merchantPool.length];
  const status = SQ_STATUSES[i % SQ_STATUSES.length];
  const type = SQ_TYPES[i % SQ_TYPES.length];
  const agingLabel = SQ_AGINGS[i % SQ_AGINGS.length];
  const agingMinutes = Number(agingLabel.replace(/[^0-9]/g, ""));
  const bankCode = bankToCode(bank);

  return {
    id: `STK-${bankCode}-${String(Math.floor(i / 5) + 1).padStart(2, "0")}`,
    merchant,
    type: type.t,
    amount: (i % 7 === 0) ? "45.00 USD" : type.a,
    status: status.s,
    tone: status.tone,
    aging: agingLabel,
    time: sqTimeOffset(agingMinutes),
    bank,
  };
});

/* --------------------------- Terminal Fleet ------------------------------- */

export interface TerminalRow {
  tid: string;
  model: "PAX A920" | "SUNMI V2s" | "NEXGO N86" | "Verifone V240m";
  merchant: string;
  appVer: string;
  paramVer: string;
  drift: "In Sync" | "Drift Detected";
  lastPing: string;
  bank: AcquirerBank;
}

export const terminals: TerminalRow[] = [
  /* QiCard Fleet */
  { tid: "TID-QIC-101", model: "PAX A920", merchant: "Baghdad Central Supermarket", appVer: "v4.3.1", paramVer: "v2.1", drift: "In Sync", lastPing: "2s ago", bank: "QiCard" },
  { tid: "TID-QIC-102", model: "PAX A920", merchant: "Baghdad Central Supermarket", appVer: "v4.3.1", paramVer: "v2.1", drift: "In Sync", lastPing: "5s ago", bank: "QiCard" },
  { tid: "TID-QIC-103", model: "SUNMI V2s", merchant: "Kurdistan Galleria", appVer: "v4.3.0", paramVer: "v2.0", drift: "Drift Detected", lastPing: "18s ago", bank: "QiCard" },
  { tid: "TID-QIC-104", model: "NEXGO N86", merchant: "Erbil Grand Mall", appVer: "v4.2.8", paramVer: "v2.4", drift: "In Sync", lastPing: "1m ago", bank: "QiCard" },

  /* Al Qaseh Fleet */
  { tid: "TID-QSH-201", model: "SUNMI V2s", merchant: "Baghdad Al-Ghazal Pharmacy", appVer: "v4.3.0", paramVer: "v2.4", drift: "In Sync", lastPing: "4s ago", bank: "Al Qaseh" },
  { tid: "TID-QSH-202", model: "PAX A920", merchant: "Al-Mansour Medical", appVer: "v4.3.1", paramVer: "v2.4", drift: "In Sync", lastPing: "11s ago", bank: "Al Qaseh" },
  { tid: "TID-QSH-203", model: "Verifone V240m", merchant: "Karkh Medical Supplies", appVer: "v4.1.9", paramVer: "v2.2", drift: "Drift Detected", lastPing: "42s ago", bank: "Al Qaseh" },
  { tid: "TID-QSH-204", model: "SUNMI V2s", merchant: "Baghdad Al-Ghazal Pharmacy", appVer: "v4.3.0", paramVer: "v2.4", drift: "In Sync", lastPing: "2m ago", bank: "Al Qaseh" },

  /* Tabadul Fleet */
  { tid: "TID-TBD-301", model: "NEXGO N86", merchant: "Basra Souq Market", appVer: "v4.2.8", paramVer: "v2.4", drift: "In Sync", lastPing: "8s ago", bank: "Tabadul" },
  { tid: "TID-TBD-302", model: "PAX A920", merchant: "Sulaymaniyah Tech Store", appVer: "v4.3.1", paramVer: "v2.1", drift: "In Sync", lastPing: "14s ago", bank: "Tabadul" },
  { tid: "TID-TBD-303", model: "SUNMI V2s", merchant: "Babylon Food Express", appVer: "v4.2.0", paramVer: "v1.9", drift: "Drift Detected", lastPing: "3m ago", bank: "Tabadul" },
  { tid: "TID-TBD-304", model: "NEXGO N86", merchant: "Basra Souq Market", appVer: "v4.2.8", paramVer: "v2.4", drift: "In Sync", lastPing: "27s ago", bank: "Tabadul" },

  /* Nass Fleet */
  { tid: "TID-NSS-401", model: "PAX A920", merchant: "Erbil Zheen Hotel", appVer: "v4.3.1", paramVer: "v2.1", drift: "In Sync", lastPing: "1s ago", bank: "Nass" },
  { tid: "TID-NSS-402", model: "SUNMI V2s", merchant: "Kirkuk Fuel Station", appVer: "v4.3.0", paramVer: "v2.4", drift: "In Sync", lastPing: "9s ago", bank: "Nass" },
  { tid: "TID-NSS-403", model: "Verifone V240m", merchant: "Mosul Logistics Hub", appVer: "v4.1.8", paramVer: "v1.8", drift: "Drift Detected", lastPing: "5m ago", bank: "Nass" },
  { tid: "TID-NSS-404", model: "PAX A920", merchant: "Erbil Zheen Hotel", appVer: "v4.3.1", paramVer: "v2.1", drift: "In Sync", lastPing: "33s ago", bank: "Nass" },

  /* Amwal Fleet */
  { tid: "TID-AMW-501", model: "SUNMI V2s", merchant: "Mosul Car Rentals", appVer: "v4.3.0", paramVer: "v2.4", drift: "In Sync", lastPing: "6s ago", bank: "Amwal" },
  { tid: "TID-AMW-502", model: "NEXGO N86", merchant: "Najaf Hospitality Center", appVer: "v4.2.8", paramVer: "v2.4", drift: "In Sync", lastPing: "19s ago", bank: "Amwal" },
  { tid: "TID-AMW-503", model: "PAX A920", merchant: "Wasit Electronics", appVer: "v4.3.1", paramVer: "v2.1", drift: "Drift Detected", lastPing: "4m ago", bank: "Amwal" },
  { tid: "TID-AMW-504", model: "SUNMI V2s", merchant: "Mosul Car Rentals", appVer: "v4.3.0", paramVer: "v2.4", drift: "In Sync", lastPing: "51s ago", bank: "Amwal" },
];

/* ----------------------------- Settlements & Data Lock -------------------------------- */

export interface BatchRow {
  id: string;
  dest: string;
  volume: string;
  txCount: number;
  transport: "SFTP" | "API Push";
  status: "ACK_RECEIVED" | "TRANSMITTED" | "NACK_REJECTED";
  timestamp: string;
  rev?: string;
  bank: AcquirerBank;
  /** Financial cutoff immutability lock flag. */
  isLocked: boolean;
  lockHash?: string;
}

export const batches: BatchRow[] = [
  /* QiCard Batches */
  { id: "STL-QIC-88211", dest: "CBI RTGS Clearer", volume: "1,240,500,000", txCount: 8412, transport: "SFTP", status: "ACK_RECEIVED", timestamp: "03:15:00", bank: "QiCard", isLocked: true, lockHash: "sha256:88a1f…c001" },
  { id: "STL-QIC-88212", dest: "Rafidain Central Hub", volume: "612,400,000", txCount: 4210, transport: "SFTP", status: "ACK_RECEIVED", timestamp: "03:15:10", bank: "QiCard", isLocked: true, lockHash: "sha256:99f2a…b114" },
  { id: "STL-QIC-88213", dest: "Al-Mansour Clearing", volume: "155,720,000", txCount: 1120, transport: "API Push", status: "TRANSMITTED", timestamp: "03:15:20", bank: "QiCard", isLocked: false },

  /* Al Qaseh Batches */
  { id: "STL-QSH-88214", dest: "CBI Islamic Settlement", volume: "388,150,000", txCount: 2314, transport: "API Push", status: "ACK_RECEIVED", timestamp: "03:15:30", bank: "Al Qaseh", isLocked: true, lockHash: "sha256:11a4c…d881" },
  { id: "STL-QSH-88215", dest: "National Bank of Iraq", volume: "288,610,000", txCount: 1890, transport: "API Push", status: "ACK_RECEIVED", timestamp: "03:15:40", bank: "Al Qaseh", isLocked: true, lockHash: "sha256:33d2e…e992" },
  { id: "STL-QSH-88216", dest: "Trade Bank of Iraq", volume: "145,000,000", txCount: 920, transport: "SFTP", status: "TRANSMITTED", timestamp: "03:15:50", bank: "Al Qaseh", isLocked: false },

  /* Tabadul Batches */
  { id: "STL-TBD-88217", dest: "CBI Retail Netting", volume: "1,842,500,000", txCount: 11450, transport: "SFTP", status: "ACK_RECEIVED", timestamp: "03:16:00", rev: "REV-2", bank: "Tabadul", isLocked: true, lockHash: "sha256:77bc2…f441" },
  { id: "STL-TBD-88218", dest: "Union Bank of Iraq", volume: "77,850,000", txCount: 640, transport: "SFTP", status: "ACK_RECEIVED", timestamp: "03:16:10", bank: "Tabadul", isLocked: true, lockHash: "sha256:55aa1…a220" },
  { id: "STL-TBD-88219", dest: "National Utility Gateway", volume: "420,900,000", txCount: 3100, transport: "API Push", status: "TRANSMITTED", timestamp: "03:16:20", bank: "Tabadul", isLocked: false },

  /* Nass Batches */
  { id: "STL-NSS-88220", dest: "Trade Bank of Iraq", volume: "204,900,000", txCount: 1420, transport: "API Push", status: "ACK_RECEIVED", timestamp: "03:16:30", bank: "Nass", isLocked: true, lockHash: "sha256:44bb8…99a1" },
  { id: "STL-NSS-88221", dest: "Erbil Commercial Clearing", volume: "185,400,000", txCount: 1210, transport: "SFTP", status: "ACK_RECEIVED", timestamp: "03:16:40", bank: "Nass", isLocked: true, lockHash: "sha256:22cc9…11d4" },
  { id: "STL-NSS-88222", dest: "Mastercard Base II Ingress", volume: "95,200,000", txCount: 680, transport: "API Push", status: "TRANSMITTED", timestamp: "03:16:50", bank: "Nass", isLocked: false },

  /* Amwal Batches */
  { id: "STL-AMW-88223", dest: "Zain Cash Switch Netting", volume: "96,300,000", txCount: 890, transport: "API Push", status: "NACK_REJECTED", timestamp: "03:17:00", bank: "Amwal", isLocked: false },
  { id: "STL-AMW-88224", dest: "CBI RTGS Clearer", volume: "310,400,000", txCount: 2150, transport: "SFTP", status: "ACK_RECEIVED", timestamp: "03:17:10", bank: "Amwal", isLocked: true, lockHash: "sha256:66ee1…55f2" },
  { id: "STL-AMW-88225", dest: "Baghdad Corporate Clearing", volume: "128,700,000", txCount: 940, transport: "API Push", status: "TRANSMITTED", timestamp: "03:17:20", bank: "Amwal", isLocked: false },
];

/* ----------------------- Onboarding Propagation --------------------- */

export interface PropStep {
  label: string;
  target: string;
  synced: boolean;
}

export const propSteps: PropStep[] = [
  { label: "TMS Platform", target: "tm.edge-bp.com", synced: true },
  { label: "Core Switch", target: "sw-host.bp-iq", synced: true },
  { label: "VAS Engines", target: "vas.bp-iq (aqsati|loynova)", synced: true },
];

/* ----------------------- VAS (Value-Added Services) ----------------------- */

export type VasCategory = "telecom" | "utility" | "dcc" | "voucher" | "government";
export type VasStatus = "ACTIVE" | "MAINTENANCE" | "DEGRADED" | "SUSPENDED";

export interface VasService {
  id: string;
  code: string;
  name: string;
  category: VasCategory;
  provider: string;
  feeType: "percentage" | "flat";
  feeValue: string;
  status: VasStatus;
  successRate: number;
  dailyVolumeIqd: number;
  txCount24h: number;
  supportedChannels: ("POS" | "SoftPOS" | "QR" | "PORTAL")[];
  bank: AcquirerBank;
}

export interface VasTransaction {
  id: string;
  correlationId: string;
  timestamp: string;
  serviceCode: string;
  serviceName: string;
  provider: string;
  referenceNo: string;
  merchantName: string;
  terminalId: string;
  amount: number;
  fee: number;
  currency: "IQD" | "USD";
  status: "00 Approved" | "91 Switch Timeout" | "51 Invalid Biller" | "05 Declined";
  channel: "POS" | "SoftPOS" | "QR";
  bank: AcquirerBank;
}

export const vasCatalogData: VasService[] = [
  {
    id: "vas-01",
    code: "ASIACELL-TOPUP",
    name: "Asiacell Airtime & Data",
    category: "telecom",
    provider: "Asiacell Switch",
    feeType: "percentage",
    feeValue: "1.25%",
    status: "ACTIVE",
    successRate: 98.4,
    dailyVolumeIqd: 45_200_000,
    txCount24h: 3120,
    supportedChannels: ["POS", "SoftPOS", "QR"],
    bank: "QiCard",
  },
  {
    id: "vas-02",
    code: "ZAIN-TOPUP",
    name: "Zain Iraq Recharge",
    category: "telecom",
    provider: "Zain Switch",
    feeType: "percentage",
    feeValue: "1.20%",
    status: "ACTIVE",
    successRate: 99.1,
    dailyVolumeIqd: 62_800_000,
    txCount24h: 4410,
    supportedChannels: ["POS", "SoftPOS", "QR"],
    bank: "Al Qaseh",
  },
  {
    id: "vas-03",
    code: "MOE-BILLPAY",
    name: "Ministry of Electricity Bill",
    category: "utility",
    provider: "National Utility Gateway",
    feeType: "flat",
    feeValue: "500 IQD",
    status: "ACTIVE",
    successRate: 94.7,
    dailyVolumeIqd: 28_400_000,
    txCount24h: 890,
    supportedChannels: ["POS", "PORTAL"],
    bank: "Tabadul",
  },
  {
    id: "vas-04",
    code: "DCC-FX",
    name: "Dynamic Currency Conversion",
    category: "dcc",
    provider: "FX Orchestrator Core",
    feeType: "percentage",
    feeValue: "2.75%",
    status: "ACTIVE",
    successRate: 99.8,
    dailyVolumeIqd: 118_500_000,
    txCount24h: 640,
    supportedChannels: ["POS", "SoftPOS"],
    bank: "Nass",
  },
  {
    id: "vas-05",
    code: "KOREK-TOPUP",
    name: "Korek Telecom Voucher",
    category: "telecom",
    provider: "Korek Direct",
    feeType: "percentage",
    feeValue: "1.30%",
    status: "ACTIVE",
    successRate: 97.2,
    dailyVolumeIqd: 18_150_000,
    txCount24h: 980,
    supportedChannels: ["POS", "SoftPOS"],
    bank: "Amwal",
  },
  {
    id: "vas-06",
    code: "MOW-WATER",
    name: "Baghdad Water Authority",
    category: "utility",
    provider: "Municipal Gateway",
    feeType: "flat",
    feeValue: "250 IQD",
    status: "ACTIVE",
    successRate: 96.3,
    dailyVolumeIqd: 14_900_000,
    txCount24h: 530,
    supportedChannels: ["POS", "PORTAL"],
    bank: "QiCard",
  },
];

export const vasTransactionsData: VasTransaction[] = [
  {
    id: "vas-tx-101",
    correlationId: "e9f1-44ab-991c-1021",
    timestamp: "14:34:12.110",
    serviceCode: "ASIACELL-TOPUP",
    serviceName: "Asiacell Airtime (10,000 IQD)",
    provider: "Asiacell Switch",
    referenceNo: "07701234567",
    merchantName: "Baghdad Central Supermarket",
    terminalId: "TID-QIC-101",
    amount: 10000,
    fee: 125,
    currency: "IQD",
    status: "00 Approved",
    channel: "POS",
    bank: "QiCard",
  },
  {
    id: "vas-tx-102",
    correlationId: "c201-9a71-11ee-5541",
    timestamp: "14:32:45.892",
    serviceCode: "ZAIN-TOPUP",
    serviceName: "Zain Iraq 25,000 IQD Scratch Card",
    provider: "Zain Switch",
    referenceNo: "07809988771",
    merchantName: "Baghdad Al-Ghazal Pharmacy",
    terminalId: "TID-QSH-201",
    amount: 25000,
    fee: 300,
    currency: "IQD",
    status: "00 Approved",
    channel: "POS",
    bank: "Al Qaseh",
  },
  {
    id: "vas-tx-103",
    correlationId: "d718-bc91-52a1-7782",
    timestamp: "14:30:19.403",
    serviceCode: "MOE-BILLPAY",
    serviceName: "Electricity Meter Bill #992144",
    provider: "National Utility Gateway",
    referenceNo: "MTR-Baghdad-662",
    merchantName: "Basra Souq Market",
    terminalId: "TID-TBD-301",
    amount: 85000,
    fee: 500,
    currency: "IQD",
    status: "00 Approved",
    channel: "POS",
    bank: "Tabadul",
  },
  {
    id: "vas-tx-104",
    correlationId: "f018-771c-3301-4190",
    timestamp: "14:28:02.518",
    serviceCode: "DCC-FX",
    serviceName: "DCC Conversion EUR -> USD",
    provider: "FX Orchestrator Core",
    referenceNo: "FX-99812-DCC",
    merchantName: "Erbil Zheen Hotel",
    terminalId: "TID-NSS-401",
    amount: 250,
    fee: 6.87,
    currency: "USD",
    status: "00 Approved",
    channel: "POS",
    bank: "Nass",
  },
  {
    id: "vas-tx-105",
    correlationId: "a180-22c1-8841-3312",
    timestamp: "14:24:15.908",
    serviceCode: "KOREK-TOPUP",
    serviceName: "Korek 5,000 IQD Voucher",
    provider: "Korek Direct",
    referenceNo: "07509876543",
    merchantName: "Mosul Car Rentals",
    terminalId: "TID-AMW-501",
    amount: 5000,
    fee: 65,
    currency: "IQD",
    status: "00 Approved",
    channel: "SoftPOS",
    bank: "Amwal",
  },
];

/* ------------------------------- Audit Log --------------------------------- */

export type AuditActionType =
  | "LOGIN"
  | "LOGOUT"
  | "RULE_MODIFIED"
  | "RULE_DELETED"
  | "TERMINAL_PARAM_PUSH"
  | "TERMINAL_KEY_ROTATION"
  | "MERCHANT_ONBOARDED"
  | "SETTLEMENT_RESEND"
  | "USER_ROLE_CHANGED"
  | "CONFIG_OVERRIDE"
  | "ACCESS_DENIED"
  | "EXPORT_GENERATED";

export type AuditSeverity = "INFO" | "WARNING" | "CRITICAL";

export type AuditActorRole =
  | "Acquirer Ops"
  | "Platform Admin"
  | "Settlement Ops"
  | "Terminal Tech"
  | "System"
  | "API Service";

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: {
    name: string;
    email: string;
    role: AuditActorRole;
  };
  action: AuditActionType;
  severity: AuditSeverity;
  targetType:
    | "Routing Rule"
    | "Terminal"
    | "Merchant"
    | "Settlement Batch"
    | "User Account"
    | "Session"
    | "VAS Service"
    | "Gateway Config";
  targetId: string;
  diff: { before: string; after: string } | null;
  ipAddress: string;
  channel: "PORTAL" | "API" | "SYSTEM" | "VPN";
  status: "SUCCESS" | "BLOCKED";
  bank: AcquirerBank;
}

export const auditLogsData: AuditLogEntry[] = [
  {
    id: "aud-90231",
    timestamp: "2026-09-16T14:34:58.482913Z",
    actor: { name: "Arihan Kareem", email: "arihan.kareem@edge-bp.com", role: "Platform Admin" },
    action: "CONFIG_OVERRIDE",
    severity: "CRITICAL",
    targetType: "Gateway Config",
    targetId: "CFG-GW-BAGHDAD-02",
    diff: { before: "host_timeout_ms=30000", after: "host_timeout_ms=12000" },
    ipAddress: "10.20.4.117",
    channel: "PORTAL",
    status: "SUCCESS",
    bank: "QiCard",
  },
  {
    id: "aud-90230",
    timestamp: "2026-09-16T14:31:12.091744Z",
    actor: { name: "System Scheduler", email: "svc-scheduler@edge-bp.com", role: "System" },
    action: "TERMINAL_KEY_ROTATION",
    severity: "CRITICAL",
    targetType: "Terminal",
    targetId: "TID-QSH-201",
    diff: { before: "TMK sha256:9c1e…4a7f (v3)", after: "TMK sha256:b83d…11ce (v4)" },
    ipAddress: "169.254.0.9",
    channel: "SYSTEM",
    status: "SUCCESS",
    bank: "Al Qaseh",
  },
  {
    id: "aud-90229",
    timestamp: "2026-09-16T14:28:47.668102Z",
    actor: { name: "Layla Al-Jubouri", email: "layla.jubouri@edge-bp.com", role: "Acquirer Ops" },
    action: "RULE_MODIFIED",
    severity: "WARNING",
    targetType: "Routing Rule",
    targetId: "rule-1024",
    diff: { before: "BPC Host (60%)", after: "BPC Host (100%)" },
    ipAddress: "172.18.22.54",
    channel: "PORTAL",
    status: "SUCCESS",
    bank: "Tabadul",
  },
  {
    id: "aud-90228",
    timestamp: "2026-09-16T14:22:03.310285Z",
    actor: { name: "Unknown Operator", email: "n/a", role: "Acquirer Ops" },
    action: "ACCESS_DENIED",
    severity: "CRITICAL",
    targetType: "User Account",
    targetId: "USR-2214",
    diff: null,
    ipAddress: "185.77.103.22",
    channel: "VPN",
    status: "BLOCKED",
    bank: "Nass",
  },
  {
    id: "aud-90227",
    timestamp: "2026-09-16T14:15:39.774550Z",
    actor: { name: "Hawraz Salah", email: "hawraz.salah@edge-bp.com", role: "Terminal Tech" },
    action: "TERMINAL_PARAM_PUSH",
    severity: "INFO",
    targetType: "Terminal",
    targetId: "TID-AMW-501",
    diff: { before: "paramVer=v2.1", after: "paramVer=v2.4" },
    ipAddress: "10.20.9.31",
    channel: "PORTAL",
    status: "SUCCESS",
    bank: "Amwal",
  },
];

/* ------------- Routing Engine & Destination Protocols --------------- */

export type SourceInstitution = "QiCard" | "Al-Taif" | "CBI" | "EBE National" | "Al Qaseh" | "Tabadul" | "Nass" | "Amwal";
export type SourceChannel = "POS Terminal" | "SoftPOS" | "E-Commerce Ingress" | "QR Dynamic";
export type RuleCategory = "Transaction Route" | "VAS Service Route";
export type TransactionType = "0200 - Sale / Purchase" | "0100 - Pre-Authorization" | "0400 - Reversal" | "0800 - Echo";
export type VasStage = "Synchronous In-Flight (Pre-Host)" | "Post-Authorization Reward" | "Bill Presentment Inquiry";
export type DccProvider = "QiCard DCC Middleware" | "Fexco DCC Engine" | "Planet Payment" | "Acquirer Direct";
export type DestCategory = "Transaction Host" | "VAS Service";

export type OutboundProtocol =
  | "ISO 8583:1987 (TSYS)"
  | "ISO 8583:1993 (SelectSystem)"
  | "SmartVista / AS 2805"
  | "WAY4 / ISO 8583:2003"
  | "REST JSON API"
  | "HTTPS REST"
  | "ISO 20022 (pacs.008)"
  | "ISO 8583 Custom / WebService"
  | "REST JSON / SOAP";

export type TlsMode = "mTLS (Mutual TLS)" | "One-Way TLS" | "None / TCP Direct";

export type MediationType =
  | "Pass-Through"
  | "JSON Ingress ──► ISO 8583:1987 Outbound"
  | "JSON Ingress ──► ISO 8583:1993 Outbound"
  | "JSON Ingress ──► AS 2805 Outbound"
  | "JSON Ingress ──► WAY4 ISO Outbound"
  | "JSON Ingress ──► VAS REST In-Flight"
  | "JSON Ingress ──► Installments Engine"
  | "JSON Ingress ──► ISO 20022 pacs.008"
  | "JSON Ingress ──► CBI EBPP Switch"
  | "JSON Ingress ──► Tasdeed National Engine";

export type DestProtocol = OutboundProtocol;
export type DriftMode = "Warn-and-Allow" | "Strict Reject";
export type RuleTone = "green" | "cyan" | "violet" | "blue" | "amber" | "emerald" | "slate" | "rose";

export interface RoutingRule {
  id: string;
  name: string;
  category: RuleCategory;
  sourceInstitution: SourceInstitution;
  bank: AcquirerBank;
  sourceChannel: SourceChannel;
  transactionType?: TransactionType;
  vasStage?: VasStage;
  useThreshold: boolean;
  amountThresholdIqd?: number;
  dccEnabled: boolean;
  dccProvider?: DccProvider;
  destinationId: string;
  destProtocol: DestProtocol;
  hostName: string;
  hostIp: string;
  hostPort: number;
  tlsMode: TlsMode;
  certName: string;
  mediationType: MediationType;
  tone: RuleTone;
  matchRate: number;
  evaluatedMs: number;
  updatedAt: string;
  /** Production rule deployment freeze lock. */
  isLocked?: boolean;
}

export const sourceInstitutions: SourceInstitution[] = [
  "QiCard",
  "Al-Taif",
  "CBI",
  "EBE National",
  "Al Qaseh",
  "Tabadul",
  "Nass",
  "Amwal",
];

export const sourceChannels: SourceChannel[] = [
  "POS Terminal",
  "SoftPOS",
  "E-Commerce Ingress",
  "QR Dynamic",
];

export const transactionTypes: TransactionType[] = [
  "0200 - Sale / Purchase",
  "0100 - Pre-Authorization",
  "0400 - Reversal",
  "0800 - Echo",
];

export const vasStages: VasStage[] = [
  "Synchronous In-Flight (Pre-Host)",
  "Post-Authorization Reward",
  "Bill Presentment Inquiry",
];

export const dccProviders: DccProvider[] = [
  "QiCard DCC Middleware",
  "Fexco DCC Engine",
  "Planet Payment",
  "Acquirer Direct",
];

export const outboundProtocols: OutboundProtocol[] = [
  "ISO 8583:1987 (TSYS)",
  "ISO 8583:1993 (SelectSystem)",
  "SmartVista / AS 2805",
  "WAY4 / ISO 8583:2003",
  "REST JSON API",
  "HTTPS REST",
  "ISO 20022 (pacs.008)",
  "ISO 8583 Custom / WebService",
  "REST JSON / SOAP",
];

export const tlsModes: TlsMode[] = [
  "mTLS (Mutual TLS)",
  "One-Way TLS",
  "None / TCP Direct",
];

export const certLibrary: string[] = [
  "tsys-client-prod-2026.crt",
  "s2m-ca.crt",
  "bpc-sv-prod.crt",
  "openway-client.crt",
  "API Token Vault",
  "aqsaty-mtls.crt",
  "billpay-hub.crt",
  "cbi-ebpp.crt",
  "tasdeed-gw.crt",
];

export interface DestProtocolAdapter {
  category: DestCategory;
  id: string;
  label: string;
  outboundProtocol: OutboundProtocol;
  hostName: string;
  hostIp: string;
  hostPort: string;
  tlsMode: TlsMode;
  certName: string;
  mediationType: MediationType;
  tone: RuleTone;
}

export const destinationHosts: DestProtocolAdapter[] = [
  {
    category: "Transaction Host",
    id: "tsys",
    label: "TSYS Host",
    outboundProtocol: "ISO 8583:1987 (TSYS)",
    hostName: "TSYS Host",
    hostIp: "196.21.44.12",
    hostPort: "7010",
    tlsMode: "mTLS (Mutual TLS)",
    certName: "tsys-client-prod-2026.crt",
    mediationType: "JSON Ingress ──► ISO 8583:1987 Outbound",
    tone: "emerald",
  },
  {
    category: "Transaction Host",
    id: "s2m",
    label: "S2M Host",
    outboundProtocol: "ISO 8583:1993 (SelectSystem)",
    hostName: "S2M Host",
    hostIp: "196.21.45.20",
    hostPort: "8012",
    tlsMode: "One-Way TLS",
    certName: "s2m-ca.crt",
    mediationType: "JSON Ingress ──► ISO 8583:1993 Outbound",
    tone: "emerald",
  },
  {
    category: "Transaction Host",
    id: "bpc",
    label: "BPC Host",
    outboundProtocol: "SmartVista / AS 2805",
    hostName: "BPC Host",
    hostIp: "196.21.46.15",
    hostPort: "9100",
    tlsMode: "mTLS (Mutual TLS)",
    certName: "bpc-sv-prod.crt",
    mediationType: "JSON Ingress ──► AS 2805 Outbound",
    tone: "emerald",
  },
  {
    category: "Transaction Host",
    id: "openway",
    label: "OpenWay Host",
    outboundProtocol: "WAY4 / ISO 8583:2003",
    hostName: "OpenWay Host",
    hostIp: "196.21.47.88",
    hostPort: "8443",
    tlsMode: "mTLS (Mutual TLS)",
    certName: "openway-client.crt",
    mediationType: "JSON Ingress ──► WAY4 ISO Outbound",
    tone: "emerald",
  },
  {
    category: "VAS Service",
    id: "leuonova",
    label: "Leuonova",
    outboundProtocol: "REST JSON API",
    hostName: "Leuonova",
    hostIp: "10.50.12.30",
    hostPort: "443",
    tlsMode: "One-Way TLS",
    certName: "API Token Vault",
    mediationType: "JSON Ingress ──► VAS REST In-Flight",
    tone: "amber",
  },
  {
    category: "VAS Service",
    id: "aqsaty",
    label: "Aqsaty",
    outboundProtocol: "HTTPS REST",
    hostName: "Aqsaty",
    hostIp: "10.50.14.10",
    hostPort: "8443",
    tlsMode: "mTLS (Mutual TLS)",
    certName: "aqsaty-mtls.crt",
    mediationType: "JSON Ingress ──► VAS REST In-Flight",
    tone: "amber",
  },
  {
    category: "VAS Service",
    id: "bill-payment",
    label: "Bill Payment",
    outboundProtocol: "ISO 20022 (pacs.008)",
    hostName: "Bill Payment",
    hostIp: "10.50.18.5",
    hostPort: "9090",
    tlsMode: "mTLS (Mutual TLS)",
    certName: "billpay-hub.crt",
    mediationType: "JSON Ingress ──► ISO 20022 pacs.008",
    tone: "amber",
  },
  {
    category: "VAS Service",
    id: "cbi-bill-payment",
    label: "CBI Bill Payment",
    outboundProtocol: "ISO 8583 Custom / WebService",
    hostName: "CBI Bill Payment",
    hostIp: "10.50.20.101",
    hostPort: "7050",
    tlsMode: "mTLS (Mutual TLS)",
    certName: "cbi-ebpp.crt",
    mediationType: "JSON Ingress ──► CBI EBPP Switch",
    tone: "amber",
  },
  {
    category: "VAS Service",
    id: "tasdeed",
    label: "Tasdeed",
    outboundProtocol: "REST JSON / SOAP",
    hostName: "Tasdeed",
    hostIp: "10.50.22.40",
    hostPort: "443",
    tlsMode: "mTLS (Mutual TLS)",
    certName: "tasdeed-gw.crt",
    mediationType: "JSON Ingress ──► Tasdeed National Engine",
    tone: "amber",
  },
];

export function destinationOptionsFor(category: RuleCategory): DestProtocolAdapter[] {
  return category === "Transaction Route"
    ? destinationHosts.filter((h) => h.category === "Transaction Host")
    : destinationHosts.filter((h) => h.category === "VAS Service");
}

export function mediationFor(category: RuleCategory, destinationId: string): MediationType {
  return (
    destinationHosts.find((h) => h.id === destinationId)?.mediationType ??
    "Pass-Through"
  );
}

export const integrationProtocolSpecs = [
  "ISO 8583",
  "AS 2805",
  "Custom Binary",
  "XML/SOAP",
] as const;

export type IntegrationProtocolSpec =
  (typeof integrationProtocolSpecs)[number];

export const routingRules: RoutingRule[] = [
  /* QiCard Rules */
  {
    id: "rule-1002",
    name: "QiCard / POS / TSYS / DCC",
    category: "Transaction Route",
    sourceInstitution: "QiCard",
    bank: "QiCard",
    sourceChannel: "POS Terminal",
    transactionType: "0200 - Sale / Purchase",
    useThreshold: false,
    dccEnabled: true,
    dccProvider: "QiCard DCC Middleware",
    destinationId: "tsys",
    destProtocol: "ISO 8583:1987 (TSYS)",
    hostName: "TSYS Host",
    hostIp: "196.21.44.12",
    hostPort: 7010,
    tlsMode: "mTLS (Mutual TLS)",
    certName: "tsys-client-prod-2026.crt",
    mediationType: "JSON Ingress ──► ISO 8583:1987 Outbound",
    tone: "emerald",
    matchRate: 99.2,
    evaluatedMs: 8,
    updatedAt: "2026-07-02 12:08",
    isLocked: true,
  },
  {
    id: "rule-1055",
    name: "QiCard / QR / BPC Direct",
    category: "Transaction Route",
    sourceInstitution: "QiCard",
    bank: "QiCard",
    sourceChannel: "QR Dynamic",
    transactionType: "0200 - Sale / Purchase",
    useThreshold: true,
    amountThresholdIqd: 1_000_000,
    dccEnabled: false,
    destinationId: "bpc",
    destProtocol: "SmartVista / AS 2805",
    hostName: "BPC Host",
    hostIp: "196.21.46.15",
    hostPort: 9100,
    tlsMode: "mTLS (Mutual TLS)",
    certName: "bpc-sv-prod.crt",
    mediationType: "JSON Ingress ──► AS 2805 Outbound",
    tone: "emerald",
    matchRate: 98.1,
    evaluatedMs: 11,
    updatedAt: "2026-07-02 11:22",
    isLocked: false,
  },

  /* Al Qaseh Islamic Rules */
  {
    id: "rule-1015",
    name: "Al Qaseh / SoftPOS / S2M Host",
    category: "Transaction Route",
    sourceInstitution: "Al Qaseh",
    bank: "Al Qaseh",
    sourceChannel: "SoftPOS",
    transactionType: "0100 - Pre-Authorization",
    useThreshold: false,
    dccEnabled: false,
    destinationId: "s2m",
    destProtocol: "ISO 8583:1993 (SelectSystem)",
    hostName: "S2M Host",
    hostIp: "196.21.45.20",
    hostPort: 8012,
    tlsMode: "One-Way TLS",
    certName: "s2m-ca.crt",
    mediationType: "JSON Ingress ──► ISO 8583:1993 Outbound",
    tone: "emerald",
    matchRate: 96.7,
    evaluatedMs: 9,
    updatedAt: "2026-07-02 12:02",
    isLocked: true,
  },
  {
    id: "rule-1068",
    name: "Al Qaseh / E-Commerce / CBI EBPP",
    category: "VAS Service Route",
    sourceInstitution: "Al Qaseh",
    bank: "Al Qaseh",
    sourceChannel: "E-Commerce Ingress",
    vasStage: "Bill Presentment Inquiry",
    useThreshold: false,
    dccEnabled: false,
    destinationId: "cbi-bill-payment",
    destProtocol: "ISO 8583 Custom / WebService",
    hostName: "CBI Bill Payment",
    hostIp: "10.50.20.101",
    hostPort: 7050,
    tlsMode: "mTLS (Mutual TLS)",
    certName: "cbi-ebpp.crt",
    mediationType: "JSON Ingress ──► CBI EBPP Switch",
    tone: "amber",
    matchRate: 99.0,
    evaluatedMs: 7,
    updatedAt: "2026-07-02 10:12",
    isLocked: false,
  },

  /* Tabadul Switch Rules */
  {
    id: "rule-1024",
    name: "Tabadul / QR / Bill Payment Hub",
    category: "VAS Service Route",
    sourceInstitution: "Tabadul",
    bank: "Tabadul",
    sourceChannel: "QR Dynamic",
    vasStage: "Bill Presentment Inquiry",
    useThreshold: false,
    dccEnabled: false,
    destinationId: "bill-payment",
    destProtocol: "ISO 20022 (pacs.008)",
    hostName: "Bill Payment",
    hostIp: "10.50.18.5",
    hostPort: 9090,
    tlsMode: "mTLS (Mutual TLS)",
    certName: "billpay-hub.crt",
    mediationType: "JSON Ingress ──► ISO 20022 pacs.008",
    tone: "amber",
    matchRate: 99.9,
    evaluatedMs: 6,
    updatedAt: "2026-07-02 11:55",
    isLocked: true,
  },
  {
    id: "rule-1077",
    name: "Tabadul / SoftPOS / Leuonova",
    category: "VAS Service Route",
    sourceInstitution: "Tabadul",
    bank: "Tabadul",
    sourceChannel: "SoftPOS",
    vasStage: "Synchronous In-Flight (Pre-Host)",
    useThreshold: false,
    dccEnabled: false,
    destinationId: "leuonova",
    destProtocol: "REST JSON API",
    hostName: "Leuonova",
    hostIp: "10.50.12.30",
    hostPort: 443,
    tlsMode: "One-Way TLS",
    certName: "API Token Vault",
    mediationType: "JSON Ingress ──► VAS REST In-Flight",
    tone: "amber",
    matchRate: 97.9,
    evaluatedMs: 9,
    updatedAt: "2026-07-01 21:03",
    isLocked: false,
  },

  /* Nass Payment Network Rules */
  {
    id: "rule-1031",
    name: "Nass / E-Commerce / Tasdeed Switch",
    category: "VAS Service Route",
    sourceInstitution: "Nass",
    bank: "Nass",
    sourceChannel: "E-Commerce Ingress",
    vasStage: "Synchronous In-Flight (Pre-Host)",
    useThreshold: true,
    amountThresholdIqd: 250_000,
    dccEnabled: false,
    destinationId: "tasdeed",
    destProtocol: "REST JSON / SOAP",
    hostName: "Tasdeed",
    hostIp: "10.50.22.40",
    hostPort: 443,
    tlsMode: "mTLS (Mutual TLS)",
    certName: "tasdeed-gw.crt",
    mediationType: "JSON Ingress ──► Tasdeed National Engine",
    tone: "amber",
    matchRate: 98.8,
    evaluatedMs: 7,
    updatedAt: "2026-07-02 11:48",
    isLocked: true,
  },
  {
    id: "rule-1083",
    name: "Nass / POS / OpenWay Reversals",
    category: "Transaction Route",
    sourceInstitution: "Nass",
    bank: "Nass",
    sourceChannel: "POS Terminal",
    transactionType: "0400 - Reversal",
    useThreshold: false,
    dccEnabled: false,
    destinationId: "openway",
    destProtocol: "WAY4 / ISO 8583:2003",
    hostName: "OpenWay Host",
    hostIp: "196.21.47.88",
    hostPort: 8443,
    tlsMode: "mTLS (Mutual TLS)",
    certName: "openway-client.crt",
    mediationType: "JSON Ingress ──► WAY4 ISO Outbound",
    tone: "emerald",
    matchRate: 99.5,
    evaluatedMs: 6,
    updatedAt: "2026-07-01 18:31",
    isLocked: false,
  },

  /* Amwal Banking Rules */
  {
    id: "rule-1042",
    name: "Amwal / SoftPOS / Aqsaty Engine",
    category: "VAS Service Route",
    sourceInstitution: "Amwal",
    bank: "Amwal",
    sourceChannel: "SoftPOS",
    vasStage: "Post-Authorization Reward",
    useThreshold: false,
    dccEnabled: false,
    destinationId: "aqsaty",
    destProtocol: "HTTPS REST",
    hostName: "Aqsaty",
    hostIp: "10.50.14.10",
    hostPort: 8443,
    tlsMode: "mTLS (Mutual TLS)",
    certName: "aqsaty-mtls.crt",
    mediationType: "JSON Ingress ──► VAS REST In-Flight",
    tone: "amber",
    matchRate: 97.4,
    evaluatedMs: 8,
    updatedAt: "2026-07-02 11:40",
    isLocked: true,
  },
  {
    id: "rule-1090",
    name: "Amwal / POS / TSYS Direct Route",
    category: "Transaction Route",
    sourceInstitution: "Amwal",
    bank: "Amwal",
    sourceChannel: "POS Terminal",
    transactionType: "0200 - Sale / Purchase",
    useThreshold: false,
    dccEnabled: false,
    destinationId: "tsys",
    destProtocol: "ISO 8583:1987 (TSYS)",
    hostName: "TSYS Host",
    hostIp: "196.21.44.12",
    hostPort: 7010,
    tlsMode: "mTLS (Mutual TLS)",
    certName: "tsys-client-prod-2026.crt",
    mediationType: "JSON Ingress ──► ISO 8583:1987 Outbound",
    tone: "emerald",
    matchRate: 98.7,
    evaluatedMs: 7,
    updatedAt: "2026-07-01 14:15",
    isLocked: false,
  },
];

/* -------------------- Financial & Governance Data Lock Helpers -------------------- */

/**
 * Computes live aggregated KPIs dynamically from current dataset state
 * to ensure that top-level metric cards match the filtered views.
 */
export function getBankKPIs(bank: AcquirerBank, persona: Persona = "acquirer") {
  const bankTxs = filterByBank(txRows, bank).filter(
    (tx) => persona !== "merchant" || tx.merchant === "Baghdad Central Supermarket"
  );
  const bankTerms = filterByBank(terminals, bank);

  const totalCount = bankTxs.length;
  const approvedCount = bankTxs.filter((t) => t.response === "00 Approved").length;
  const approvalRate = totalCount > 0 ? ((approvedCount / totalCount) * 100).toFixed(1) : "100.0";

  const totalVolumeIqd = bankTxs
    .filter((t) => t.currency === "IQD")
    .reduce((acc, t) => acc + Number(t.amount.replace(/,/g, "")), 0);

  return {
    volumeFormatted: totalVolumeIqd.toLocaleString("en-US", { minimumFractionDigits: 2 }),
    txCount: totalCount,
    approvalRate: `${approvalRate}%`,
    activeTerminals: bankTerms.length,
  };
}

/** Determines if a settlement batch is financially sealed. */
export const isBatchSealed = (batch: BatchRow): boolean =>
  batch.isLocked && batch.status === "ACK_RECEIVED";

/** Determines if a routing rule is under production deployment lock. */
export const isRuleLocked = (rule: RoutingRule): boolean =>
  Boolean(rule.isLocked);