import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const feedbackSchema = z.object({
  category: z.enum(["bug", "feature", "improvement", "general"]),
  subject: z.string().min(3).max(200),
  message: z.string().min(10).max(2000),
  rating: z.number().min(1).max(5).nullable().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validationResult = feedbackSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("feedback")
      .insert([
        {
          user_id: user.id,
          category: validationResult.data.category,
          subject: validationResult.data.subject,
          message: validationResult.data.message,
          rating: validationResult.data.rating,
          status: "pending",
        },
      ])
      .select()
      .single();

    if (error) {
      // If feedback table doesn't exist, log it
      console.error("Database error storing feedback:", error);

      // If feedback table doesn't exist, return 202 Accepted (not 201 Created)
      if (error.code === "42P01") {
        console.log(
          "Feedback received (table not configured):",
          validationResult.data,
        );
        return NextResponse.json(
          {
            success: true,
            message: "Feedback received but not persisted",
          },
          { status: 202 },
        );
      }

      return NextResponse.json(
        {
          error: "Failed to submit feedback",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        id: data?.id,
        message: "Feedback submitted successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Feedback error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
