import { describe, expect, it } from "vitest";
import {
  destinationHosts,
  destinationOptionsFor,
} from "../components/dashboard/data";

describe("routing-matrix", () => {
  const txOptions = destinationOptionsFor("Transaction Route");
  const vasOptions = destinationOptionsFor("VAS Service Route");

  const labels = (opts: typeof txOptions) => opts.map((o) => o.label);

  it("exposes the four acquirer transaction hosts", () => {
    expect(labels(txOptions)).toContain("TSYS Host");
    expect(labels(txOptions)).toContain("S2M Host");
    expect(labels(txOptions)).toContain("BPC Host");
    expect(labels(txOptions)).toContain("OpenWay Host");
  });

  it("exposes the five VAS service destinations", () => {
    expect(labels(vasOptions)).toContain("Leuonova");
    expect(labels(vasOptions)).toContain("Aqsaty");
    expect(labels(vasOptions)).toContain("Bill Payment");
    expect(labels(vasOptions)).toContain("CBI Bill Payment");
    expect(labels(vasOptions)).toContain("Tasdeed");
  });

  it("does not cross-bleed between categories", () => {
    const vasLabels = labels(vasOptions);
    expect(vasLabels).not.toContain("TSYS Host");
    expect(vasLabels).not.toContain("BPC Host");

    const txLabels = labels(txOptions);
    expect(txLabels).not.toContain("Leuonova");
    expect(txLabels).not.toContain("Tasdeed");
  });

  it("TSYS is pinned to ISO 8583:1987, port 7010, mTLS", () => {
    const tsys = destinationHosts.find((h) => h.id === "tsys");
    expect(tsys).toBeDefined();
    expect(tsys!.outboundProtocol).toBe("ISO 8583:1987 (TSYS)");
    expect(tsys!.hostPort).toBe("7010");
    expect(tsys!.tlsMode).toContain("mTLS");
  });

  it("Tasdeed is pinned to 10.50.22.40 on port 443 or 8443", () => {
    const tasdeed = destinationHosts.find((h) => h.id === "tasdeed");
    expect(tasdeed).toBeDefined();
    expect(tasdeed!.hostIp).toBe("10.50.22.40");
    expect(["443", "8443"]).toContain(tasdeed!.hostPort);
  });
});
