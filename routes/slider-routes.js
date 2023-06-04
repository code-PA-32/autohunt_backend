import express from "express";
import { loadSliders } from "../controllers/slider-controller.js";

export const sliderRouter = express.Router();

sliderRouter.get("/data", loadSliders);
