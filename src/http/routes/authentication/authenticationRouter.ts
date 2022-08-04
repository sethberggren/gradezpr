import express from "express";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "../../../config";
import { verifyToken } from "../../middleware/verifyToken";
import { OAuth2Client } from "google-auth-library";
import registerUser from "./registerUser";
import loginUser from "./loginUser";
import changePassword from "./changePassword";
import checkGoogleAuthorization from "./checkGoogleAuthorization";
import registerWithGoogle from "./registerWithGoogle";
import linkWithGoogleAccount from "./linkWithGoogleAccount";
import { apiRoutes } from "../apiRoutes";
import loginUserWithGoogle from "./loginUserWithGoogle";
import grantAdditionalScopes from "./grantAdditionalScopes";
import deleteUser from "./deleteUser";

const authenticationRouter = express.Router();
authenticationRouter.use(express.json());
// authenticationRouter.use(verifyToken);

export type RegisterForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmedPassword?: string;
};

authenticationRouter.post(apiRoutes.register, registerUser);
authenticationRouter.post(apiRoutes.login, loginUser);
authenticationRouter.patch(apiRoutes.changePassword, changePassword);
// authenticationRouter.get("/auth/google", checkGoogleAuthorization);
authenticationRouter.post(apiRoutes.registerWithGoogle, registerWithGoogle);
authenticationRouter.post(apiRoutes.linkWithGoogle, linkWithGoogleAccount);
authenticationRouter.post(apiRoutes.loginWithGoogle, loginUserWithGoogle);
authenticationRouter.post(
  apiRoutes.grantAdditionalScopes,
  grantAdditionalScopes
);
authenticationRouter.delete(apiRoutes.deleteUser, deleteUser);

export default authenticationRouter;