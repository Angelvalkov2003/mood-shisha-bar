const BG_MAP: Record<string, string> = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "e",
  ж: "zh",
  з: "z",
  и: "i",
  й: "y",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "h",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "sht",
  ъ: "a",
  ь: "y",
  ю: "yu",
  я: "ya",
};

/** BG title → latin slug, lowercase, no separators (e.g. "Основни ястия" → "osnovniyastia") */
export function slugFromBg(text: string) {
  let out = "";
  for (const ch of text.trim().toLowerCase()) {
    if (BG_MAP[ch]) out += BG_MAP[ch];
    else if (/[a-z0-9]/.test(ch)) out += ch;
  }
  return out || "category";
}

/** EN title → slug (fallback when DB slug empty) */
export function slugFromEn(text: string) {
  return (
    text
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "")
      .slice(0, 80) || "category"
  );
}
