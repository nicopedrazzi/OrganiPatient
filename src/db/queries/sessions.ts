import { db } from "..";
import { sessions } from "../schema";
import { newSession } from "../schema";
import { eq } from "drizzle-orm";

export async function createNewSession(session:newSession){
    const newSession = await db.insert(sessions).values(session).onConflictDoNothing().returning();
    return newSession;
};

export async function revokeCookie(cookie:string){
    await db.update(sessions)
    .set({ revokedAt: new Date() })
    .where(eq(sessions.id, cookie));
};