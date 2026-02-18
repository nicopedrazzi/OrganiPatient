import { Router } from "express";
import { loginHandler, logoutHandler, registerHandler } from "../controllers/auth.controller";
import { cookieMiddleware } from "../middleware/requireAuth";

const authRouter = Router();

authRouter.get("/health", (_req, res) => {
  res.json({ ok: true, scope: "auth" });
});

authRouter.post("/register", registerHandler);
authRouter.post("/login", loginHandler);
authRouter.post("/logout", logoutHandler);

export default authRouter;