import { Request, Response } from "express";
import { extractInfo, parseUploadedPdfFile } from "../services/reports.service";
import { getLoggedUser } from "./auth.controller";
import { getReport } from "../db/queries/reports";

export async function uploadHandler(req: Request, res: Response) {
  try {
    const filePath = req.file?.path;
    if (!filePath) {
      return res.status(400).json({ error: "PDF file is required in field 'file'" });
    }

    const userId = await getLoggedUser(req);
    if (typeof userId !== "number"){
        throw new Error("Logged user is missing")
    }
    const parseOutcome = await parseUploadedPdfFile(userId,filePath);
    return res.status(200).json(parseOutcome);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to parse PDF";
    return res.status(400).json({ error: message });
  };
};

export async function extractInfoHandler(req:Request,res:Response){
    const fileId = Number(req.params.reportId);
    const report = await getReport(fileId);
    if (!report){
        res.status(400).send("Report not found");
        return;
    }
    const text = report.parsedText;
    const result = extractInfo(text);
    const jsonResult = JSON.stringify(result);
    res.status(200).json(jsonResult);
    return result;
};
