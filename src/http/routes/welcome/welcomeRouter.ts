import * as express from "express";
import { apiRoutes } from "../apiRoutes";
import getWelcome from "./getWelcome";
import hasSeenWelcome from "./hasSeenWelcome";

const welcomeRouter = express.Router();

welcomeRouter.patch(apiRoutes.hasSeenWelcome, hasSeenWelcome);

welcomeRouter.get(apiRoutes.welcome, getWelcome);

export default welcomeRouter;
