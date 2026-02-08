import pptxgen from "pptxgenjs";

interface Slide {
  slide_number: number;
  title: string;
  talking_points: string[];
  speaker_notes: string;
  suggested_image: string;
}

interface GeneratedImage {
  slideNumber: number;
  imageUrl: string;
  style: string;
  prompt: string;
}

interface Conspiracy {
  title: string;
  teaser: string;
}

export async function generatePresentationPPTX(
  conspiracy: Conspiracy,
  slides: Slide[],
  images: GeneratedImage[]
) {
  const pptx = new pptxgen();

  // Configure presentation
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "The Bureau of Unverified Claims";
  pptx.title = conspiracy.title;
  pptx.subject = "CLASSIFIED BRIEFING";

  // Define colors
  const colors = {
    background: "0a0a0a",
    foreground: "e8e6e3",
    accentGreen: "39FF14",
    accentRed: "FF3131",
    accentYellow: "FFE500",
  };

  // Title Slide
  const titleSlide = pptx.addSlide();
  titleSlide.background = { color: colors.background };

  // Add CLASSIFIED watermark
  titleSlide.addText("CLASSIFIED", {
    x: 0.5,
    y: 0.5,
    w: "90%",
    h: 1,
    fontSize: 72,
    bold: true,
    color: colors.accentRed,
    align: "center",
    transparency: 95,
    rotate: 15,
  });

  // Title
  titleSlide.addText(conspiracy.title.toUpperCase(), {
    x: 0.5,
    y: 2,
    w: "90%",
    h: 2,
    fontSize: 44,
    bold: true,
    color: colors.accentGreen,
    align: "center",
    fontFace: "Arial",
    valign: "middle",
  });

  // Subtitle
  titleSlide.addText("A CLASSIFIED BRIEFING", {
    x: 0.5,
    y: 4,
    w: "90%",
    h: 0.5,
    fontSize: 18,
    color: colors.accentYellow,
    align: "center",
    fontFace: "Courier New",
  });

  // Teaser
  titleSlide.addText(conspiracy.teaser, {
    x: 1,
    y: 4.8,
    w: "80%",
    h: 1,
    fontSize: 14,
    color: colors.foreground,
    align: "center",
    fontFace: "Courier New",
    transparency: 30,
  });

  // Content Slides
  for (const slide of slides) {
    const contentSlide = pptx.addSlide();
    contentSlide.background = { color: colors.background };

    // Slide title
    contentSlide.addText(slide.title.toUpperCase(), {
      x: 0.5,
      y: 0.4,
      w: "90%",
      h: 0.8,
      fontSize: 32,
      bold: true,
      color: colors.accentGreen,
      fontFace: "Arial",
    });

    // Find image for this slide
    const slideImage = images.find(
      (img) => img.slideNumber === slide.slide_number
    );

    // If image exists, add it
    if (slideImage) {
      try {
        // Add image on the right side
        contentSlide.addImage({
          data: slideImage.imageUrl,
          x: 6,
          y: 1.5,
          w: 3.5,
          h: 3.5,
        });
      } catch (error) {
        console.error("Error adding image to slide:", error);
        // Add placeholder text if image fails
        contentSlide.addText("[ IMAGE REDACTED ]", {
          x: 6,
          y: 3,
          w: 3.5,
          h: 1,
          fontSize: 16,
          color: colors.accentRed,
          align: "center",
          fontFace: "Courier New",
        });
      }
    }

    // Talking points (left side)
    const bulletPoints = slide.talking_points.map((point) => ({
      text: point,
      options: {
        bullet: true,
        color: colors.foreground,
        fontSize: 14,
        fontFace: "Courier New",
      },
    }));

    contentSlide.addText(bulletPoints, {
      x: 0.5,
      y: 1.5,
      w: slideImage ? 5 : 9,
      h: 4,
      fontSize: 14,
      color: colors.foreground,
      fontFace: "Courier New",
    });

    // Speaker notes
    contentSlide.addNotes(slide.speaker_notes);
  }

  // Closing Slide
  const closingSlide = pptx.addSlide();
  closingSlide.background = { color: colors.background };

  closingSlide.addText("THE TRUTH IS OUT THERE", {
    x: 0.5,
    y: 2.5,
    w: "90%",
    h: 1.5,
    fontSize: 48,
    bold: true,
    color: colors.accentYellow,
    align: "center",
    fontFace: "Arial",
    valign: "middle",
  });

  closingSlide.addText("END OF CLASSIFIED BRIEFING", {
    x: 0.5,
    y: 4.5,
    w: "90%",
    h: 0.5,
    fontSize: 14,
    color: colors.foreground,
    align: "center",
    fontFace: "Courier New",
    transparency: 50,
  });

  // Generate and download
  const fileName = `${conspiracy.title.replace(/[^a-z0-9]/gi, "_")}_CLASSIFIED.pptx`;
  await pptx.writeFile({ fileName });
}
