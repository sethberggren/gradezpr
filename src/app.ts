import express, { NextFunction, request, response } from "express";
import authenticationRouter from "./http/routes/authentication/authenticationRouter";
import cors from "cors";
import googleRoute from "./http/routes/googleRoute/googleRoute";
import coursesRouter from "./http/routes/courses/coursesRouter";
import students from "./http/routes/students/studentsRoute";
import assignments from "./http/routes/assignments/assignmentRouter";
import upload from "./http/routes/upload/uploadRouter";
import fileUpload from "express-fileupload";
import { verifyToken } from "./http/middleware/verifyToken";
import setNewTokenHeader from "./http/middleware/setNewTokenHeader";
import initalize from "./http/routes/initialize/initializeRouter";
import userRequestRouter from "./http/routes/userRequest/userRequestRouter";
import { BUILD_TYPE } from "./config";
import welcomeRouter from "./http/routes/welcome/welcomeRouter";

const app = express();

app.use(express.json());
app.use(cors({exposedHeaders: "x-access-token"}));
app.use(
  fileUpload({
    debug: false,
  })
);
app.use(verifyToken);
app.use(setNewTokenHeader);

// app.use(genericRouter)
app.use(authenticationRouter);
app.use(googleRoute);
app.use(coursesRouter);
app.use(students);
app.use(assignments);
app.use(upload);
app.use(initalize);
app.use(userRequestRouter);
app.use(welcomeRouter);

app.get("/", (req, res) => {

  res.json({
    firstName: "Padme",
    lastName: "Skywalker",
    forcePower: "Unlimited",
    buildType: BUILD_TYPE
  });
});

export default app;




