import express from "express";
import { apiRoutes } from "../apiRoutes";
import postCourse from "./postCourse";
import deleteCourse from "./deleteCourse";

const coursesRouter = express.Router();
coursesRouter.use(express.json());

coursesRouter.post(apiRoutes.courses, postCourse);
coursesRouter.delete(apiRoutes.courses, deleteCourse);

export default coursesRouter;
