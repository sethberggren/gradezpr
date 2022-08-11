import { Request, Response } from "express";
import { sendErrorFactory } from "../../errorResponses";

export type WelcomeResponse = {
  header: string;
  body: string;
};

const welcomeResponse: WelcomeResponse[] = [
  {
    header: "Welcome to Gradezpr! ⚡",
    body: "So excited to have you here as part of the Gradezpr community.  Before you dive in, here are some tips.",
  },
  {
    header: "Tip #1",
    body: "See that gear in the upper right hand corner of your screen?  This is where you access all the settings for Gradezpr.",
  },
  {
    header: "Tip #2",
    body: "Gradezpr needs at least one course and at least one student to import grades.  Add students and courses in settings.",
  },
  {
    header: "Tip #3",
    body: "Upload your assignments using the 'Import Assignment' button on the Gradezpr homepage.",
  },
  {
    header: "Tip #4",
    body: "Zap your grades into PowerSchool using the Gradezpr extension.",
  },
  {
    header: "That's all!",
    body: "Go forth and zap.",
  },
];

export default async function getWelcome(req: Request, res: Response) {
  const sendError = sendErrorFactory(res, "UnknownError");

  try {
    res.send(welcomeResponse);
  } catch (error) {
    console.log(error);

    sendError("unknownError");
  }
}
