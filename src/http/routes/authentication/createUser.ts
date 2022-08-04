import { User } from "../../../models/User";
import { RegisterForm } from "./authenticationRouter";
import bcrypt from "bcrypt";

export default async function createUser(
  registrationForm: RegisterForm,
  loggedInWithGoogle: boolean | undefined,
  googleToken: string | undefined
) {
  let newUserValidated = new User().$validate(registrationForm) as User;
  newUserValidated.loggedInWithGoogle = loggedInWithGoogle;
  newUserValidated.googleToken = googleToken;

  const encryptedPassword = await bcrypt.hash(newUserValidated.password, 10);

  newUserValidated.password = encryptedPassword;

  // give all users the power to read, write, update, and delete.  Give additional permissions through SQL server directly?
  newUserValidated.permission = 3;

  const createdUser = await User.query().insertAndFetch(newUserValidated);
  return createdUser;
};
