import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const accessRequestSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  company: z.string().min(2, "Company name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  message: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body
    const validationResult = accessRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.issues },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    // Store the access request in the database
    const { data, error } = await supabase
      .from("access_requests")
      .insert([
        {
          name: validationResult.data.name,
          email: validationResult.data.email,
          company: validationResult.data.company,
          phone: validationResult.data.phone,
          message: validationResult.data.message || null,
          status: "pending",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Database error storing access request:", error);
      console.log("Access request data:", validationResult.data);

      // Return error to inform user of the failure
      return NextResponse.json(
        {
          error: "Failed to submit request. Please try again later.",
          details:
            process.env.NODE_ENV === "development" ? error.message : undefined,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        id: data?.id,
        message: "Request submitted successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Access request error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
