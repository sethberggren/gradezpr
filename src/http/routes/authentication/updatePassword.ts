import { User } from "../../../models/User";
import bcrypt from "bcrypt";
import { comparePasswords, encryptPassword } from "./passwordTools";
import getUserByEmail from "./getUserByEmail";

export class WrongPasswordError extends Error {
  
  constructor() {
    super();
  }
}

export default async function updatePassword(
  email: string,
  updateOrNew:
    | { type: "Update"; oldPassword: string; newPassword: string }
    | { type: "New"; newPassword: string }
): Promise<User> {
  const dbUser = await getUserByEmail(email);

  if (updateOrNew.type === "Update") {
    const { oldPassword, newPassword } = updateOrNew;

    if (await comparePasswords(dbUser.password, oldPassword)) {
      const encryptedPassword = await encryptPassword(newPassword);

      return await updateDbPassword(dbUser.id, encryptedPassword);
    } else {
      // how can i check for the error type in the try catch block of the parent (changePassword route?)
      throw new WrongPasswordError();
    }
  } else {
    const { newPassword } = updateOrNew;

    const encryptedPassword = await encryptPassword(newPassword);

    return await updateDbPassword(dbUser.id, encryptedPassword);
  }
}

async function updateDbPassword(id: number, encryptedPassword: string) {
  return await User.query().patchAndFetchById(id, {
    password: encryptedPassword,
  });
}
