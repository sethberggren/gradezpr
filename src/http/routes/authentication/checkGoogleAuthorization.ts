import { Request, Response } from "express";
import { User } from "../../../models/User";
import { googleAuthorize } from "../../../services/googleAuthorization";
import getUserByEmail from "./getUserByEmail";

export default async function checkGoogleAuthorization(
  req: Request,
  res: Response
) {
  try {
    const user = req.user;

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

    res.status(200).json({
      email: dbUser.email,
      userGoogleRequiredScopes: userIsLoggedInWithGoogle,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Unable to check if user is logged in with Google.",
    });
  }
}
