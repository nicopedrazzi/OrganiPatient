import { Router } from "express";
import { cookieMiddleware } from "../middleware/requireAuth";
import { parseUploadedPdfFile } from "../services/reports.service";

const reportsRouter = Router();

reportsRouter.get("/health", (_req, res) => {
  res.json({ ok: true, scope: "auth" });
});

reportsRouter.get("/upload", cookieMiddleware, parseUploadedPdfFile);


export default reportsRouter;