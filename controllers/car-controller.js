import CarModel from "../models/car.js";
import { HttpError } from "../models/HttpError.js";
import { calculateRatingStats } from "../utils/ratingCalc.js";
import { RatingModel } from "../models/rating.js";
import ReviewModel from "../models/carReview.js";
import CommentModel from "../models/comment.js";
import fs from "fs";
import path from "path";
import JSZip from "jszip";
import { fileURLToPath } from "url";
import { Readable } from "stream";
import { getCoordinates } from "../utils/location.js";
import { calculateAverageRatings } from "../utils/calcTotalRating.js";
import { avrUserRating } from "../utils/calcTotalRating.js";
import { dateFormat } from "../utils/dateFormat.js";

export const getNewRecommended = async (req, res, next) => {
  let newCars;
  try {
    newCars = await CarModel.find({ condition: true, top: true })
      .limit(3)
      .select("condition top label location rating src details price")
      .populate({ path: "rating" })
      .lean();
  } catch (error) {
    const err = new HttpError("Can't load new cars", 500);
    return next(err);
  }
  newCars = newCars.map((car) => ({
    ...car,
    rating: calculateRatingStats(car.rating),
    id: car._id,
  }));

  res.json(newCars);
};

export const getUsedRecommended = async (req, res, next) => {
  let usedCars;
  try {
    usedCars = await CarModel.find({ condition: false, top: true })
      .limit(3)
      .select("condition top label location rating src details price")
      .populate({ path: "rating" })
      .lean();
  } catch (error) {
    const err = new HttpError("Can't load used cars", 500);
    return next(err);
  }

  usedCars = usedCars.map((car) => ({
    ...car,
    rating: calculateRatingStats(car.rating),
    id: car._id,
  }));

  res.json(usedCars);
};

export const getTwoCompareCars = async (req, res, next) => {
  let twoCars;
  try {
    twoCars = await CarModel.find()
      .skip(5)
      .limit(2)
      .select("condition top label location rating src details price")
      .populate({ path: "rating" })
      .lean();
  } catch (error) {
    return next(new HttpError("Can't load cars, try again", 500));
  }

  twoCars = twoCars.map((car) => ({
    ...car,
    rating: calculateRatingStats(car.rating),
    id: car._id,
  }));

  res.json(twoCars);
};

export const getCompareById = async (req, res, next) => {
  let compareCars;
  const ids = req.body;

  try {
    if (!ids || ids.length === 0) {
      compareCars = [];
    } else {
      compareCars = await CarModel.find({ _id: { $in: ids } })
        .select("condition top label location rating src details price")
        .populate({ path: "rating" })
        .lean();
      compareCars = compareCars.map((car) => ({
        ...car,
        rating: calculateRatingStats(car.rating),
        id: car._id,
      }));
    }
  } catch (error) {
    return next(new HttpError("Can't load cars, server error", 500));
  }
  res.json(compareCars);
};

export const getOneCarById = async (req, res, next) => {
  let oneCar;
  const carId = req.params.id;
  try {
    oneCar = await CarModel.findById(carId)
      .populate("dealer")
      .populate("rating")
      .lean();
  } catch (error) {
    return next(new HttpError("Can't load data, try again", 500));
  }
  oneCar = {
    ...oneCar,
    id: oneCar._id,
    rating: calculateRatingStats(oneCar.rating),
    dealer: {
      id: oneCar.dealer._id,
      name: oneCar.dealer.name,
      email: oneCar.dealer.email,
      phone: oneCar.dealer.phone,
      photo: oneCar.dealer.photo,
    },
  };
  res.json(oneCar);
};

