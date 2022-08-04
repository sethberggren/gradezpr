import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
  REQUIRED_SCOPES,
} from "../../../config";
import { User } from "../../../models/User";
import { sendErrorFactory } from "../../errorResponses";
import { getGoogleTokens } from "./getGoogleTokens";

export type GrantAdditionalScopesRequest = {
  code: string
};

export default async function grantAdditionalScopes(
  req: Request,
  res: Response
) {
  const sendError = sendErrorFactory(res, "GoogleError");
  const user = req.user;
  const code = req.body.code;

  if (!code || typeof code !== "string") {
    sendError("noInformation");
    return;
  }

  // first, make sure the scopes match what is required to faciliate the application.

  try {
    
    const tokens = await getGoogleTokens(code);
    const scopes = tokens.scope;

    if (scopes) {
      for (const scope of REQUIRED_SCOPES) {
        if (!scopes.includes(scope)) {
          sendError("noScopes");
          return;
        }
      }

      if (tokens.refresh_token) {
        const updatedUser = await User.query()
          .findById(user.id)
          .patch({ googleToken: tokens.refresh_token });

        res.send({ status: "OK" });
        return;
      } else {
        sendError("unknownError");
        return;
      }
    } else {
      sendError("unknownError");
      return;
    }
  } catch (e) {
    console.log(e);
    sendError("unknownError");
  }
}


