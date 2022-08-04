import { Request, Response } from "express";
import { searchDriveFiles } from "../../../services/driveTools";
import { googleAuthorize } from "../../../services/googleAuthorization";
import { sendErrorFactory } from "../../errorResponses";

export type DriveFile = {
  id: string;
  name: string;
};

export default async function getDriveFiles(req: Request, res: Response) {
  const sendError = sendErrorFactory(res, "GoogleError");

  const fileName = req.query.fileName as string;

  if (fileName === undefined) {
    sendError("noInformation");
    return;
  }

  if (!req.user.googleToken) {
    sendError("noScopes");
    return;
  }

  try {
    const googleUser = await googleAuthorize(req.user.googleToken);

    const driveFiles = (await searchDriveFiles(
      fileName,
      googleUser
    )) as DriveFile[];

    res.json(driveFiles);
  } catch (error) {
    console.log(error);
    sendError("unknownError");
  }
}
