import FiltersModel from "../models/filters.js";
import { HttpError } from "../models/HttpError.js";

export const filtersData = async (req, res, next) => {
  let filtersData;
  try {
    filtersData = await FiltersModel.findOne({}, "");
  } catch (error) {
    const err = new HttpError(
      "Fetching data failed, please try again later",
      500
    );
    return next(err);
  }
  res.json(filtersData);
};
