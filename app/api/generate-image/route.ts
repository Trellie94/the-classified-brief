import OpenAI from "openai";
import { NextRequest } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const STYLE_PROMPTS = {
  "leaked-photo": "Style: Grainy, slightly blurry surveillance camera photograph with realistic lighting. Low resolution, authentic documentary style. ",
  "newspaper": "Style: High-quality photojournalistic image suitable for a newspaper front page. Clear, dramatic, newsworthy composition. ",
  "declassified": "Style: Official government document photograph. Clean, formal, archival quality. Looks like it belongs in a classified file. ",
  "satellite": "Style: Aerial satellite imagery view. High altitude perspective, geographic/topographic detail visible. ",
};

export async function POST(req: NextRequest) {
  try {
    const { prompt, style } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        {
          error: "OPENAI_API_KEY not configured. The Bureau cannot fabricate evidence without proper credentials.",
        },
        { status: 500 }
      );
    }

    if (!prompt) {
      return Response.json(
        { error: "Image description required" },
        { status: 400 }
      );
    }

    // Prepend style-specific instructions
    const stylePrefix = STYLE_PROMPTS[style as keyof typeof STYLE_PROMPTS] || STYLE_PROMPTS["leaked-photo"];
    const fullPrompt = `${stylePrefix}${prompt}. IMPORTANT: Do not include any text, words, or labels in the image.`;

    // Generate image with DALL-E 3
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: fullPrompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    const imageUrl = response.data?.[0]?.url;

    if (!imageUrl) {
      throw new Error("No image URL returned from OpenAI");
    }

    return Response.json({
      imageUrl,
      revisedPrompt: response.data?.[0]?.revised_prompt,
    });
  } catch (error: unknown) {
    console.error("Image generation error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return Response.json(
      {
        error: "EVIDENCE FABRICATION FAILED. Try again, Agent.",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
