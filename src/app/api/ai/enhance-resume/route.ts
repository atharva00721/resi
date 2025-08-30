import { NextRequest, NextResponse } from "next/server";
import { enhanceResumeContent } from "@/lib/ai/resume-assistant";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await enhanceResumeContent(body);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error enhancing resume:", error);
    return NextResponse.json(
      {
        suggestions: ["Unable to generate suggestions at this time."],
        explanation: "There was an error processing your request.",
      },
      { status: 500 }
    );
  }
}
