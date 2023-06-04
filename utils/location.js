import axios from "axios";
import { HttpError } from "../models/HttpError.js";
import * as dotenv from "dotenv";
dotenv.config();

const KEY = process.env.GOOGLE_API;

export const getCoordinates = async (address) => {
  console.log(KEY);
  const res = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${KEY}`
  );
  const data = res.data;
  if (!data || data.status === "ZERO_RESULTS") {
    throw new HttpError("Can't find location with this address", 422);
  }
  console.log(res.data);
  const coordinates = data.results[0].geometry.location;
  return coordinates;
};
