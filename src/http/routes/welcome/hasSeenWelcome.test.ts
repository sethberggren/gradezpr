import { populateDb } from "../../../../testingData/populateDb";
import { verifyApiResponseFactory } from "../../../../testingData/verifyApiResponseFactory";
import { apiRoutes } from "../apiRoutes";

describe("hasSeenWelcome test", () => {
  const verifyApiResponse = verifyApiResponseFactory(
    apiRoutes.hasSeenWelcome,
    "PATCH"
  );

  beforeAll(async () => {
    await populateDb(false);
  });

  it("should make the request correctly", async () => {
    await verifyApiResponse({}, { verifyOpt: "CODE" });
  });
});
