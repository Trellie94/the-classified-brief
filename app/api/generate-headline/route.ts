import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { conspiracy, imageDescription } = await req.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json(
        { error: "ANTHROPIC_API_KEY not configured" },
        { status: 500 }
      );
    }

    const prompt = `You are a tabloid newspaper headline writer for the New York Post. Generate a sensational, punchy headline (max 8 words) for a fake news story about this conspiracy theory: "${conspiracy}". The story is supposedly supported by this image: "${imageDescription}".

Make it dramatic, shocking, and tabloid-style. Use ALL CAPS. Include a punchy subheadline (10-15 words) that elaborates.

Respond ONLY with JSON in this format:
{
  "headline": "THE MAIN HEADLINE HERE",
  "subheadline": "A longer subheadline that provides more shocking details"
}`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 200,
      messages: [{ role: "user", content: prompt }],
    });

    const content = message.content[0];
    if (content.type === "text") {
      // Extract JSON from response
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const headlines = JSON.parse(jsonMatch[0]);
        return Response.json(headlines);
      }
    }

    throw new Error("Failed to generate headlines");
  } catch (error: unknown) {
    console.error("Headline generation error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return Response.json(
      {
        error: "HEADLINE FABRICATION FAILED",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
