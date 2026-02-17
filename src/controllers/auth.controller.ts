import { Request, Response } from "express";
import { userLogin, userRegistration } from "../services/auth.service";

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

    const isValidLogin = await userLogin(email, password);
    if (!isValidLogin) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    return res.status(200).json({ message: "User successfully logged in" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed";
    return res.status(400).json({ error: message });
  }
}
