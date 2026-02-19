import { Router } from "express";
import { extractInfoHandler, listMineHandler, uploadHandler } from "../controllers/reports.controller";
import { uploadMiddleware } from "../middleware/fileLoader";

const reportsRouter = Router();

reportsRouter.get("/health", (_req, res) => {
  res.json({ ok: true, scope: "auth" });
});

reportsRouter.post("/upload",uploadMiddleware, uploadHandler);
reportsRouter.get("/mine", listMineHandler);
reportsRouter.get("/:reportId/info", extractInfoHandler);

export default reportsRouter;
