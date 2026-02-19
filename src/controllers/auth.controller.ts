import { Request, Response } from "express";
import { userLogin, userRegistration } from "../services/auth.service";
import { revokeCookie } from "../db/queries/sessions";


export async function registerHandler(req: Request, res: Response) {
  try {
    const { email, password, role, orgId } = req.body ?? {};

    if (!email || !password || !role || !orgId) {
      return res.status(400).json({
        error: "email, password, role and orgId are required",
      });
    }

    if (!["admin", "doctor", "nurse"].includes(role)) {
      return res.status(400).json({
        error: "role must be one of: admin, doctor, nurse",
      });
    }

    const createdUser = await userRegistration({ email, role, orgId }, password);
    return res.status(201).json({
      message: "User successfully registered",
      user: createdUser,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error, try again";
    return res.status(400).json({ error: message });
  }
}

export async function loginHandler(req: Request, res: Response) {
  try {
    const { email, password } = req.body ?? {};

    if (!email || !password) {
      return res.status(400).json({
        error: "email and password are required",
      });
    }

    const loggedInSession = await userLogin(email, password);
    if (!loggedInSession) {
      return res.status(401).json({ error: "Invalid email or password" });
    };
    res.cookie("session", loggedInSession[0]?.id, {
    httpOnly: true,
    sameSite: "lax",
    expires: loggedInSession[0]?.expiresAt ,
    path: "/",
  });
  
    return res.redirect("/reports/upload");
    
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed";
    return res.status(400).json({ error: message });
  }
}

export async function logoutHandler(req: Request, res: Response) {
  await revokeCookie(req.cookies.session);
  res.clearCookie("session", { path: "/" });
  return res.json({ ok: true });
}
