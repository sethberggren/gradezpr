import express from "express";
import { apiRoutes } from "../apiRoutes";
import getDriveFiles from "./getDriveFiles";
import importDriveFile from "./importDriveFile";
import curveDriveFile from "./curveDriveFile";

const googleRoute = express.Router();
googleRoute.use(express.json());

googleRoute.get(apiRoutes.getDriveFiles, getDriveFiles);
googleRoute.post(apiRoutes.importDriveFile, importDriveFile);
googleRoute.post(apiRoutes.curveDriveFile, curveDriveFile);

export default googleRoute;
