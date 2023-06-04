import LogoModel from "../models/logo.js";
import { HttpError } from "../models/HttpError.js";

export const getCarLogos = async (req, res, next) => {
  try {
    const logos = await LogoModel.find();
    res.json(logos.map((l) => l.toObject({ getters: true })));
  } catch (error) {
    console.log(error);
    return next(new HttpError("Cant load Cars logos", 500));
  }
};
