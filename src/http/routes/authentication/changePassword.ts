import { Request, Response } from "express";
import { User } from "../../../models/User";
import bcrypt from "bcrypt";
import updatePassword from "./updatePassword";
import { sendErrorFactory } from "../../errorResponses";

export type ChangePasswordRequest = {
  oldPassword: string,
  newPassword: string,
  confirmPassword: string
}

export default async function changePassword(req: Request,  res: Response) {
  const sendError = sendErrorFactory(res, "PasswordChangeError");

  try {
    const user = req.user;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword && !newPassword && !confirmPassword) {
      sendError("noInformation");
      return;
    }

    if (newPassword !== confirmPassword) {
      sendError("passwordsDontMatch");
      return;
    }

    await updatePassword(user.email, {
      type: "Update",
      oldPassword: oldPassword,
      newPassword: newPassword,
    });

    res.status(200).send({status: "OK"});
  } catch (error: any) {
    if (error.message === "Passwords don't match!") {
      sendError("incorrectPassword");
      return;
    }
    console.log(error);
    sendError("unknownError");
  }
}