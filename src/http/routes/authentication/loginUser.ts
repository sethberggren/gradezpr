import { Request, Response } from "express";
import { User } from "../../../models/User";
import bcrypt from "bcrypt";
import generateToken from "./generateToken";
import getUserByEmail from "./getUserByEmail";
import { comparePasswords } from "./passwordTools";
import { sendErrorFactory } from "../../errorResponses";
import { googleDefaultPassword } from "./registerWithGoogle";

type TokenResponse = {
  token: string;
};

export type LoginUserRequest = {
  email: string,
  password: string
};

export default async function loginUser(req: Request, res: Response) {

  const sendError = sendErrorFactory(res, "AuthenticationError");

  try {
    const receivedUser = req.body;

    if (
      receivedUser.password === undefined ||
      receivedUser.email === undefined
    ) {
      sendError("noEmailOrPassword");
      return;
    }

    const user = await getUserByEmail(receivedUser.email);

    if (!user) {
      sendError("userDoesNotExist");
      return;
    }

    // check if user is trying to login with the default Google Password and throw an error, because the user should login with Google

    if (await comparePasswords(googleDefaultPassword, receivedUser.password)) {
      sendError("accountInformationMismatch");
      return;
    }

    // check if passwords are the same

    if (await comparePasswords(user.password, receivedUser.password)) {
      // create token

      const token = await generateToken(user);

      res.status(200).json(token);
    } else {
      sendError("accountInformationMismatch");
      return;
    }
  } catch (error) {
    console.log(error);
    sendError("accountInformationMismatch");
  }
}
