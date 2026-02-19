// src/regex/fields.ts

export type PatientName = { first: string; last: string; raw: string };
export type AgeSexRace = { age: number; sex?: string; race?: string; raw: string };

export type ExtractedFields = {
  patientName: PatientName | null;
  date: string | null;
  medical_record_number: string | null;
  date_of_birth: string | null;
  referralSource: string | null;
  dataSource: string | null;
  ageSexRace: AgeSexRace[];
};

export const RX_PATIENT_NAME =
  /^[ \t]*patient\s+name\s*:\s*(?<last>[^,\n]+)\s*,\s*(?<first>[^\n]+)\s*$/gmi;

export const RX_TEXT_DATE =
  /^[ \t]*(?:date|encounter\s+date|dos)\s*:\s*(?<date>(?:\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})|(?:\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}))\s*$/gmi;

export const RX_MEDICAL_RECORD_NUMBER =
  /^[ \t]*(?:mrn|medical\s+record\s+(?:no|number))\s*:\s*(?<mrn>[A-Za-z0-9\-]{4,})\s*$/gmi;

export const RX_DATE_OF_BIRTH =
  /^[ \t]*(?:dob|date\s+of\s+birth)\s*:\s*(?<dob>(?:\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})|(?:\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}))\s*$/gmi;

export const RX_REFERRAL_SOURCE =
  /^[ \t]*referral\s+source\s*:\s*(?<source>.+?)\s*$/gmi;

export const RX_DATA_SOURCE =
  /^[ \t]*data\s+source\s*:\s*(?<source>.+?)\s*$/gmi;

export const RX_AGE_SEX_RACE_INLINE =
  /\b(?<age>\d{1,3})\s*(?:y\/?o|yo|years?\s*old)\b(?:\s*(?<sex>m|f|male|female))?(?:\s*(?<race>[A-Z]{2,4}))?/gi;

// Backwards-compatible aliases for old export names.
export const RX_text_DATE = RX_TEXT_DATE;
export const RX_Medical_record_Number = RX_MEDICAL_RECORD_NUMBER;
export const RX_Date_of_bith = RX_DATE_OF_BIRTH;

function firstMatchGroup(text: string, rx: RegExp, group: string): string | null {
  const m = rx.exec(text);
  rx.lastIndex = 0;
  return (m?.groups?.[group] ?? null) as string | null;
}

export function extractFields(text: string): ExtractedFields {
  const last = firstMatchGroup(text, RX_PATIENT_NAME, "last");
  const first = firstMatchGroup(text, RX_PATIENT_NAME, "first");
  const rawName = (() => {
    const m = RX_PATIENT_NAME.exec(text);
    RX_PATIENT_NAME.lastIndex = 0;
    return m?.[0]?.trim() ?? null;
  })();

  const patientName =
    last && first && rawName
      ? { first: first.trim(), last: last.trim(), raw: rawName }
      : null;

  const date = firstMatchGroup(text, RX_TEXT_DATE, "date");
  const medical_record_number = firstMatchGroup(text, RX_MEDICAL_RECORD_NUMBER, "mrn");
  const date_of_birth = firstMatchGroup(text, RX_DATE_OF_BIRTH, "dob");
  const referralSource = firstMatchGroup(text, RX_REFERRAL_SOURCE, "source");
  const dataSource = firstMatchGroup(text, RX_DATA_SOURCE, "source");

  const ageSexRace: AgeSexRace[] = [];
  for (const m of text.matchAll(RX_AGE_SEX_RACE_INLINE)) {
    const ageStr = m.groups?.age;
    if (!ageStr) continue;
    const age = Number(ageStr);
    if (!Number.isFinite(age)) continue;

    const sexRaw = m.groups?.sex?.toUpperCase();
    const sex =
      sexRaw === "MALE" ? "M" :
      sexRaw === "FEMALE" ? "F" :
      sexRaw;

    const race = m.groups?.race;
    ageSexRace.push({
      age,
      ...(sex ? { sex } : {}),
      ...(race ? { race } : {}),
      raw: m[0],
    });
  }

  return {
    patientName,
    date: date?.trim() ?? null,
    medical_record_number: medical_record_number?.trim() ?? null,
    date_of_birth: date_of_birth?.trim() ?? null,
    referralSource: referralSource?.trim() ?? null,
    dataSource: dataSource?.trim() ?? null,
    ageSexRace,
  };
}
