import { Request, Response } from "express";
import { extractInfo, parseUploadedPdfFile } from "../services/reports.service";
import { getLoggedUser } from "./auth.controller";
import { getUserReport, listUserReports } from "../db/queries/reports";

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
    if (!Number.isFinite(fileId)) {
      return res.status(400).json({ error: "Invalid report id" });
    }

    const userId = await getLoggedUser(req);
    if (userId === null) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const report = await getUserReport(fileId, userId);
    if (!report){
        return res.status(404).json({ error: "Report not found" });
    }
    const text = report.parsedText;
    const result = extractInfo(text);
    return res.status(200).json(result);
};

export async function listMineHandler(req: Request, res: Response) {
  const userId = await getLoggedUser(req);
  if (userId === null) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const reports = await listUserReports(userId);
  return res.status(200).json({ reports });
}
