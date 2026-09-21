export type Persona = "acquirer" | "psp" | "merchant";

export type Channel = "POS" | "SoftPOS" | "QR";

export interface TxRow {
  id: string;
  time: string;
  corrId: string;
  channel: Channel;
  merchant: string;
  pan: string;
  amount: string;
  currency: "IQD" | "USD";
  type: "SALE" | "PRE_AUTH" | "COMPLETION";
  response: "00 Approved" | "51 Insufficient Funds" | "91 Timeout";
  tone: "green" | "red" | "amber";
}

export const txRows: TxRow[] = [
  {
    id: "tx-01",
    time: "14:32:11.084",
    corrId: "b9f2-1c4a-88e7-03f2",
    channel: "POS",
    merchant: "Kurdistan Galleria",
    pan: "4159-65**-****-1029",
    amount: "1,842,500",
    currency: "IQD",
    type: "SALE",
    response: "00 Approved",
    tone: "green",
  },
  {
    id: "tx-02",
    time: "14:31:58.912",
    corrId: "a771-c93b-4d12-9a80",
    channel: "SoftPOS",
    merchant: "Baghdad Al-Ghazal Pharmacy",
    pan: "4719-22**-****-3317",
    amount: "120,000",
    currency: "IQD",
    type: "SALE",
    response: "51 Insufficient Funds",
    tone: "red",
  },
  {
    id: "tx-03",
    time: "14:31:47.630",
    corrId: "c03d-5e10-b2aa-77fc",
    channel: "QR",
    merchant: "Basra Souq Market",
    pan: "5544-90**-****-7712",
    amount: "84.75",
    currency: "USD",
    type: "SALE",
    response: "00 Approved",
    tone: "green",
  },
  {
    id: "tx-04",
    time: "14:31:32.205",
    corrId: "e84f-21ab-9f1d-cc08",
    channel: "POS",
    merchant: "Erbil Zheen Hotel",
    pan: "4159-88**-****-2041",
    amount: "2,400,000",
    currency: "IQD",
    type: "PRE_AUTH",
    response: "00 Approved",
    tone: "green",
  },
  {
    id: "tx-05",
    time: "14:31:19.777",
    corrId: "b551-7cde-3aa4-19d6",
    channel: "SoftPOS",
    merchant: "Mosul Car Rentals",
    pan: "4024-10**-****-8890",
    amount: "350,000",
    currency: "IQD",
    type: "SALE",
    response: "91 Timeout",
    tone: "amber",
  },
  {
    id: "tx-06",
    time: "14:30:58.443",
    corrId: "a1ff-9092-4b37-5e2a",
    channel: "POS",
    merchant: "Najaf Hypermarket",
    pan: "4213-77**-****-5561",
    amount: "965,000",
    currency: "IQD",
    type: "COMPLETION",
    response: "00 Approved",
    tone: "green",
  },
  {
    id: "tx-07",
    time: "14:30:41.320",
    corrId: "d20c-33d8-1b66-9044",
    channel: "QR",
    merchant: "Kirkuk Fuel Station",
    pan: "5588-41**-****-6610",
    amount: "60.00",
    currency: "USD",
    type: "SALE",
    response: "00 Approved",
    tone: "green",
  },
  {
    id: "tx-08",
    time: "14:30:22.981",
    corrId: "f9b7-88c1-04dd-51e3",
    channel: "POS",
    merchant: "Sulaymaniyah Tech Store",
    pan: "4506-19**-****-1028",
    amount: "1,150,000",
    currency: "IQD",
    type: "SALE",
    response: "00 Approved",
    tone: "green",
  },
  {
    id: "tx-09",
    time: "14:29:58.664",
    corrId: "7d41-9ab2-c05e-1f88",
    channel: "POS",
    merchant: "Baghdad Central Supermarket",
    pan: "4159-77**-****-7729",
    amount: "486,000",
    currency: "IQD",
    type: "SALE",
    response: "00 Approved",
    tone: "green",
  },
  {
    id: "tx-10",
    time: "14:29:41.205",
    corrId: "3c98-55f7-2e6b-a410",
    channel: "QR",
    merchant: "Baghdad Central Supermarket",
    pan: "5061-22**-****-8843",
    amount: "92,500",
    currency: "IQD",
    type: "SALE",
    response: "00 Approved",
    tone: "green",
  },
  {
    id: "tx-11",
    time: "14:29:17.540",
    corrId: "9e02-b7c4-6d31-08aa",
    channel: "SoftPOS",
    merchant: "Erbil Tech",
    pan: "4719-88**-****-2214",
    amount: "1,650,000",
    currency: "IQD",
    type: "PRE_AUTH",
    response: "00 Approved",
    tone: "green",
  },
  {
    id: "tx-12",
    time: "14:28:52.316",
    corrId: "52af-0e69-d4b2-7c3e",
    channel: "POS",
    merchant: "Al-Mansour Medical",
    pan: "4213-90**-****-3357",
    amount: "2,780,000",
    currency: "IQD",
    type: "SALE",
    response: "00 Approved",
    tone: "green",
  },
  {
    id: "tx-13",
    time: "14:28:30.147",
    corrId: "c6b3-77d1-18fa-95e2",
    channel: "POS",
    merchant: "Baghdad Central Supermarket",
    pan: "4159-65**-****-5512",
    amount: "1,240,000",
    currency: "IQD",
    type: "COMPLETION",
    response: "00 Approved",
    tone: "green",
  },
];

