import { Request, Response } from "express";
import { sendErrorFactory } from "../../errorResponses";

export type WelcomeResponse = {
  header: string;
  body: string;
};

const welcomeResponse: WelcomeResponse[] = [
  {
    header: "Welcome to Gradezpr! ⚡",
    body: "<p>So excited to have you here as part of the Gradezpr community.  Before you dive in, here are some tips.</p>",
  },
  {
    header: "Tip #1",
    body: "<p>See that gear in the upper right hand corner of your screen?  This is where you access all the settings for Gradezpr.</p>",
  },
  {
    header: "Tip #2",
    body: "<p>Gradezpr needs at least one course and at least one student to import grades.  Add students and courses in settings.</p>",
  },
  {
    header: "Tip #3",
    body: "<p>Upload your assignments using the 'Import Assignment' button on the Gradezpr homepage.</p>",
  },
  {
    header: "Tip #4",
    body: "<p>Zap your grades into PowerSchool using the Gradezpr <a href='https://chrome.google.com/webstore/detail/gradezpr-extension/kdhmclflakomgdeedipbnoddneiaamea' target='_blank' rel='noopener noreferrer' style='text-decoration:underline'>extension.</a>",
  },
  {
    header: "That's all!",
    body: "<p>Go forth and zap.</p>",
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
