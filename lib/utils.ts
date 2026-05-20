import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function imgUrl(url: string | null | undefined, seed: string) {
  return url || `https://picsum.photos/seed/${seed}/400/300`;
}
