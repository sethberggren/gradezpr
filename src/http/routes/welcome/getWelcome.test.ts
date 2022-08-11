import { populateDb } from "../../../../testingData/populateDb"
import { verifyApiResponseFactory } from "../../../../testingData/verifyApiResponseFactory";
import { apiRoutes } from "../apiRoutes";



const welcomeResponse = [
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

describe("getWelcome route test", () => {


    const verifyApiResponse = verifyApiResponseFactory(apiRoutes.welcome, "GET");

    beforeAll(async () => {
        await populateDb(false);
    });

    it("should make the repsonse correctly", async () => {
        await verifyApiResponse({verifyOpt: "BODY", desiredResponse: welcomeResponse});
    })
})