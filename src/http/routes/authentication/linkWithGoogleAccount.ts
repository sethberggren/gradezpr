import { Request, Response } from "express";
import { pass } from "fp-ts/lib/Writer";
import { User } from "../../../models/User";
import { sendErrorFactory } from "../../errorResponses";
import generateToken, { NewToken } from "./generateToken";
import getUserByEmail from "./getUserByEmail";
import { comparePasswords } from "./passwordTools";

export type LinkWithGoogleRequest = {
  email: string;
  password: string;
  confirmedPassword: string;
};

type LinkWithGoogleResponse = NewToken;

// the route if the user wants to link a new google account with an existing account

export default async function linkWithGoogleAccount(
  req: Request,
  res: Response
) {

  const sendError = sendErrorFactory(res, "RegistrationError");

  const { email, password, confirmedPassword } =
    req.body as LinkWithGoogleRequest;

  if (!email || !password || !confirmedPassword) {
    sendError("noInformation");
    return;
  }

  if (password !== confirmedPassword) {
    sendError("passwordsDontMatch");
    return;
  }

  try {
    const user = await updateLoginWithGoogleDb(email, password);

    const token = await generateToken(user);

    res.status(200).send(token);
  } catch (e: any) {

    if (e.message === incorrectPasswordError) {
      sendError("invalidPassword");
      return;
    }
    console.log(e);
    sendError("unknownError");
  }
}

const incorrectPasswordError = "User supplied an incorrect password!" as const;

const updateLoginWithGoogleDb = async (email: string, password: string) => {
  const dbUser = await getUserByEmail(email);

  if (await comparePasswords(dbUser.password, password)) {
    return await User.query().patchAndFetchById(dbUser.id, {
      loggedInWithGoogle: true,
    });
  } else {
    throw new Error(incorrectPasswordError);
  }
};
