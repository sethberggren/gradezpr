import { populateDb } from "../../../../testingData/populateDb";
import { UserRequestRequest } from "./postUserRequest";
import { v4 as uuid } from "uuid";
import { verifyApiResponseFactory } from "../../../../testingData/verifyApiResponseFactory";
import { verifyErrorsFactory } from "../../../../testingData/verifyErrorsFactory";
import { apiRoutes } from "../apiRoutes";

describe("user request route test", () => {
  beforeAll(async () => {
    await populateDb(false);
  });

  it("should be able to successfully post a new user request", async () => {
    const request: UserRequestRequest = {
      typeOfRequest: "Bug",
      requestBody: uuid(),
      shouldBeEmailed: true,
    };

    await verifyApiResponseFactory(apiRoutes.userRequest, "POST")(request, {
      verifyOpt: "CODE",
    });
  });

  it("should respond with an error if the correct information is not sent over", async () => {
    const verifyErrors = verifyErrorsFactory(
      apiRoutes.userRequest,
      "POST",
      "UserRequestError"
    );

    await verifyErrors({}, "noInformation");
    await verifyErrors(
      { typeOfRequest: "Feature", requestBody: uuid() },
      "noInformation"
    );
    await verifyErrors(
      {
        typeOfRequest: "Feaaaaaature",
        requestBody: uuid(),
        shouldBeEmailed: false,
      },
      "noInformation"
    );
  });
});
