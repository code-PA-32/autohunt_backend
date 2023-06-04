import express from "express";
import { check } from "express-validator";

import { postRating } from "../controllers/rating-controller.js";

export const ratingRouter = express.Router();

ratingRouter.post("/create-post", [
  check("name").not().isEmpty(),
  check("rev").not().isEmpty().isLength({ min: 10 }),
  postRating,
]);
