
import { populateDb } from "../../../../testingData/populateDb";
import { verifyApiResponseFactory } from "../../../../testingData/verifyApiResponseFactory";
import { apiRoutes } from "../apiRoutes";
import { InitializeResponse } from "./initializeRouter";

let expectedReturn : InitializeResponse;

const verifyApiResponse = verifyApiResponseFactory(apiRoutes.initialize, "GET");

describe("initialize endpoint", () => {
    beforeAll(async () => {
       expectedReturn = await populateDb(true);
    });

    it("should respond appropriately", async () => {
        await verifyApiResponse({verifyOpt: "BODY", desiredResponse: expectedReturn});
    });
});