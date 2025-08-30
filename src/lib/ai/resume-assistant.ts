import { google } from "@ai-sdk/google";
import { generateText } from "ai";

// Note: Environment variables are automatically loaded by Next.js
// No need for dotenv in client-side code

export interface ResumeEnhancementRequest {
  type: "bullet-points" | "summary" | "skills" | "optimization" | "keywords";
  jobTitle?: string;
  company?: string;
  currentContent?: string;
  experience?: string;
  targetRole?: string;
}

export interface ResumeEnhancementResponse {
  suggestions: string[];
  improvedContent?: string;
  keywords?: string[];
  explanation?: string;
}

const AI_MODEL = google("gemini-2.5-flash");

const AI_CONFIG = {
  providerOptions: {
    google: {
      thinkingConfig: {
        thinkingBudget: 4096,
        includeThoughts: false,
      },
    },
  },
};

const PROMPTS = {
  "bullet-points": (
    request: ResumeEnhancementRequest
  ) => `As a professional resume writer, help me create 3-5 strong bullet points for this job experience:
        
Job Title: ${request.jobTitle || "Software Engineer"}
Company: ${request.company || "Tech Company"}
Current Description: ${request.currentContent || "General responsibilities"}

Please provide:
1. 3-5 action-oriented bullet points using strong verbs
2. Quantify achievements where possible
3. Focus on impact and results
4. Use industry-standard terminology
5. Make it compelling and professional

Format each bullet point on a new line starting with "• "`,

  summary: (
    request: ResumeEnhancementRequest
  ) => `Write a compelling professional summary for a resume based on this information:
        
Job Title: ${request.jobTitle || "Software Engineer"}
Experience: ${request.experience || "5 years of software development"}
Target Role: ${request.targetRole || "Senior Software Engineer"}

Requirements:
- 2-3 sentences maximum
- Professional and confident tone
- Highlight key achievements and skills
- Tailored to the target role
- Clear and impactful`,

  skills: (
    request: ResumeEnhancementRequest
  ) => `Based on this job title and experience, suggest relevant technical and soft skills:
        
Job Title: ${request.jobTitle || "Software Engineer"}
Experience: ${request.experience || "5 years"}

Please provide:
1. Technical skills (programming languages, tools, frameworks)
2. Soft skills (leadership, communication, etc.)
3. Industry-specific skills
4. Emerging technologies to consider

Format as categories with skills separated by commas.`,

  optimization: (
    request: ResumeEnhancementRequest
  ) => `Optimize this resume content for better impact and professional presentation:
        
Current Content: ${request.currentContent || "Sample content"}

Please:
1. Improve action verbs and impact
2. Add quantifiable achievements
3. Use industry-standard terminology
4. Make it more compelling
5. Ensure professional formatting`,

  keywords: (
    request: ResumeEnhancementRequest
  ) => `Generate relevant keywords for this job title to improve resume effectiveness:
        
Job Title: ${request.jobTitle || "Software Engineer"}
Target Role: ${request.targetRole || "Senior Software Engineer"}

Please provide:
1. Technical keywords
2. Industry-specific terms
3. Soft skill keywords
4. Certifications to consider
5. Tools and technologies`,
};

export async function enhanceResumeContent(
  request: ResumeEnhancementRequest
): Promise<ResumeEnhancementResponse> {
  try {
    const promptGenerator = PROMPTS[request.type];
    if (!promptGenerator) {
      throw new Error(`Unsupported enhancement type: ${request.type}`);
    }

    const prompt = promptGenerator(request);

    const { text } = await generateText({
      model: AI_MODEL,
      prompt,
      ...AI_CONFIG,
    });

    // Parse the response based on type
    const suggestions = text
      .split("\n")
      .filter((line) => line.trim().length > 0);

    return {
      suggestions,
      improvedContent: request.type === "optimization" ? text : undefined,
      keywords: request.type === "keywords" ? suggestions : undefined,
      explanation: text,
    };
  } catch (error) {
    console.error("Error enhancing resume content:", error);
    return {
      suggestions: ["Unable to generate suggestions at this time."],
      explanation: "There was an error processing your request.",
    };
  }
}

export async function generateJobSpecificKeywords(
  jobTitle: string,
  industry: string = "technology"
): Promise<string[]> {
  try {
    const { text } = await generateText({
      model: AI_MODEL,
      prompt: `Generate 10-15 relevant keywords for a ${jobTitle} position in the ${industry} industry. Focus on:
      1. Technical skills and tools
      2. Industry-specific terminology
      3. Soft skills and competencies
      4. Certifications and qualifications
      
      Return only the keywords, separated by commas.`,
      providerOptions: {
        google: {
          thinkingConfig: {
            thinkingBudget: 2048,
            includeThoughts: false,
          },
        },
      },
    });

    return text
      .split(",")
      .map((keyword) => keyword.trim())
      .filter((k) => k.length > 0);
  } catch (error) {
    console.error("Error generating keywords:", error);
    return [];
  }
}

export async function analyzeResumeContent(
  resumeContent: string,
  targetJob: string
): Promise<{
  score: number;
  suggestions: string[];
  strengths: string[];
}> {
  try {
    const { text } = await generateText({
      model: AI_MODEL,
      prompt: `Analyze this resume content for effectiveness for a ${targetJob} position:

Resume Content: ${resumeContent}

Please provide:
1. Overall effectiveness score (1-10)
2. 3-5 specific suggestions for improvement
3. 2-3 strengths of the current content

Format your response as:
Score: [number]
Suggestions:
- [suggestion 1]
- [suggestion 2]
- [suggestion 3]

Strengths:
- [strength 1]
- [strength 2]`,
      ...AI_CONFIG,
    });

    // Parse the response
    const lines = text.split("\n");
    const scoreMatch = lines
      .find((line) => line.startsWith("Score:"))
      ?.match(/\d+/);
    const score = scoreMatch ? parseInt(scoreMatch[0]) : 5;

    const suggestions = lines
      .filter(
        (line) => line.trim().startsWith("-") && line.includes("suggestion")
      )
      .map((line) => line.replace("-", "").trim());

    const strengths = lines
      .filter(
        (line) => line.trim().startsWith("-") && line.includes("strength")
      )
      .map((line) => line.replace("-", "").trim());

    return {
      score,
      suggestions,
      strengths,
    };
  } catch (error) {
    console.error("Error analyzing resume:", error);
    return {
      score: 5,
      suggestions: ["Unable to analyze resume at this time."],
      strengths: ["Content appears to be well-structured."],
    };
  }
}
