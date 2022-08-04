import express from "express";
import { apiRoutes } from "../apiRoutes";
import postUserRequest from "./postUserRequest";

const userRequestRouter = express.Router();
userRequestRouter.use(express.json());

userRequestRouter.post(apiRoutes.userRequest, postUserRequest);

export default userRequestRouter;