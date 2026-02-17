import { Router } from "express";
import { loginHandler, registerHandler } from "../controllers/auth.controller";

const authRouter = Router();

authRouter.get("/health", (_req, res) => {
  res.json({ ok: true, scope: "auth" });
});

authRouter.post("/register", registerHandler);
authRouter.post("/login", loginHandler);

export default authRouter;