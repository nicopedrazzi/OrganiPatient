export type Section = { header: string; text: string };

export const RX_SECTION_HEADER =
  /^[ \t]*(?<header>(?:chief\s+complaint(?:\s*&\s*id)?|cc\b|reason\s+for\s+visit|history\s+of\s+present\s+illness|hpi\b|past\s+medical\s+history|pmh\b|past\s+surgical\s+history|psh\b|surgical\s+history|medications?|allerg(?:y|ies)|family\s+history|fhx\b|social\s+history|shx\b|review\s+of\s+systems|ros\b|physical\s+examination|physical\s+exam|pe\b|exam\b|vital\s+signs|vitals?\b|problem\s+list|assessment(?:\s+and\s+(?:plan|differential))?|a\/p\b|differential(?:\s+diagnosis)?|plan|hospital\s+course|summary|discharge\s+(?:summary|instructions)))\s*:?[ \t]*$/gmi;


export function escapeRegexLiteral(s: string): string {
  const anyRegExp = RegExp as unknown as { escape?: (x: string) => string };
  if (typeof anyRegExp.escape === "function") return anyRegExp.escape(s);
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function extractSections(note: string, rx: RegExp = RX_SECTION_HEADER): Section[] {
  const headers: { idx: number; header: string; lineEnd: number }[] = [];

  for (const m of note.matchAll(rx)) {
    const idx = m.index ?? 0;
    const header = (m.groups?.header ?? m[0]).trim();
    const lineEnd = note.indexOf("\n", idx);
    headers.push({ idx, header, lineEnd: lineEnd === -1 ? note.length : lineEnd });
  }

  if (headers.length === 0) return [];

  headers.push({ idx: note.length, header: "__END__", lineEnd: note.length });

  const out: Section[] = [];
  for (let i = 0; i < headers.length - 1; i++) {
    const current = headers[i];
    const next = headers[i + 1];
    if (!current || !next) continue;
    const startBody = Math.min(current.lineEnd + 1, note.length);
    const end = next.idx;
    out.push({
      header: current.header,
      text: note.slice(startBody, end).trim(),
    });
  }

  return out;
}
