import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { TOKEN_KEY } from "../../config";
import { User } from "../../models/User";
import { sendErrorFactory } from "../errorResponses";
import { isNonSecurePath } from "./nonSecurePaths";

export async function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (isNonSecurePath(req)) return next();

  const sendError = sendErrorFactory(res, "AuthenticationError");

  const token = req.body.token || req.headers["x-access-token"];

  if (!token) {
    sendError("noEmailOrPassword");
    return;
  }

  try {
    const decoded = jwt.verify(token, TOKEN_KEY) as {
      id: number;
      email: string;
    };

    const user = await User.query().findById(decoded.id);

    // if user does not exist in the database, or the stored access token in the database does not match what the user sent over
    // return with a bad request.
    if (user === undefined || user.currAccessToken !== token) {
      sendError("noEmailOrPassword");
      return;
    }

    req.user = user;
  } catch (error) {
    if (error === jwt.TokenExpiredError) {
      sendError("tokenExpired");
      return;
    }
    console.log(`Unable to log in user with token because of: ${error}`);
    sendError("unknownError");
    return;
  }

  return next();
}
