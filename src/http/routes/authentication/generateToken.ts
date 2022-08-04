import { TOKEN_KEY } from "../../../config";
import { User } from "../../../models/User";
import * as jwt from "jsonwebtoken";

export type NewToken = {
  token: string;
  expiresAt: string;
};

export const tokenExpiresInMinutes = 30;

export default async function generateToken(user: User): Promise<NewToken> {
  const token = jwt.sign({ id: user.id, email: user.email }, TOKEN_KEY, {
    expiresIn: `${tokenExpiresInMinutes}m`,
  });

  // update the token in the database
  await User.query().patch({ currAccessToken: token }).findById(user.id);

  return {
    token: token,
    expiresAt: getExpiryTime(tokenExpiresInMinutes),
  };
}

function getExpiryTime(minutes: number) {
  const currentTime = new Date();

  const expiresAt = new Date();
  expiresAt.setMinutes(currentTime.getMinutes() + tokenExpiresInMinutes);

  return expiresAt.toUTCString();
}
