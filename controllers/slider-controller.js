import SliderModel from "../models/slider.js";

import { HttpError } from "../models/HttpError.js";

export const loadSliders = async (req, res, next) => {
  let sliders;
  try {
    sliders = await SliderModel.find({}, "");
  } catch (error) {
    const err = new HttpError(
      "Fetching slides failed, please try again later",
      500
    );
    return next(err);
  }
  res.json(sliders.map((s) => s.toObject({ getters: true })));
};
