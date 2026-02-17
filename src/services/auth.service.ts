import { addUser, checkEmail, checkPassword } from "../db/queries/users";
import { hash } from "argon2";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export type User = {
  email: string;
  name: string;
  surname: string;
};

export async function userRegistration(user: User, password: string) {
  const passwordHash = await hash(password);
  const created = await addUser({
    email: user.email,
    name: user.name,
    surname: user.surname,
    passwordHash,
  });
  if (!created) {
    throw new Error("Failed to create user");
  }

  return {
    id: created.id,
    email: created.email,
    name: created.name,
    surname: created.surname,
    createdAt: created.createdAt,
  };
}

export async function userLogin(email:string, password:string){
    const userId = await checkEmail(email);
    if (!userId){
        throw new Error("Unknown email");
    };
    if (await checkPassword(password,userId)){
        return true;
    };
    return false;
};
