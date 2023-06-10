import * as dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import fileUpload from "express-fileupload";
import cors from "cors";
import { HttpError } from "./models/HttpError.js";
import { userRouter } from "./routes/user-routes.js";
import { sliderRouter } from "./routes/slider-routes.js";
import { filtersRouter } from "./routes/filters-routes.js";
import { carsRouter } from "./routes/car-routes.js";
import { ratingRouter } from "./routes/rating-routes.js";
import { newsRouter } from "./routes/news-router.js";
import { logoRouter } from "./routes/logo-routers.js";
import { chatRouter } from "./routes/chat-routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(fileUpload());
app.use(express.json());
app.use(express.static("uploads"));

app.use("/api/users", userRouter);

app.use("/api/sliders", sliderRouter);

app.use("/api/filters", filtersRouter);

app.use("/api/cars", carsRouter);

app.use("/api/rating", ratingRouter);

app.use("/api/news", newsRouter);

app.use("/api/chats", chatRouter);

app.use("/api/logos", logoRouter);

// app.use((req, res, next) => {
//   const error = new HttpError("Could not find this route", 404);
//   throw error;
// });

mongoose
  .connect(
    `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cars.at4onex.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => app.listen(3030))
  .then(() => console.log("run"))
  .catch((e) => console.log(e));