/* --------------------- Hop-by-hop latency waterfall ------------------------ */

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
    detail: "Rule engine match · persona policy",
    tone: "bg-cobalt-blue",
  },
  {
    name: "Synchronous VAS",
    label: "Aqsati installment validation",
    latency: 85,
    detail: "VAS eligibility · pre-auth amount split",
    tone: "bg-signal-orange",
  },
  {
    name: "Host Payment Switch",
    label: "Authorization",
    latency: 165,
    detail: "Issuer routing · authorization response",
    tone: "bg-brand-orange-tint",
  },
  {
    name: "Egress",
    label: "Response Serialized",
    latency: 4,
    detail: "ISO 8583 rebuild · terminal delivery",
    tone: "bg-emerald-green",
  },
];

/* ------------------------ Stuck / unresolved queue ------------------------ */

export type StuckStatus =
  | "HOST_TIMEOUT"
  | "UNKNOWN_OUTCOME"
  | "CONFIG_DRIFT_BLOCKED";

export interface StuckRow {
  id: string;
  amount: string;
  type: string;
  status: StuckStatus;
  aging: string;
  tone: "red" | "amber" | "blue";
  time: string;
  merchant: string;
}

export const stuckRows: StuckRow[] = [
  {
    id: "stk-01",
    amount: "350,000",
    type: "Pre-Auth Completion",
    status: "HOST_TIMEOUT",
    aging: "18m",
    tone: "red",
    time: "14:13:09",
    merchant: "Mosul Car Rentals",
  },
  {
    id: "stk-02",
    amount: "120,000",
    type: "SoftPOS Purchase",
    status: "UNKNOWN_OUTCOME",
    aging: "6m",
    tone: "amber",
    time: "14:25:44",
    merchant: "Baghdad Al-Ghazal Pharmacy",
  },
  {
    id: "stk-03",
    amount: "85,000",
    type: "POS Sale",
    status: "CONFIG_DRIFT_BLOCKED",
    aging: "2m",
    tone: "blue",
    time: "14:29:11",
    merchant: "Karbala Flower Boutique",
  },
];

/* --------------------------- Terminal fleet ------------------------------- */

export interface TerminalRow {
  tid: string;
  model: "PAX A920" | "SUNMI V2s" | "NEXGO N86";
  merchant: string;
  appVer: string;
  paramVer: string;
  drift: "In Sync" | "Drift Detected";
  lastPing: string;
}

