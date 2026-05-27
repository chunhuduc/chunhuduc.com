/** Display label + `datetime` attribute for blog frontmatter (`YYYY-MM-DD` or ISO with time). */
export function formatPostDateTime(raw: string): { dateTime: string; label: string } {
  const normalized = raw.trim();
  if (!normalized) return { dateTime: "", label: "" };

  const hasTime = normalized.includes("T") || /\d{1,2}:\d{2}/.test(normalized);
  const parsed = new Date(hasTime ? normalized.replace(" ", "T") : `${normalized}T12:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return { dateTime: normalized, label: normalized };
  }

  const datePart = new Intl.DateTimeFormat("en", {
    dateStyle: "long",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(parsed);

  if (!hasTime) {
    const dateOnly = normalized.slice(0, 10);
    return { dateTime: dateOnly, label: datePart };
  }

  const timePart = new Intl.DateTimeFormat("en", {
    timeStyle: "short",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(parsed);

  return {
    dateTime: parsed.toISOString(),
    label: `${datePart} · ${timePart}`,
  };
}
