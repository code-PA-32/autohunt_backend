import express from "express";

import { filtersData } from "../controllers/filters-controller.js";

export const filtersRouter = express.Router();

filtersRouter.get("/data", filtersData);