export const terminals: TerminalRow[] = [
  {
    tid: "TID-10488",
    model: "PAX A920",
    merchant: "Kurdistan Galleria",
    appVer: "v4.3.1",
    paramVer: "v2.1",
    drift: "Drift Detected",
    lastPing: "2s ago",
  },
  {
    tid: "TID-10493",
    model: "SUNMI V2s",
    merchant: "Baghdad Al-Ghazal Pharmacy",
    appVer: "v4.3.0",
    paramVer: "v2.4",
    drift: "In Sync",
    lastPing: "9s ago",
  },
  {
    tid: "TID-10501",
    model: "NEXGO N86",
    merchant: "Basra Souq Market",
    appVer: "v4.2.8",
    paramVer: "v2.4",
    drift: "In Sync",
    lastPing: "31s ago",
  },
  {
    tid: "TID-10512",
    model: "PAX A920",
    merchant: "Erbil Zheen Hotel",
    appVer: "v4.3.1",
    paramVer: "v2.1",
    drift: "Drift Detected",
    lastPing: "1m ago",
  },
  {
    tid: "TID-10520",
    model: "SUNMI V2s",
    merchant: "Kirkuk Fuel Station",
    appVer: "v4.3.0",
    paramVer: "v2.4",
    drift: "In Sync",
    lastPing: "4s ago",
  },
];

/* ----------------------------- Settlements -------------------------------- */

export interface BatchRow {
  id: string;
  dest: string;
  volume: string;
  transport: "SFTP" | "API Push";
  status: "ACK_RECEIVED" | "TRANSMITTED" | "NACK_REJECTED";
  timestamp: string;
  rev?: string;
}

export const batches: BatchRow[] = [
  {
    id: "STL-88213",
    dest: "Rafidain Bank",
    volume: "612,400,000",
    transport: "SFTP",
    status: "ACK_RECEIVED",
    timestamp: "03:15:02",
  },
  {
    id: "STL-88214",
    dest: "Baghdad CIB",
    volume: "388,150,000",
    transport: "API Push",
    status: "ACK_RECEIVED",
    timestamp: "03:15:09",
  },
  {
    id: "STL-88215",
    dest: "CBI Settlement",
    volume: "1,842,500,000",
    transport: "SFTP",
    status: "TRANSMITTED",
    timestamp: "03:15:14",
    rev: "REV-2",
  },
  {
    id: "STL-88216",
    dest: "Trade Bank of Iraq",
    volume: "204,900,000",
    transport: "API Push",
    status: "ACK_RECEIVED",
    timestamp: "03:15:21",
  },
  {
    id: "STL-88217",
    dest: "Zain Cash PSP",
    volume: "96,300,000",
    transport: "API Push",
    status: "NACK_REJECTED",
    timestamp: "03:15:27",
  },
  {
    id: "STL-88218",
    dest: "Al-Mansour Bank",
    volume: "155,720,000",
    transport: "SFTP",
    status: "ACK_RECEIVED",
    timestamp: "03:15:33",
  },
  {
    id: "STL-88219",
    dest: "National Bank of Iraq",
    volume: "288,610,000",
    transport: "API Push",
    status: "ACK_RECEIVED",
    timestamp: "03:15:40",
  },
  {
    id: "STL-88220",
    dest: "Union Bank",
    volume: "77,850,000",
    transport: "SFTP",
    status: "ACK_RECEIVED",
    timestamp: "03:15:46",
  },
];

