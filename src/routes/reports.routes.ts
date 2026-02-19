import { Router } from "express";
import { cookieMiddleware } from "../middleware/requireAuth";
import { uploadHandler } from "../controllers/reports.controller";
import { uploadMiddleware } from "../middleware/fileLoader";

const reportsRouter = Router();

reportsRouter.get("/health", (_req, res) => {
  res.json({ ok: true, scope: "auth" });
});

reportsRouter.post("/upload", cookieMiddleware, uploadMiddleware, uploadHandler);


export default reportsRouter;
