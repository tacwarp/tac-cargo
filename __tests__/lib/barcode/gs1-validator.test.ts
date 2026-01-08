import { describe, it, expect } from "vitest";
import { validateGS1Barcode, formatBarcode } from "@/lib/barcode/gs1-validator";

describe("GS1 Barcode Validation", () => {
  describe("SSCC (Serial Shipping Container Code)", () => {
    it("validates correct SSCC with valid check digit", () => {
      const result = validateGS1Barcode("106141411234567897");
      expect(result.isValid).toBe(true);
      expect(result.format).toBe("SSCC");
      expect(result.checkDigitValid).toBe(true);
      expect(result.parsedData?.sscc).toBe("106141411234567897");
      expect(result.error).toBeUndefined();
    });

    it("rejects SSCC with invalid check digit", () => {
      const result = validateGS1Barcode("106141411234567898");
      expect(result.isValid).toBe(false);
      expect(result.format).toBe("SSCC");
      expect(result.checkDigitValid).toBe(false);
      expect(result.error).toContain("check digit");
    });

    it("rejects SSCC with wrong length", () => {
      const result = validateGS1Barcode("10614141123456789");
      expect(result.isValid).toBe(false);
      expect(result.format).toBe("UNKNOWN");
    });

    it("handles SSCC with whitespace", () => {
      const result = validateGS1Barcode("1 061414 11234567897");
      expect(result.isValid).toBe(true);
      expect(result.format).toBe("SSCC");
    });
  });

  describe("GTIN (Global Trade Item Number)", () => {
    it("validates GTIN-14", () => {
      const result = validateGS1Barcode("12345678901231");
      expect(result.format).toBe("GTIN-14");
      expect(result.parsedData?.gtin).toBe("12345678901231");
    });

    it("validates GTIN-13", () => {
      const result = validateGS1Barcode("1234567890128");
      expect(result.format).toBe("GTIN-13");
    });

    it("validates GTIN-12 (UPC)", () => {
      const result = validateGS1Barcode("123456789012");
      expect(result.format).toBe("GTIN-12");
    });

    it("validates GTIN-8", () => {
      const result = validateGS1Barcode("12345670");
      expect(result.format).toBe("GTIN-8");
    });

    it("rejects GTIN with invalid check digit", () => {
      const result = validateGS1Barcode("12345678901232");
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("check digit");
    });
  });

  describe("GS1-128 (Application Identifiers)", () => {
    it("parses SSCC from GS1-128", () => {
      const result = validateGS1Barcode("(00)106141411234567897");
      expect(result.isValid).toBe(true);
      expect(result.format).toBe("GS1-128");
      expect(result.parsedData?.sscc).toBe("106141411234567897");
    });

    it("parses GTIN from GS1-128", () => {
      const result = validateGS1Barcode("(01)01234567890128");
      expect(result.isValid).toBe(true);
      expect(result.parsedData?.gtin).toBe("01234567890128");
    });

    it("parses multiple Application Identifiers", () => {
      const result = validateGS1Barcode(
        "(00)106141411234567897(02)01234567890128(10)LOT123(17)250630",
      );
      expect(result.isValid).toBe(true);
      expect(result.parsedData?.sscc).toBe("106141411234567897");
      expect(result.parsedData?.gtin).toBe("01234567890128");
      expect(result.parsedData?.batch).toBe("LOT123");
      expect(result.parsedData?.expiryDate).toBe("250630");
    });

    it("parses serial number (AI 21)", () => {
      const result = validateGS1Barcode("(21)SN12345");
      expect(result.isValid).toBe(true);
      expect(result.parsedData?.serialNumber).toBe("SN12345");
    });

    it("parses production date (AI 11)", () => {
      const result = validateGS1Barcode("(11)260103");
      expect(result.isValid).toBe(true);
      expect(result.parsedData?.productionDate).toBe("260103");
    });

    it("rejects GS1-128 with no valid AIs", () => {
      const result = validateGS1Barcode("(99)INVALID");
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("No valid Application Identifiers");
    });
  });

  describe("Unknown Formats", () => {
    it("rejects empty string", () => {
      const result = validateGS1Barcode("");
      expect(result.isValid).toBe(false);
      expect(result.format).toBe("UNKNOWN");
    });

    it("rejects non-numeric SSCC", () => {
      const result = validateGS1Barcode("ABC14141123456789X");
      expect(result.isValid).toBe(false);
    });

    it("rejects random string", () => {
      const result = validateGS1Barcode("INVALID_BARCODE");
      expect(result.isValid).toBe(false);
      expect(result.format).toBe("UNKNOWN");
    });
  });

  describe("Barcode Formatting", () => {
    it("formats SSCC with spacing", () => {
      const formatted = formatBarcode("106141411234567897", "SSCC");
      expect(formatted).toBe("1 061414 11234567897");
    });

    it("formats GTIN-14 with spacing", () => {
      const formatted = formatBarcode("12345678901231", "GTIN-14");
      expect(formatted).toBe("1234 5678 9012 31");
    });

    it("formats GTIN-13 with spacing", () => {
      const formatted = formatBarcode("1234567890128", "GTIN-13");
      expect(formatted).toBe("123 4567 890128");
    });
  });
});
