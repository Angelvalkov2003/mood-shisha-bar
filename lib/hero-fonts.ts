import { Cormorant_Garamond, Unbounded } from "next/font/google";

export const heroTaglineFont = Unbounded({
  subsets: ["latin"],
  weight: ["700", "800"],
});

export const heroSubtitleFont = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600"],
  style: ["italic"],
});