/* ----------------------- Onboarding propagation steps --------------------- */

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
// ==========================================
// VAS (Value-Added Services) Types & Dataset
// ==========================================

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
  },
  {
    id: "vas-05",
    code: "KOREK-TOPUP",
    name: "Korek Telecom Voucher",
    category: "telecom",
    provider: "Korek Direct",
    feeType: "percentage",
    feeValue: "1.30%",
    status: "MAINTENANCE",
    successRate: 81.2,
    dailyVolumeIqd: 8_150_000,
    txCount24h: 410,
    supportedChannels: ["POS"],
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
    terminalId: "TID-884102",
    amount: 10000,
    fee: 125,
    currency: "IQD",
    status: "00 Approved",
    channel: "POS",
  },
  {
    id: "vas-tx-102",
    correlationId: "c201-9a71-11ee-5541",
    timestamp: "14:32:45.892",
    serviceCode: "MOE-BILLPAY",
    serviceName: "Electricity Meter Bill #992144",
    provider: "National Utility Gateway",
    referenceNo: "MTR-Baghdad-662",
    merchantName: "Kurdish Galleria",
    terminalId: "TID-441092",
    amount: 85000,
    fee: 500,
    currency: "IQD",
    status: "00 Approved",
    channel: "POS",
  },
  {
    id: "vas-tx-103",
    correlationId: "d718-bc91-52a1-7782",
    timestamp: "14:30:19.403",
    serviceCode: "DCC-FX",
    serviceName: "DCC Conversion EUR -> USD",
    provider: "FX Orchestrator Core",
    referenceNo: "FX-99812-DCC",
    merchantName: "Erbil Zheen Hotel",
    terminalId: "TID-110294",
    amount: 250,
    fee: 6.87,
    currency: "USD",
    status: "00 Approved",
    channel: "POS",
  },
  {
    id: "vas-tx-104",
    correlationId: "f018-771c-3301-4190",
    timestamp: "14:28:02.518",
    serviceCode: "KOREK-TOPUP",
    serviceName: "Korek 5,000 IQD Voucher",
    provider: "Korek Direct",
    referenceNo: "07509876543",
    merchantName: "Basra Souq Market",
    terminalId: "TID-772183",
    amount: 5000,
    fee: 65,
    currency: "IQD",
    status: "91 Switch Timeout",
    channel: "SoftPOS",
  },
];

/* ============================== Audit Log ================================== */

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
  /** ISO-8601 timestamp with microsecond precision. */
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
  /** Field-level modification diff (null for non-mutating events). */
  diff: { before: string; after: string } | null;
  ipAddress: string;
  channel: "PORTAL" | "API" | "SYSTEM" | "VPN";
  status: "SUCCESS" | "BLOCKED";
}

