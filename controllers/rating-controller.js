import { RatingModel } from "../models/rating.js";
import { HttpError } from "../models/HttpError.js";
import { validationResult } from "express-validator";

export const postRating = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data", 422)
    );
  }
  const { date, photo, name, rev, stared, userId } = req.body;

  const createRating = new RatingModel({
    date,
    rev,
    name,
    photo,
    stared,
    userId,
  });

  try {
    await createRating.save();
  } catch (error) {
    console.log(error);
    return next(new HttpError("Can't create new comment, try again", 500));
  }
  res.status(201).json({ date, rev, name, photo, stared, userId });
};