export const getCarsByFilters = async (req, res, next) => {
  let filteredCars;
  let totalCars;
  try {
    const filters = req.query;

    const filterObject = {};

    if (filters) {
      if (filters.condition !== undefined && filters.condition !== "") {
        filterObject.condition = filters.condition;
      }
      if (
        filters.brand &&
        typeof filters.brand === "string" &&
        filters.brand.trim() !== ""
      ) {
        filterObject["details.Car Details.Brand"] = filters.brand.trim();
      }

      if (
        filters.color &&
        Array.isArray(filters.color) &&
        filters.color.length > 0
      ) {
        filterObject["details.Car Details.Exterior Color"] = {
          $in: filters.color,
        };
      }

      if (
        filters.location &&
        Array.isArray(filters.location) &&
        filters.location.length > 0
      ) {
        filterObject["location.state"] = { $in: filters.location };
      }

      if (
        filters.passengers &&
        Array.isArray(filters.passengers) &&
        filters.passengers.length > 0
      ) {
        filterObject["details.Car Details.Seats"] = {
          $in: filters.passengers,
        };
      }

      if (
        filters.model &&
        Array.isArray(filters.model) &&
        filters.model.length > 0
      ) {
        filterObject["details.Car Details.Model"] = {
          $in: filters.model,
        };
      }

      if (
        filters.year &&
        Array.isArray(filters.year) &&
        filters.year.length > 0
      ) {
        filterObject["details.Car Details.Year"] = {
          $in: filters.year,
        };
      }

      if (
        filters.bodyType &&
        Array.isArray(filters.bodyType) &&
        filters.bodyType.length > 0
      ) {
        filterObject["details.Car Details.Body Type"] = {
          $in: filters.bodyType,
        };
      }

      if (
        filters.transmission &&
        Array.isArray(filters.transmission) &&
        filters.transmission.length > 0
      ) {
        filterObject["details.Engine.Transmission"] = {
          $in: filters.transmission,
        };
      }

      if (
        filters.fuelType &&
        Array.isArray(filters.fuelType) &&
        filters.fuelType.length > 0
      ) {
        filterObject["details.Engine.Fuel Type"] = {
          $in: filters.fuelType,
        };
      }

      if (
        filters.driveTrain &&
        Array.isArray(filters.driveTrain) &&
        filters.driveTrain.length > 0
      ) {
        filterObject["details.Engine.Drivetrain"] = {
          $in: filters.driveTrain,
        };
      }

      if (filters.term && filters.term.trim() !== "") {
        const searchTerm = filters.term.trim();
        filterObject.$or = [
          {
            "details.Car Details.Brand": { $regex: searchTerm, $options: "i" },
          },
          {
            "details.Car Details.Model": { $regex: searchTerm, $options: "i" },
          },
        ];
      }

      if (
        filters.price &&
        Array.isArray(filters.price) &&
        filters.price.length === 2
      ) {
        const [minPrice, maxPrice] = filters.price;
        filterObject.price = { $gte: minPrice, $lte: maxPrice };
      }
    }
    const pageNumber = filters.pagination && parseInt(filters.pagination);
    const pageSize = 10;
    const skipCount = (pageNumber - 1) * pageSize;

    const sortObject = {};
    if (filters.sort === "priceLow") {
      sortObject.price = 1;
    } else if (filters.sort === "priceHigh") {
      sortObject.price = -1;
    } else if (filters.sort === "yearLow") {
      sortObject["details.Car Details.Year"] = 1;
    } else if (filters.sort === "yearHigh") {
      sortObject["details.Car Details.Year"] = -1;
    }

    filteredCars = await CarModel.find(filterObject)
      .populate({
        path: "rating",
      })
      .sort(sortObject)
      .lean();

    totalCars = filteredCars.length;

    filteredCars = filteredCars.slice(skipCount, skipCount + pageSize);
  } catch (error) {
    return next(new HttpError("Can't load cars, server error", 500));
  }

  filteredCars = filteredCars.map((car) => ({
    ...car,
    rating: calculateRatingStats(car.rating),
    id: car._id,
  }));

  res.json({ cars: filteredCars, total: totalCars });
};