export const auditLogsData: AuditLogEntry[] = [
  {
    id: "aud-90231",
    timestamp: "2026-09-16T14:34:58.482913Z",
    actor: {
      name: "Arihan Kareem",
      email: "arihan.kareem@edge-bp.com",
      role: "Platform Admin",
    },
    action: "CONFIG_OVERRIDE",
    severity: "CRITICAL",
    targetType: "Gateway Config",
    targetId: "CFG-GW-BAGHDAD-02",
    diff: {
      before: "host_timeout_ms=30000",
      after: "host_timeout_ms=12000",
    },
    ipAddress: "10.20.4.117",
    channel: "PORTAL",
    status: "SUCCESS",
  },
  {
    id: "aud-90230",
    timestamp: "2026-09-16T14:31:12.091744Z",
    actor: {
      name: "System Scheduler",
      email: "svc-scheduler@edge-bp.com",
      role: "System",
    },
    action: "TERMINAL_KEY_ROTATION",
    severity: "CRITICAL",
    targetType: "Terminal",
    targetId: "TID-10488",
    diff: {
      before: "TMK sha256:9c1e…4a7f (v3)",
      after: "TMK sha256:b83d…11ce (v4)",
    },
    ipAddress: "169.254.0.9",
    channel: "SYSTEM",
    status: "SUCCESS",
  },
  {
    id: "aud-90229",
    timestamp: "2026-09-16T14:28:47.668102Z",
    actor: {
      name: "Layla Al-Jubouri",
      email: "layla.jubouri@edge-bp.com",
      role: "Acquirer Ops",
    },
    action: "RULE_MODIFIED",
    severity: "WARNING",
    targetType: "Routing Rule",
    targetId: "R-004",
    diff: {
      before: "SoftPOS mid-ticket → Switch A (60%)",
      after: "SoftPOS mid-ticket → Switch A (85%)",
    },
    ipAddress: "172.18.22.54",
    channel: "PORTAL",
    status: "SUCCESS",
  },
  {
    id: "aud-90228",
    timestamp: "2026-09-16T14:22:03.310285Z",
    actor: {
      name: "Unknown Operator",
      email: "n/a",
      role: "Acquirer Ops",
    },
    action: "ACCESS_DENIED",
    severity: "CRITICAL",
    targetType: "User Account",
    targetId: "USR-2214",
    diff: null,
    ipAddress: "185.77.103.22",
    channel: "VPN",
    status: "BLOCKED",
  },
  {
    id: "aud-90227",
    timestamp: "2026-09-16T14:15:39.774550Z",
    actor: {
      name: "Hawraz Salah",
      email: "hawraz.salah@edge-bp.com",
      role: "Terminal Tech",
    },
    action: "TERMINAL_PARAM_PUSH",
    severity: "INFO",
    targetType: "Terminal",
    targetId: "TID-10512",
    diff: {
      before: "paramVer=v2.1",
      after: "paramVer=v2.4",
    },
    ipAddress: "10.20.9.31",
    channel: "PORTAL",
    status: "SUCCESS",
  },
  {
    id: "aud-90226",
    timestamp: "2026-09-16T13:58:21.905618Z",
    actor: {
      name: "Dara Nouri",
      email: "dara.nouri@edge-bp.com",
      role: "Settlement Ops",
    },
    action: "SETTLEMENT_RESEND",
    severity: "WARNING",
    targetType: "Settlement Batch",
    targetId: "STL-88217",
    diff: {
      before: "status=NACK_REJECTED",
      after: "status=TRANSMITTED (REV-2)",
    },
    ipAddress: "172.18.30.8",
    channel: "PORTAL",
    status: "SUCCESS",
  },
  {
    id: "aud-90225",
    timestamp: "2026-09-16T13:47:55.118307Z",
    actor: {
      name: "Rojin Ahmad",
      email: "rojin.ahmad@edge-bp.com",
      role: "Platform Admin",
    },
    action: "USER_ROLE_CHANGED",
    severity: "CRITICAL",
    targetType: "User Account",
    targetId: "USR-1180",
    diff: {
      before: "role=Terminal Tech",
      after: "role=Acquirer Ops",
    },
    ipAddress: "10.20.4.117",
    channel: "PORTAL",
    status: "SUCCESS",
  },
  {
    id: "aud-90224",
    timestamp: "2026-09-16T13:31:08.229041Z",
    actor: {
      name: "API Gateway",
      email: "svc-settlement-api@edge-bp.com",
      role: "API Service",
    },
    action: "EXPORT_GENERATED",
    severity: "INFO",
    targetType: "Settlement Batch",
    targetId: "STL-88215",
    diff: null,
    ipAddress: "169.254.0.4",
    channel: "API",
    status: "SUCCESS",
  },
  {
    id: "aud-90223",
    timestamp: "2026-09-16T13:12:44.662930Z",
    actor: {
      name: "Layla Al-Jubouri",
      email: "layla.jubouri@edge-bp.com",
      role: "Acquirer Ops",
    },
    action: "MERCHANT_ONBOARDED",
    severity: "INFO",
    targetType: "Merchant",
    targetId: "MRC-77410",
    diff: {
      before: "state=PENDING_KYC",
      after: "state=ACTIVE (MCC 5541)",
    },
    ipAddress: "172.18.22.54",
    channel: "PORTAL",
    status: "SUCCESS",
  },
  {
    id: "aud-90222",
    timestamp: "2026-09-16T12:58:17.004872Z",
    actor: {
      name: "Unknown Operator",
      email: "n/a",
      role: "Acquirer Ops",
    },
    action: "ACCESS_DENIED",
    severity: "WARNING",
    targetType: "VAS Service",
    targetId: "VAS-KOREK-TOPUP",
    diff: null,
    ipAddress: "185.77.103.22",
    channel: "API",
    status: "BLOCKED",
  },
  {
    id: "aud-90221",
    timestamp: "2026-09-16T12:41:33.517064Z",
    actor: {
      name: "System Scheduler",
      email: "svc-scheduler@edge-bp.com",
      role: "System",
    },
    action: "RULE_DELETED",
    severity: "WARNING",
    targetType: "Routing Rule",
    targetId: "R-017",
    diff: {
      before: "QR low-value → Fast Lane (ENABLED)",
      after: "(rule archived, 90-day retention)",
    },
    ipAddress: "169.254.0.9",
    channel: "SYSTEM",
    status: "SUCCESS",
  },
  {
    id: "aud-90220",
    timestamp: "2026-09-16T12:20:02.870415Z",
    actor: {
      name: "Arihan Kareem",
      email: "arihan.kareem@edge-bp.com",
      role: "Platform Admin",
    },
    action: "LOGIN",
    severity: "INFO",
    targetType: "Session",
    targetId: "SES-55f2-91ab",
    diff: null,
    ipAddress: "10.20.4.117",
    channel: "VPN",
    status: "SUCCESS",
  },
];

