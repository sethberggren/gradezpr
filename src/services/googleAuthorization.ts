import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, REQUIRED_SCOPES } from "../config";
import { arrayIsSubset } from "../lib/helperFunctions";

export async function googleAuthorize(refreshToken: string) {
    const oAuth2Client = new google.auth.OAuth2(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET
    );
  
    try {
      oAuth2Client.setCredentials({ refresh_token: refreshToken });
    } catch (error) {
      throw new Error(
        "Unable to set oAuth credentials, user may not have associated Google Account with gradezpr account."
      );
    }
  
    const accessToken = await oAuth2Client.getAccessToken();
  
    if (arrayIsSubset(accessToken.res?.data.scope.split(" "), REQUIRED_SCOPES)) {
      return oAuth2Client;
    } else {
      throw new Error("User does not have the required scopes.");
    }
  }