export const createOrUpdateCar = async (req, res, next) => {
  const {
    id,
    condition,
    saleId,
    top,
    price,
    label,
    location,
    views,
    description,
    src,
    rating,
    dealer,
    details,
  } = req.body;

  let existingCar;
  const coordinates = await getCoordinates(location.city);
  try {
    if (id) {
      existingCar = await CarModel.findById(id);
      if (!existingCar) {
        return next(new HttpError("Car not found", 404));
      }
      existingCar.condition = condition;
      existingCar.saleId = saleId;
      existingCar.top = top;
      existingCar.price = price;
      existingCar.label = label;
      existingCar.location = location;
      existingCar.views = views;
      existingCar.description = description;
      existingCar.src = src;
      existingCar.rating = rating;
      existingCar.dealer = dealer;
      existingCar.details = details;

      await existingCar.save();

      console.log("Car updated:", existingCar);
      res.json({ id: existingCar._id, message: "Car updated" });
    } else {
      const newCar = new CarModel({
        condition,
        saleId,
        top,
        price,
        label,
        location: {
          state: location.state,
          city: location.city,
          coords: coordinates,
        },
        views,
        src,
        description,
        rating,
        dealer,
        details,
      });
      await newCar.save();

      console.log("New car created:", newCar);
      res.json({ id: newCar._id, message: "New car created" });
    }
  } catch (error) {
    console.log(error);
    return next(
      new HttpError("Server error, can't create/update the car", 500)
    );
  }
};

export const setCarImages = async (req, res, next) => {
  const carId = req.body.carId;
  let carToUpdate;
  const car = await CarModel.findById(carId);
  const oldImages = car?.src || [];

  oldImages.forEach((image) => {
    if (fs.existsSync(`uploads/${image}`)) {
      fs.unlinkSync(`uploads/${image}`);
    }
  });

  const images = Array.isArray(req.files.images)
    ? req.files.images
    : Array.from([req.files.images]);

  images.forEach((file, i) => {
    const imageName = Date.now().toString() + file.name;
    file.mv(`uploads/${imageName}`);
    images[i] = imageName;
  });

  try {
    carToUpdate = await CarModel.findByIdAndUpdate(
      carId,
      { $set: { src: images } },
      { new: true }
    );
  } catch (error) {
    console.log(error);
    return next(new HttpError("Server error, can't update car images", 500));
  }

  res.json(carToUpdate._id);
};

export const getUsersCar = async (req, res, next) => {
  let usersCars;
  const saleId = req.params.saleId;

  try {
    usersCars = await CarModel.find({ saleId: saleId })
      .select("condition top label location rating src details price")
      .populate({ path: "rating" })
      .lean();
    usersCars = usersCars.map((car) => ({
      ...car,
      rating: calculateRatingStats(car.rating),
      id: car._id,
    }));
  } catch (error) {
    return next("Can't get user cars");
  }
  res.json(usersCars);
};

export const getUserLikedCars = async (req, res, next) => {
  const likedCars = req.body;
  let userLikedCars;
  try {
    userLikedCars = await CarModel.find({ _id: { $in: likedCars } })
      .select("condition top label location rating src details price")
      .populate({ path: "rating" })
      .lean();
    userLikedCars = userLikedCars.map((car) => ({
      ...car,
      rating: calculateRatingStats(car.rating),
      id: car._id,
    }));
  } catch (error) {
    return next("Can't fetch user liked cars", 500);
  }
  res.json(userLikedCars);
};