/* ------------- Multi-tenant protocol mediation routing model --------------- */

export type SourceInstitution =
  | "QiCard"
  | "Al-Taif"
  | "CBI"
  | "EBE National";

export type SourceChannel =
  | "POS Terminal"
  | "SoftPOS"
  | "E-Commerce Ingress"
  | "QR Dynamic";

export type RuleCategory = "Transaction Route" | "VAS Service Route";

export type TransactionType =
  | "0200 - Sale / Purchase"
  | "0100 - Pre-Authorization"
  | "0400 - Reversal"
  | "0800 - Echo";

export type VasStage =
  | "Synchronous In-Flight (Pre-Host)"
  | "Post-Authorization Reward"
  | "Bill Presentment Inquiry";

export type DccProvider =
  | "QiCard DCC Middleware"
  | "Fexco DCC Engine"
  | "Planet Payment"
  | "Acquirer Direct";

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

export type TlsMode =
  | "mTLS (Mutual TLS)"
  | "One-Way TLS"
  | "None / TCP Direct";

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

export type RuleTone =
  | "green"
  | "cyan"
  | "violet"
  | "blue"
  | "amber"
  | "emerald"
  | "slate"
  | "rose";

export interface RoutingRule {
  id: string;
  name: string;
  category: RuleCategory;
  sourceInstitution: SourceInstitution;
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
}

export const sourceInstitutions: SourceInstitution[] = [
  "QiCard",
  "Al-Taif",
  "CBI",
  "EBE National",
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

/** Predefined host matrix: selecting a destination seeds the full socket. */
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

/** Integration request intake — protocol specs still under evaluation. */
export const integrationProtocolSpecs = [
  "ISO 8583",
  "AS 2805",
  "Custom Binary",
  "XML/SOAP",
] as const;

export type IntegrationProtocolSpec =
  (typeof integrationProtocolSpecs)[number];

export const routingRules: RoutingRule[] = [
  {
    id: "rule-1002",
    name: "QiCard / POS / TSYS / DCC",
    category: "Transaction Route",
    sourceInstitution: "QiCard",
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
  },
  {
    id: "rule-1015",
    name: "Al-Taif / SoftPOS / S2M",
    category: "Transaction Route",
    sourceInstitution: "Al-Taif",
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
  },
  {
    id: "rule-1024",
    name: "EBE / QR / Bill Payment",
    category: "VAS Service Route",
    sourceInstitution: "EBE National",
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
  },
  {
    id: "rule-1031",
    name: "CBI / E-Commerce / Tasdeed",
    category: "VAS Service Route",
    sourceInstitution: "CBI",
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
  },
  {
    id: "rule-1042",
    name: "CBI / SoftPOS / Aqsaty Reward",
    category: "VAS Service Route",
    sourceInstitution: "CBI",
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
  },
  {
    id: "rule-1055",
    name: "EBE / QR / BPC Direct",
    category: "Transaction Route",
    sourceInstitution: "EBE National",
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
  },
  {
    id: "rule-1068",
    name: "Al-Taif / E-Commerce / CBI EBPP",
    category: "VAS Service Route",
    sourceInstitution: "Al-Taif",
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
  },
  {
    id: "rule-1077",
    name: "QiCard / SoftPOS / Leuonova",
    category: "VAS Service Route",
    sourceInstitution: "QiCard",
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
  },
  {
    id: "rule-1083",
    name: "QiCard / POS / OpenWay Reversal",
    category: "Transaction Route",
    sourceInstitution: "QiCard",
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
  },
];