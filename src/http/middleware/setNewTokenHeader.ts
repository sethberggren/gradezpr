import { NextFunction, Request, Response } from "express";
import { sendErrorFactory } from "../errorResponses";
import generateToken, {
  tokenExpiresInMinutes,
} from "../routes/authentication/generateToken";
import { isNonSecurePath } from "./nonSecurePaths";

export default async function setNewTokenHeader(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const sendError = sendErrorFactory(res, "AuthenticationError");

  if (isNonSecurePath(req)) return next();

  try {
    const newToken = await generateToken(req.user);

    res.set("x-access-token", JSON.stringify(newToken));
    return next();
  } catch (error) {
    console.log(error);
    sendError("unknownError");
  }
}
