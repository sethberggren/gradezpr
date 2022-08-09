import { User } from "../../../models/User";

export default async function getUserByEmail(email: string) {
  const user = (await User.query().select().where({ email: email }));

  return user[0] as User;
}
