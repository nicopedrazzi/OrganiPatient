import { db } from "..";
import { users, Newuser } from "../schema";
import { eq } from "drizzle-orm";
import { verify } from "argon2";

export async function addUser(user: Newuser) {
  const [addedUser] = await db.insert(users).values(user).returning();
  return addedUser;
}

export async function getUserByEmail(email: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  return user;
}

export async function checkPassword(password: string, userId: number) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId));

  if (!user) return false;
  if (!user.isActive) return false;

  const isValid = await verify(user.passwordHash, password);
  return isValid;
}
