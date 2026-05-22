import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Trimmed image URL or null when empty (no placeholder). */
export function imageSrc(url: string | null | undefined): string | null {
  const trimmed = url?.trim();
  return trimmed ? trimmed : null;
}

export function hasImageUrl(url: string | null | undefined): boolean {
  return imageSrc(url) !== null;
}

/** Admin previews: placeholder when URL is missing. */
export function imgUrl(url: string | null | undefined, seed: string) {
  return imageSrc(url) ?? `https://picsum.photos/seed/${seed}/400/300`;
}
