import { Router } from "express";
import { cookieMiddleware } from "../middleware/requireAuth";
import { extractInfoHandler, uploadHandler } from "../controllers/reports.controller";
import { uploadMiddleware } from "../middleware/fileLoader";
import { extractInfo } from "../services/reports.service";

const reportsRouter = Router();

reportsRouter.get("/health", (_req, res) => {
  res.json({ ok: true, scope: "auth" });
});

reportsRouter.post("/upload",uploadMiddleware, uploadHandler);
reportsRouter.get("/reportInfo", extractInfoHandler);

export default reportsRouter;
