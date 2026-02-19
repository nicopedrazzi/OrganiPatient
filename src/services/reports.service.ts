
import { readFile } from "node:fs/promises";
import { PDFParse } from "pdf-parse";
import { newReport } from "../db/queries/reports";
import { extractSections } from "../regex/sections";
import { extractFields } from "../regex/fields";
import { extractVitals } from "../regex/clinical";


export async function parseUploadedPdfFile(userId:number,path: string) {
  const data = await readFile(path);
  const parser = new PDFParse({ data });
  const text = await parser.getText();
  const info = await parser.getInfo();
  await parser.destroy();
  newReport({
    userId,
    parsedText:text.text,
    pagesNum:info.total,
    addedAt: new Date()
  })
  return { pages: info.total, text: text.text, info: info.info };
};

export function extractInfo(text: string) {
  const sectionsArr = extractSections(text);

  const sections = Object.fromEntries(
    sectionsArr.map((s) => [s.header.toLowerCase(), s.text] as const)
  );

  const basicInformation = extractFields(text);
  const vitals = extractVitals(text);

  return { sections, basicInformation, vitals };
}
