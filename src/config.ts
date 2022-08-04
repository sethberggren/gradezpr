import dotenv from "dotenv";

dotenv.config({path: __dirname + "/../.env"});

export const TOKEN_KEY = process.env.TOKEN_KEY as string;
export const DATABASE_CXN = JSON.parse(process.env.DATABASE_CXN as string);
export const DATABASE_CXN_DEVELOPMENT = JSON.parse(process.env.DATABASE_CXN_DEVELOPMENT as string); 
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;
export const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI as string;
export const BUILD_TYPE = (process.env.BUILD_TYPE as string) === "production" ? "production" : "development" as const;
export const REQUIRED_SCOPES = ['https://www.googleapis.com/auth/drive.readonly', 'https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/spreadsheets.readonly' ];

