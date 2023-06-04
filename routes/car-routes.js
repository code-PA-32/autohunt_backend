import express from "express";

import {
  getNewRecommended,
  getUsedRecommended,
  getTwoCompareCars,
  getOneCarById,
  getCarsByFilters,
  getCompareById,
  createOrUpdateCar,
  setCarImages,
  getUsersCar,
  getUserLikedCars,
  getCarByIdAndLoad,
  getCarsReviews,
  getReviewDetailsById,
  addCarReview,
  deleteCarReview,
  getAutohuntReview,
  getAutohuntCarDetails,
  addAutohuntComment,
  deleteAutohuntComment,
  getAutohuntReviewLimit,
} from "../controllers/car-controller.js";

export const getCarsRouter = express.Router();

getCarsRouter.get("/new-cars", getNewRecommended);

getCarsRouter.get("/used-cars", getUsedRecommended);

getCarsRouter.get("/compare-cars", getTwoCompareCars);

getCarsRouter.get("/autohunt-limit-cars", getAutohuntReviewLimit);

getCarsRouter.get("/autohunt-reviews", getAutohuntReview);

getCarsRouter.get("/filtered-cars", getCarsByFilters);

getCarsRouter.post("/compare-cars-byId", getCompareById);

getCarsRouter.post("/create-car", createOrUpdateCar);

getCarsRouter.put("/update-car", setCarImages);

getCarsRouter.get("/user-cars/:saleId", getUsersCar);

getCarsRouter.post("/user-liked-cars", getUserLikedCars);

getCarsRouter.get("/update-car-byId/:carId", getCarByIdAndLoad);

getCarsRouter.get("/car-reviews-details/:carId", getReviewDetailsById);

getCarsRouter.post("/car-reviews", getCarsReviews);

getCarsRouter.post("/car-add-review", addCarReview);

getCarsRouter.post("/car-delete-review", deleteCarReview);

getCarsRouter.post("/autohunt-delete-comment", deleteAutohuntComment);

getCarsRouter.post("/autohunt-add-comment", addAutohuntComment);

getCarsRouter.get("/autohunt/:id", getAutohuntCarDetails);

getCarsRouter.get("/:id", getOneCarById);
