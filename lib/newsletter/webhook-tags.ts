/** Resend webhooks may send tags as a map or as { name, value }[]. */
export function getEventTag(tags: unknown, name: string): string | null {
  if (!tags) return null;

  if (Array.isArray(tags)) {
    for (const item of tags) {
      if (
        item &&
        typeof item === "object" &&
        "name" in item &&
        (item as { name: string }).name === name &&
        "value" in item &&
        typeof (item as { value: unknown }).value === "string"
      ) {
        return (item as { value: string }).value;
      }
    }
    return null;
  }

  if (typeof tags === "object" && name in tags) {
    const value = (tags as Record<string, unknown>)[name];
    return typeof value === "string" ? value : null;
  }

  return null;
}
