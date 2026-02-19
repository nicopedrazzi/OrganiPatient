import { Request, Response } from "express";
import { parseUploadedPdfFile } from "../services/reports.service";

export async function uploadHandler(req: Request, res: Response) {
  try {
    const filePath = req.file?.path;
    if (!filePath) {
      return res.status(400).json({ error: "PDF file is required in field 'file'" });
    }

    const parseOutcome = await parseUploadedPdfFile(filePath);
    return res.status(200).json(parseOutcome);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to parse PDF";
    return res.status(400).json({ error: message });
  }
}