export const getCarByIdAndLoad = async (req, res, next) => {
  const carId = req.params.carId;
  console.log(carId);
  try {
    const car = await CarModel.findById(carId);
    if (!car) {
      return next(new HttpError("Can't find a car", 404));
    }
    const images = car.src || [];
    const imageStreams = [];
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    for (const image of images) {
      const imagePath = path.join(__dirname, "..", "uploads", image);
      if (fs.existsSync(imagePath)) {
        const imageStream = fs.createReadStream(imagePath);
        imageStreams.push({ stream: imageStream, name: image });
      }
    }

    const carData = {
      condition: car.condition,
      top: car.top,
      price: car.price,
      views: car.views,
      details: car.details,
      description: car.description,
      dealer: car.dealer,
      id: car._id,
      location: car.location,
      label: car.label,
      rating: car.rating,
      saleId: car.saleId,
    };

    const zip = new JSZip();
    zip.file("car-data.json", JSON.stringify(carData));

    for (let i = 0; i < imageStreams.length; i++) {
      const { stream, name } = imageStreams[i];
      zip.file(`image-${i + 1}.jpg`, stream, { binary: true, name });
    }

    const zipContent = await zip.generateAsync({ type: "nodebuffer" });
    const stream = new Readable();
    stream.push(zipContent);
    stream.push(null);
    res.set("Content-Disposition", 'attachment; filename="car-data.zip"');
    res.set("Content-Type", "application/zip");
    stream.pipe(res);
  } catch (error) {
    console.log(error);
  }
};

export const getCarsReviews = async (req, res, next) => {
  const filterData = req.body;

  let total;
  let carsWithReviews;
  const filter = {};

  try {
    if (filterData) {
      if (filterData.brand !== null) {
        filter["details.Car Details.Brand"] = filterData.brand;
      }
      if (filterData.model !== null) {
        filter["details.Car Details.Model"] = filterData.model;
      }
    }
    const pageNumber = filterData.pagination && parseInt(filterData.pagination);
    const size = 9;
    const skip = (pageNumber - 1) * size;
    carsWithReviews = await CarModel.find(filter)
      .populate({ path: "rating" })
      .lean();
    carsWithReviews = carsWithReviews
      .filter((c) => c.rating.length !== 0)
      .map((car) => ({
        ...car,
        rating: calculateRatingStats(car.rating),
        id: car._id,
      }));
    total = carsWithReviews.length;
    carsWithReviews = carsWithReviews.slice(skip, skip + size);
  } catch (error) {
    console.log(error);
    return next(new HttpError("Cant get cars with reviews", 500));
  }
  res.json({ cars: carsWithReviews, total: total });
};

export const getReviewDetailsById = async (req, res, next) => {
  const id = req.params.carId;

  let carReviewDetails;
  try {
    carReviewDetails = await CarModel.findById(id)
      .select("rating src details price")
      .populate("rating")
      .lean();

    const rating = carReviewDetails.rating || [];

    carReviewDetails = {
      id: carReviewDetails._id,
      rating: rating
        .sort((a, b) => a.date - b.date)
        .map((r) => ({
          ...r,
          id: r._id,
          date: dateFormat(r.date),
          stared: avrUserRating(r.stared),
        })),
      src: carReviewDetails.src,
      price: carReviewDetails.price,
      details: {
        brand: carReviewDetails.details["Car Details"].Brand,
        model: carReviewDetails.details["Car Details"].Model,
      },
      avrRating: calculateAverageRatings(carReviewDetails.rating),
    };
  } catch (error) {
    console.log(error);
    return next("Can't load cars data", 500);
  }
  res.json(carReviewDetails);
};

export const addCarReview = async (req, res, next) => {
  const { carId, date, photo, name, rev, stared, userId } = req.body;

  let updatedCar;

  try {
    const newReview = new RatingModel({
      date,
      photo,
      name,
      rev,
      stared,
      userId,
    });
    await newReview.save();

    const updateQuery = { $push: { rating: newReview._id } };
    const updateOptions = { new: true };

    const carUpdatePromise = CarModel.findByIdAndUpdate(
      carId,
      updateQuery,
      updateOptions
    )
      .populate("rating")
      .lean();
    const carPromise = CarModel.findById(carId).select("rating").lean();

    const [updatedCarWithRating, carWithoutRating] = await Promise.all([
      carUpdatePromise,
      carPromise,
    ]);

    if (!carWithoutRating) {
      return res.status(404).json({ error: "Car not found" });
    }

    updatedCar = {
      avrRating: calculateAverageRatings(updatedCarWithRating.rating),
      rating: {
        ...newReview._doc,
        id: newReview._id,
        stared: avrUserRating(newReview.stared),
        date: dateFormat(newReview.date),
      },
    };
  } catch (error) {
    return next(new HttpError("Can't update a car", 500));
  }

  res.json(updatedCar);
};

