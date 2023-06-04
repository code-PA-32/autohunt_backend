import express from "express";

import { getCarLogos } from "../controllers/logo-controller.js";
export const logoRouter = express.Router();

logoRouter.get("/", getCarLogos);
