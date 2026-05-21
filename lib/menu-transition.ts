export type TileRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export type StoredExpandOrigin = TileRect & { imageUrl: string };

const EXPAND_KEY = "menu-expand-origin";
const NAV_DIR_KEY = "menu-nav-dir";

export function saveExpandOrigin(origin: StoredExpandOrigin) {
  sessionStorage.setItem(EXPAND_KEY, JSON.stringify(origin));
}

export function loadExpandOrigin(): StoredExpandOrigin | null {
  try {
    const raw = sessionStorage.getItem(EXPAND_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredExpandOrigin;
  } catch {
    return null;
  }
}

export function clearExpandOrigin() {
  sessionStorage.removeItem(EXPAND_KEY);
}

export function setNavDir(dir: "forward" | "back") {
  sessionStorage.setItem(NAV_DIR_KEY, dir);
}

export function consumeNavDir(fallback: "forward" | "back"): "forward" | "back" {
  const d = sessionStorage.getItem(NAV_DIR_KEY);
  sessionStorage.removeItem(NAV_DIR_KEY);
  if (d === "back" || d === "forward") return d;
  return fallback;
}

export function tileTransformVars(rect: TileRect) {
  const sx = rect.width / window.innerWidth;
  const sy = rect.height / window.innerHeight;
  return {
    "--menu-tx": `${rect.left}px`,
    "--menu-ty": `${rect.top}px`,
    "--menu-sx": String(sx),
    "--menu-sy": String(sy),
  } as Record<string, string>;
}
