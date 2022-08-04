import { Request, Response } from "express";
import { User } from "../../../models/User";

export default async function deleteUser(req: Request, res: Response) {
  const user = req.user;

  try {
    await User.query().deleteById(user.id);
    res.status(200).json({deleteStatus: "OK"});
  } catch (e) {
    console.log(e);
    res.status(500).json({deleteStatus: "Error"});
  }
}
