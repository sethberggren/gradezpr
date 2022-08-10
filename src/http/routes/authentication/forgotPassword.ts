import { Request, Response } from "express";
import { sendErrorFactory } from "../../errorResponses";
import getUserByEmail from "./getUserByEmail";
import updatePassword from "./updatePassword";
import { EMAIL_CONFIG } from "../../../config";
import { v4 as uuid } from "uuid";
import * as nodemailer from "nodemailer";

export const newUuidPassword = () => {
  const newPassword = uuid();
  return newPassword;
};

export default async function forgotPassword(req: Request, res: Response) {
  const sendError = sendErrorFactory(res, "AuthenticationError");
  try {
    const email = req.body.email;

    if (!email) {
      sendError("noEmailOrPassword");
      return;
    }

    const user = await getUserByEmail(email);

    if (!user) {
      sendError("userDoesNotExist");
      return;
    }

    const tempPassword = newUuidPassword();

    console.log(tempPassword);

    updatePassword(email, { type: "New", newPassword: tempPassword });

    // const testAcount = await nodemailer.createTestAccount();

    // const transporter = nodemailer.createTransport({
    //   host: "smtp.ethereal.email",
    //   port: 587,
    //   secure: false,
    //   auth: {
    //     user: testAcount.user,
    //     pass: testAcount.pass,
    //   },
    // });

    const transporter = nodemailer.createTransport({
        host: EMAIL_CONFIG.server,
        port: EMAIL_CONFIG.port,
        secure: true,
        auth: {
            user: EMAIL_CONFIG.username,
            pass: EMAIL_CONFIG.password
        }
    });

    const info = await transporter.sendMail({
      from: `Seth Berggren <${EMAIL_CONFIG.username}>`,
      to: user.email,
      subject: `Gradezpr Password Reset Request`,
      html: resetPasswordEmail(user.firstName, tempPassword),
    });

    // console.log("Preview Url  " + nodemailer.getTestMessageUrl(info));

    res.status(200).send({ status: "OK" });
  } catch (e) {
    console.log(e);

    sendError("unknownError");
  }
}

function resetPasswordEmail(firstName: string, newPassword: string) {
  return `<p>Hello ${firstName}!</p> <br></br> <br></br>

    <p>You recently requested to reset your password for Gradezpr.  Your temporary password can be found below.</p>

    <br></br>

    <h2>${newPassword}</h2>
    
    <br></br>

    <p>Please <a href="https://gradezpr.iceberggren.com/login">login</a> using the new password, then go and change your password in settings. </p>

    <br></br>

    <p>Have a great day!</p>

    <br></br>

    <p>Seth from gradezpr</p>
    `;
}
