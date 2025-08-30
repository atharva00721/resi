import { NextRequest, NextResponse } from "next/server";
import { analyzeResumeContent } from "@/lib/ai/resume-assistant";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resumeContent, targetJob } = body;

    const result = await analyzeResumeContent(resumeContent, targetJob);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error analyzing resume:", error);
    return NextResponse.json(
      {
        score: 5,
        suggestions: ["Unable to analyze resume at this time."],
        strengths: ["Content appears to be well-structured."],
      },
      { status: 500 }
    );
  }
}
