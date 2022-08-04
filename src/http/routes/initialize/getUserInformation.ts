import { User } from "../../../models/User";
import { googleAuthorize } from "../../../services/googleAuthorization";
import getUserByEmail from "../authentication/getUserByEmail";

export type UserInformation = {
  email: string;
  userGoogleRequiredScopes: boolean;
};

export default async function getUserInformation(
  user: User
): Promise<UserInformation> {
  let userIsLoggedInWithGoogle = true;

  const dbUser = await getUserByEmail(user.email);

  const { googleToken } = dbUser;

  if (googleToken) {
    const googleUser = await googleAuthorize(googleToken).catch((err) => {
      userIsLoggedInWithGoogle = false;
    });
  } else {
    userIsLoggedInWithGoogle = false;
  }

  return {
    email: dbUser.email,
    userGoogleRequiredScopes: userIsLoggedInWithGoogle,
  };
}
