import { Response, Request, NextFunction } from "express";
import { db } from "../db";
import { and, eq, isNull, gt } from "drizzle-orm";
import { sessions, users } from "../db/schema";

export async function cookieMiddleware(req: Request, res: Response, next: NextFunction) {
  const sessionId = req.cookies.session as string | undefined;
  if (!sessionId) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const [session] = await db
    .select()
    .from(sessions)
    .where(
      and(
        eq(sessions.id, sessionId),
        isNull(sessions.revokedAt),
        gt(sessions.expiresAt, new Date()),
      ),
    );

  if (!session) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const [user] = await db.select().from(users).where(eq(users.id, session.userId));
  if (!user) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  next();
}