export const deleteCarReview = async (req, res, next) => {
  const { carId, commentId } = req.body;
  let dataToReturn;
  try {
    await RatingModel.findByIdAndDelete(commentId);
    await CarModel.findByIdAndUpdate(
      carId,
      { $pull: { rating: commentId } },
      { new: true }
    );
    dataToReturn = await CarModel.findById(carId)
      .select("rating")
      .populate("rating")
      .lean();
    dataToReturn = calculateAverageRatings(dataToReturn.rating);
  } catch (error) {
    return next("Cant delete data", 500);
  }
  console.log(dataToReturn);
  res.json({ avrRating: dataToReturn, commentId });
};

export const getAutohuntReviewLimit = async (req, res, next) => {
  let car;
  try {
    car = await CarModel.find({ review: { $exists: true } })
      .select("condition top label location rating src details price")
      .populate({ path: "rating" })
      .limit(3)
      .lean();
    car = car.map((car) => ({
      ...car,
      id: car._id,
      rating: calculateRatingStats(car.rating),
    }));
  } catch (error) {
    console.log(error);
    return next(new HttpError("Can't load cars, server error", 500));
  }
  res.json(car);
};

export const getAutohuntReview = async (req, res, next) => {
  let autohuntCars;
  try {
    autohuntCars = await CarModel.find({ review: { $exists: true } })
      .select("condition top label location rating src details price")
      .populate({ path: "rating" })
      .lean();
    autohuntCars = autohuntCars.map((car) => ({
      ...car,
      id: car._id,
      rating: calculateRatingStats(car.rating),
    }));
  } catch (error) {
    console.log(error);
    return next(new HttpError("Can't load cars, server error", 500));
  }
  res.json(autohuntCars);
};

export const getAutohuntCarDetails = async (req, res, next) => {
  let autohuntCar;
  const id = req.params.id;
  try {
    autohuntCar = await CarModel.findById(id)
      .select("review rating")
      .populate("rating")
      .populate({
        path: "review",
        populate: {
          path: "comments",
          model: "Comment",
        },
      })
      .lean();
    const avrRating = calculateAverageRatings(autohuntCar.rating);
    const length = autohuntCar.rating.length || 0;
    autohuntCar = {
      ...autohuntCar,
      review: {
        ...autohuntCar.review,
        id: autohuntCar._id,
        avrRating,
        length,
        reviewId: autohuntCar.review._id,
      },
    };
  } catch (error) {
    return next(new HttpError("Can't load car details", 500));
  }
  res.json(autohuntCar.review);
};

export const addAutohuntComment = async (req, res, next) => {
  const { text, name, photo, userId, reviewId } = req.body;
  let dataToReturn;
  try {
    dataToReturn = await CommentModel({
      text,
      name,
      photo,
      userId,
    });
    await dataToReturn.save();
    await ReviewModel.findByIdAndUpdate(reviewId, {
      $push: { comments: dataToReturn._id },
    });
  } catch (error) {
    return next(new HttpError("Can't add new comment", 500));
  }
  res.json(dataToReturn);
};

export const deleteAutohuntComment = async (req, res, next) => {
  const { reviewId, commentId } = req.body;

  try {
    await CommentModel.findByIdAndDelete(commentId);
    await ReviewModel.findByIdAndUpdate(reviewId, {
      $pull: { comments: commentId },
    });
  } catch (error) {
    console.log(error);
    return next(new HttpError("Can't delete comment", 500));
  }
  res.json(commentId);
};
