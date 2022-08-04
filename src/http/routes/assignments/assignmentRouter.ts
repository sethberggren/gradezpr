import express from "express";
import { apiRoutes } from "../apiRoutes";
import deleteAssignment from "./deleteAssignment";

const assignments = express.Router();
assignments.use(express.json());

assignments.delete(apiRoutes.assignments, deleteAssignment);

export default assignments;