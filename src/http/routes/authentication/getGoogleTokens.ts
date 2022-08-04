import { OAuth2Client } from "google-auth-library";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } from "../../../config";

export async function getGoogleTokens(code: string) {
    const client = new OAuth2Client(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      GOOGLE_REDIRECT_URI
    );
  
    const result = await client.getToken(code);
    const tokens = result.tokens;
  
    return tokens;
  }