export type Vitals = {
  bp?: string;
  hr?: number;
  rr?: number;
  temp?: number;
  tempUnit?: string;
  spo2?: number;
};

export type AllergyEntry = { agent: string; reaction?: string; raw: string };
export type AllergyResult = { nkda: boolean; entries: AllergyEntry[] };

export type SystemBlock = { system: string; text: string };
export type NumberedItem = { num: number; text: string };

export const RX_VITALS_INLINE =
  /\b(?:(?:blood\s*pressure|bp)\s*(?<bp>\d{2,3}\s*\/\s*\d{2,3})|(?:pulse|hr)\s*(?<hr>\d{2,3})|(?:respirations?|rr)\s*(?<rr>\d{1,2})|(?:temp(?:erature)?)\s*(?<temp>\d{2,3}(?:\.\d+)?)\s*(?<tempUnit>c|f|°c|°f)?|(?:o2\s*sat|spo2)\s*(?<spo2>\d{2,3})\s*%?)\b/gi;

export const RX_ALLERGY =
  /\b(?:(?<nkda>nkda|no\s+known\s+drug\s+allerg(?:y|ies))\b|(?<agent>[A-Za-z][A-Za-z0-9 \-\/]+?)\s*(?:;|,|-)\s*(?<reaction>rash|hives|anaphylaxis|angioedema|itch(?:ing)?|urticaria|gi\s+upset|nausea|vomit(?:ing)?|shortness\s+of\s+breath|wheez(?:e|ing)|swelling|unknown))\b/gi;

export const RX_ROS_BLOCK =
  /^[ \t]*(?<system>(?:heent|constitutional|cardiovascular|cv|respiratory|pulmonary|gi|gastrointestinal|gu|genitourinary|musculoskeletal|msk|skin|neuro(?:logical)?|psych(?:iatric)?|endocrine|heme|hematologic|allergic|immunologic))\s*:\s*(?<text>.*?)(?=\n[ \t]*[A-Za-z][A-Za-z \t\/-]{2,}\s*:|\n{2,}|$)/gmis;

export const RX_PE_BLOCK =
  /^[ \t]*(?<system>(?:general|constitutional|skin|heent|head|eyes|ears|nose|throat|neck|chest|lungs|respiratory|cardiovascular|cv|heart|abdomen|gi|extremities|musculoskeletal|neuro(?:logical)?|psych(?:iatric)?|lymph(?:\s*nodes?)?|nodes|genit(?:al|ourinary)?|rectal))\s*:\s*(?<text>.*?)(?=\n[ \t]*[A-Za-z][A-Za-z \t\/-]{2,}\s*:|\n{2,}|$)/gmis;

export const RX_NUMBERED_LINE =
  /^[ \t]*(?<num>\d+)\.\s*(?<text>.+?)\s*$/gm;

export function extractVitals(text: string): Vitals {
  const v: Vitals = {};

  for (const m of text.matchAll(RX_VITALS_INLINE)) {
    if (m.groups?.bp) v.bp = m.groups.bp.replace(/\s+/g, "");
    if (m.groups?.hr) v.hr = Number(m.groups.hr);
    if (m.groups?.rr) v.rr = Number(m.groups.rr);
    if (m.groups?.temp) v.temp = Number(m.groups.temp);
    if (m.groups?.tempUnit) v.tempUnit = m.groups.tempUnit.toUpperCase();
    if (m.groups?.spo2) v.spo2 = Number(m.groups.spo2);
  }

  return v;
}

export function extractAllergies(text: string): AllergyResult {
  let nkda = false;
  const entries: AllergyEntry[] = [];

  for (const m of text.matchAll(RX_ALLERGY)) {
    if (m.groups?.nkda) {
      nkda = true;
      continue;
    }
    const agent = m.groups?.agent?.trim();
    if (!agent) continue;
    const reaction = m.groups?.reaction?.trim();
    entries.push({
      agent,
      ...(reaction ? { reaction } : {}),
      raw: m[0],
    });
  }

  return { nkda, entries };
}

export function extractSystemBlocks(
  sectionText: string,
  kind: "ros" | "pe"
): SystemBlock[] {
  const rx = kind === "ros" ? RX_ROS_BLOCK : RX_PE_BLOCK;
  const out: SystemBlock[] = [];

  for (const m of sectionText.matchAll(rx)) {
    const system = (m.groups?.system ?? "").trim();
    const text = (m.groups?.text ?? "").trim();
    if (!system) continue;
    out.push({ system, text });
  }

  return out;
}

export function extractNumberedItems(sectionText: string): NumberedItem[] {
  const out: NumberedItem[] = [];
  for (const m of sectionText.matchAll(RX_NUMBERED_LINE)) {
    const num = Number(m.groups?.num);
    const text = (m.groups?.text ?? "").trim();
    if (!Number.isFinite(num) || !text) continue;
    out.push({ num, text });
  }
  return out;
}
