import { db } from "..";
import { users, Newuser } from "../schema";
import { and, eq } from "drizzle-orm";
import { verify } from "argon2";

export async function addUser(user:Newuser){
    const [addedUser] = await db.insert(users).values(user).returning();
    return addedUser;
};

export async function checkEmail(email:string){
    const checkEmail = await db.select().from(users).where(eq(users.email, email));
    if (checkEmail.length === 0){
        return
    }
    return checkEmail[0]?.id;
};

export async function checkPassword(password:string, userId:number){
    const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId));

    if (!user) return false;

    const isValid = await verify(user.passwordHash, password);
    return isValid;
};