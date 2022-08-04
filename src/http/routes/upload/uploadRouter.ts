import express from "express";
import { apiRoutes } from "../apiRoutes";
import uploadFileStats from "./uploadFileStats";
import uploadFileCurve from "./uploadFileCurve";

const upload = express.Router();
upload.use(express.json());

upload.post(apiRoutes.uploadFileStats, uploadFileStats);
upload.post(apiRoutes.uploadFileCurve, uploadFileCurve);

export default upload;
