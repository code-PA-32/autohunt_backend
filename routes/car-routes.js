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
  addCarViews,
} from "../controllers/car-controller.js";

export const carsRouter = express.Router();

carsRouter.get("/new-cars", getNewRecommended);

carsRouter.get("/used-cars", getUsedRecommended);

carsRouter.get("/compare-cars", getTwoCompareCars);

carsRouter.get("/autohunt-limit-cars", getAutohuntReviewLimit);

carsRouter.get("/autohunt-reviews", getAutohuntReview);

carsRouter.get("/filtered-cars", getCarsByFilters);

carsRouter.post("/compare-cars-byId", getCompareById);

carsRouter.post("/create-car", createOrUpdateCar);

carsRouter.put("/update-car", setCarImages);

carsRouter.get("/user-cars/:saleId", getUsersCar);

carsRouter.post("/user-liked-cars", getUserLikedCars);

carsRouter.get("/update-car-byId/:carId", getCarByIdAndLoad);

carsRouter.get("/car-reviews-details/:carId", getReviewDetailsById);

carsRouter.post("/car-reviews", getCarsReviews);

carsRouter.post("/car-add-review", addCarReview);

carsRouter.post("/car-delete-review", deleteCarReview);

carsRouter.post("/autohunt-delete-comment", deleteAutohuntComment);

carsRouter.post("/autohunt-add-comment", addAutohuntComment);

carsRouter.get("/autohunt/:id", getAutohuntCarDetails);

carsRouter.patch("/add-views/:carId", addCarViews);

carsRouter.get("/:id", getOneCarById);
