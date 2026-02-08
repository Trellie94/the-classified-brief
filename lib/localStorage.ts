import { Conspiracy } from "@/types/conspiracy";

export interface Slide {
  slide_number: number;
  title: string;
  talking_points: string[];
  speaker_notes: string;
  suggested_image: string;
}

export interface GeneratedImage {
  slideNumber: number;
  imageUrl: string;
  style: string;
  prompt: string;
}

// Storage keys
const KEYS = {
  CONSPIRACY: "tcb_selected_conspiracy",
  SLIDES: "tcb_generated_slides",
  IMAGES: "tcb_generated_images",
  PPTX_READY: "tcb_pptx_ready",
} as const;

// Conspiracy storage
export function saveConspiracy(conspiracy: Conspiracy): void {
  try {
    localStorage.setItem(KEYS.CONSPIRACY, JSON.stringify(conspiracy));
  } catch (error) {
    console.error("Error saving conspiracy to localStorage:", error);
  }
}

export function getConspiracy(): Conspiracy | null {
  try {
    const data = localStorage.getItem(KEYS.CONSPIRACY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error reading conspiracy from localStorage:", error);
    return null;
  }
}

// Slides storage
export function saveSlides(slides: Slide[]): void {
  try {
    localStorage.setItem(KEYS.SLIDES, JSON.stringify(slides));
  } catch (error) {
    console.error("Error saving slides to localStorage:", error);
  }
}

export function getSlides(): Slide[] | null {
  try {
    const data = localStorage.getItem(KEYS.SLIDES);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error reading slides from localStorage:", error);
    return null;
  }
}

// Images storage
export function saveImages(images: GeneratedImage[]): void {
  try {
    localStorage.setItem(KEYS.IMAGES, JSON.stringify(images));
  } catch (error) {
    console.error("Error saving images to localStorage:", error);
  }
}

export function getImages(): GeneratedImage[] | null {
  try {
    const data = localStorage.getItem(KEYS.IMAGES);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error reading images from localStorage:", error);
    return null;
  }
}

// Add a single image to the collection
export function addImage(image: GeneratedImage): void {
  const existingImages = getImages() || [];

  // Check if image for this slide already exists and update it
  const imageIndex = existingImages.findIndex(
    (img) => img.slideNumber === image.slideNumber
  );

  if (imageIndex >= 0) {
    existingImages[imageIndex] = image;
  } else {
    existingImages.push(image);
  }

  saveImages(existingImages);
}

// PPTX ready flag (since we can't store Blobs in localStorage)
export function markPPTXReady(): void {
  try {
    localStorage.setItem(KEYS.PPTX_READY, "true");
  } catch (error) {
    console.error("Error marking PPTX ready:", error);
  }
}

export function isPPTXReady(): boolean {
  try {
    return localStorage.getItem(KEYS.PPTX_READY) === "true";
  } catch (error) {
    console.error("Error checking PPTX ready status:", error);
    return false;
  }
}

// Clear all session data
export function clearSessionData(): void {
  try {
    Object.values(KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error("Error clearing session data:", error);
  }
}

// Check if user has completed a step
export function hasCompletedBriefing(): boolean {
  return getConspiracy() !== null;
}

export function hasCompletedWorkshop(): boolean {
  return getSlides() !== null;
}

export function hasCompletedEvidence(): boolean {
  const slides = getSlides();
  const images = getImages();

  if (!slides || !images) return false;

  // Check if we have an image for each slide
  return slides.every((slide) =>
    images.some((img) => img.slideNumber === slide.slide_number)
  );
}
