import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return Response.json(
        { error: "Image URL required" },
        { status: 400 }
      );
    }

    // Fetch the image
    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    // Convert to base64
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');

    // Get content type from response headers
    const contentType = response.headers.get('content-type') || 'image/png';

    // Create data URI
    const dataUri = `data:${contentType};base64,${base64}`;

    return Response.json({
      base64: dataUri,
    });
  } catch (error: unknown) {
    console.error("Image conversion error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return Response.json(
      {
        error: "Failed to convert image",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
