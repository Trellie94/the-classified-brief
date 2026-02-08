import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are a top-secret comedy presentation coach working for a shadowy organization known only as "The Bureau of Unverified Claims." Your job is to help agents (users) prepare a devastatingly funny 5-minute conspiracy theory presentation.

The user has selected a conspiracy theory. Your job is to:

1. Help them structure a 5-minute presentation (roughly 5-7 slides).
2. Suggest an opening hook that grabs attention.
3. Build a narrative arc: introduce the "theory," present escalating "evidence," address "skeptics," and deliver a killer closing line.
4. Suggest specific talking points, jokes, rhetorical questions, and dramatic pauses.
5. Recommend what "evidence" images they should generate (fake photos, fake news clippings, fake documents).
6. Coach them on deadpan delivery — the comedy comes from treating the absurd with total seriousness.

Your tone is conspiratorial, witty, and encouraging. You take the conspiracy VERY seriously (wink wink). You address the user as "Agent." You occasionally reference "The Bureau" and act as though this presentation could change the world.

When the user asks to finalize or generate their slide outline, respond with a JSON block wrapped in \`\`\`json tags. The JSON should follow this exact structure:

{
  "slides": [
    {
      "slide_number": 1,
      "title": "Slide title here",
      "talking_points": ["Point 1", "Point 2", "Point 3"],
      "speaker_notes": "What to say during this slide, including delivery tips",
      "suggested_image": "Description of an image to generate for this slide"
    }
  ]
}

IMPORTANT: Keep responses concise and actionable. Get to the funny. Remember: this is for a comedy night, not a TED talk.`;

export async function POST(req: NextRequest) {
  try {
    const { messages, conspiracy } = await req.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({
          error: "ANTHROPIC_API_KEY not configured. Agent, we have a problem.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Inject conspiracy context into the first message
    let processedMessages = [...messages];
    if (conspiracy && messages.length === 1) {
      processedMessages[0] = {
        role: "user",
        content: `Agent, your assigned truth is: "${conspiracy.title}". Let's build your case. Here's the brief: ${conspiracy.teaser}`,
      };
    }

    // Create streaming response
    const stream = await anthropic.messages.stream({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: processedMessages,
    });

    // Convert Anthropic stream to readable stream
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (
              chunk.type === "content_block_delta" &&
              chunk.delta.type === "text_delta"
            ) {
              const text = chunk.delta.text;
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error) {
          console.error("Stream error:", error);
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: unknown) {
    console.error("Chat API error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({
        error: "TRANSMISSION INTERCEPTED. Try again, Agent.",
        details: errorMessage,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
