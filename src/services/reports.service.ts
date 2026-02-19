
import { readFile } from "node:fs/promises";
import { PDFParse } from "pdf-parse";

export async function parseUploadedPdfFile(path: string) {
  const data = await readFile(path);
  const parser = new PDFParse({ data });
  const text = await parser.getText();
  const info = await parser.getInfo();
  await parser.destroy();
  return { pages: info.total, text: text.text, info: info.info };
};

