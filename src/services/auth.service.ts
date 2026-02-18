import { addUser, checkPassword, getUserByEmail } from "../db/queries/users";
import { hash } from "argon2";
import { userRoleEnum } from "../db/schema";
import { createNewSession } from "../db/queries/sessions";

export type User = {
  email: string;
  role: (typeof userRoleEnum.enumValues)[number];
  orgId: string;
};

export async function userRegistration(user: User, password: string) {
  const passwordHash = await hash(password);
  const created = await addUser({
    email: user.email,
    passwordHash,
    role: user.role,
    orgId: user.orgId,
  });
  if (!created) {
    throw new Error("Failed to create user");
  }

  return {
    id: created.id,
    email: created.email,
    role: created.role,
    orgId: created.orgId,
    isActive: created.isActive,
    createdAt: created.createdAt,
  };
}

export async function userLogin(email: string, password: string) {
  const user = await getUserByEmail(email);
  if (!user) {
    return false;
  } else if (!checkPassword(password, user.id)){
    return false;
  };
  const session = createNewSession({userId: user.id})
  return session;
}

