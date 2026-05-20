import { cookies } from "next/headers";
import { ADMIN_COOKIE } from "./constants";

export async function isAdmin() {
  const c = await cookies();
  return c.get(ADMIN_COOKIE)?.value === "1";
}

export async function assertAdmin() {
  if (!(await isAdmin())) throw new Error("Unauthorized");
}
