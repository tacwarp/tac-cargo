import { NextResponse } from "next/server";
import { generateUUID } from "@/lib/utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const trackingId = searchParams.get("trackingId");

  if (!trackingId) {
    return NextResponse.json(
      { success: false, error: "Tracking ID is required" },
      { status: 400 },
    );
  }

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Mock Data Logic
  // In production, this would query Supabase or an external logistics API
  if (trackingId.toUpperCase().startsWith("TAC-")) {
    const isDelayed = trackingId.includes("999"); // Simulate delay for specific ID
    const isDelivered = trackingId.includes("000"); // Simulate delivery for specific ID

    return NextResponse.json({
      success: true,
      data: {
        trackingId: trackingId.toUpperCase(),
        status: isDelivered
          ? "DELIVERED"
          : isDelayed
            ? "DELAYED"
            : "IN_TRANSIT",
        mode: "AIR",
        origin: "Imphal (IMF)",
        destination: "New Delhi (DEL)",
        eta: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
        lastUpdated: new Date().toISOString(),
        pieces: 12,
        weightKg: 450.5,
        events: [
          {
            id: generateUUID(),
            label: "Departed from Origin Facility",
            location: "Imphal Cargo Terminal",
            timestamp: new Date(Date.now() - 3600000 * 4).toISOString(), // 4 hours ago
          },
          {
            id: generateUUID(),
            label: "Shipment Created",
            location: "Imphal",
            timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          },
        ],
      },
    });
  }

  return NextResponse.json(
    {
      success: false,
      error: "Tracking number not found. Please check and try again.",
    },
    { status: 404 },
  );
}
