/** Case-insensitive substring match across name-like fields. */
export function matchesAdminSearch(
  query: string,
  ...fields: (string | null | undefined)[]
): boolean {
  const q = query.trim().toLocaleLowerCase("bg");
  if (!q) return true;
  return fields.some((f) => f?.toLocaleLowerCase("bg").includes(q));
}
