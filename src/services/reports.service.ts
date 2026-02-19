
import { readFile } from "node:fs/promises";
import { PDFParse } from "pdf-parse";
import { newReport } from "../db/queries/reports";


type reportJson = {
    name?: string;
    surname?: string;
    age?: number;
    date?: string;
};

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

export function extractInfo(text:string):reportJson{
    const lines = text.split("\n");
    let regexName = /name/i;
    let regexSurname = /surname/i;
    let regexAge = /age/i;
    let regexDate = /date/i;
    const result: reportJson = {};

    for (let line of lines){
        if (regexAge.test(line)){
            const splitLine = line.split(" ");
            const age = splitLine[1];
            if (age) result.age = Number(age);
        };
        if (regexName.test(line)){
            const splitLine = line.split(" ");
            const name = splitLine[1];
            if (name) result.name = name;
        };
        if (regexSurname.test(line)){
            const splitLine = line.split(" ");
            const surname = splitLine[1];
            if (surname) result.surname = surname;
        };
        if (regexDate.test(line)){
            const splitLine = line.split(" ");
            const date = splitLine[1];
            if (date) result.date = date;
        };
    }
    console.log(result);
    return result;
}
