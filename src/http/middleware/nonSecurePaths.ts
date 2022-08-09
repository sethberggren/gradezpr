import { NextFunction, Request } from "express";
import { apiRoutes } from "../routes/apiRoutes";

const nonSecurePaths = [
  "/",
  apiRoutes.register,
  apiRoutes.login,
  apiRoutes.registerWithGoogle,
  apiRoutes.linkWithGoogle,
  apiRoutes.loginWithGoogle,
  apiRoutes.forgotPassword
];

export function isNonSecurePath(req: Request): boolean {
  return nonSecurePaths.includes(req.path);
}
