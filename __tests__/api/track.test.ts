import { describe, it, expect, vi, beforeEach } from "vitest";

const mockSupabase = {
  from: vi.fn(),
};

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(() => Promise.resolve(mockSupabase)),
}));

vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: vi.fn(() => ({
    success: true,
    remaining: 59,
    resetIn: 60000,
    limit: 60,
  })),
  getClientIp: vi.fn(() => "127.0.0.1"),
  getRateLimitHeaders: vi.fn(() => ({})),
  RATE_LIMITS: { api: { maxRequests: 60, windowMs: 60000 } },
}));

vi.mock("@/lib/logger", () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
  },
}));

describe("Tracking API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/track", () => {
    it("should return 400 if AWB is missing", async () => {
      const { GET } = await import("@/app/api/track/route");
      const request = new Request("http://localhost:3000/api/track");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.code).toBe("MISSING_AWB");
    });

    it("should return 400 for invalid AWB format", async () => {
      const { GET } = await import("@/app/api/track/route");
      const request = new Request("http://localhost:3000/api/track?awb=!!");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.code).toBe("INVALID_AWB_FORMAT");
    });

    it("should return 404 if shipment not found", async () => {
      mockSupabase.from.mockReturnValue({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() =>
              Promise.resolve({ data: null, error: { code: "PGRST116" } }),
            ),
          })),
        })),
      });

      const { GET } = await import("@/app/api/track/route");
      const request = new Request(
        "http://localhost:3000/api/track?awb=TAC123456",
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.code).toBe("SHIPMENT_NOT_FOUND");
    });

    it("should return shipment data for valid AWB", async () => {
      const mockShipment = {
        id: "ship-123",
        reference: "TAC123456",
        status: "in_transit",
        transport_mode: "air",
        weight: 5.5,
        pieces: 2,
        origin_warehouse: { code: "DEL", city: "Delhi", state: "Delhi" },
        destination_warehouse: {
          code: "IMP",
          city: "Imphal",
          state: "Manipur",
        },
      };

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === "shipments") {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn(() =>
                  Promise.resolve({ data: mockShipment, error: null }),
                ),
              })),
            })),
          };
        }
        if (table === "scan_events") {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                order: vi.fn(() => Promise.resolve({ data: [], error: null })),
              })),
            })),
          };
        }
        return { select: vi.fn() };
      });

      const { GET } = await import("@/app/api/track/route");
      const request = new Request(
        "http://localhost:3000/api/track?awb=TAC123456",
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.shipment).toBeDefined();
      expect(data.shipment.reference).toBe("TAC123456");
    });
  });
});
