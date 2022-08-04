import { Request, Response } from "express";
import { TokenPayload } from "google-auth-library";
import { sendErrorFactory } from "../../errorResponses";
import generateToken, { NewToken } from "./generateToken";
import getGooglePayload, { GoogleClientRequest } from "./getGooglePayload";
import getUserByEmail from "./getUserByEmail";

export default async function (req: Request, res: Response) {

  const sendError = sendErrorFactory(res, "AuthenticationError");
  const googleRequest = req.body as GoogleClientRequest;

  try {
    const payload = (await getGooglePayload(googleRequest)) as TokenPayload;

    console.log(payload);

    if (!payload) {
      sendError("noLoginWithGoogle");
      return;
    }

    const user = await getUserByEmail(payload.email as string);

    console.log(user);

    if (user.loggedInWithGoogle) {
      const token = await generateToken(user);
      res.send(token);
      return;
    } else {
      sendError("noLoginWithGoogle");
    }
  } catch (e) {
    console.log(e);
    sendError("unknownError");
  }
}
