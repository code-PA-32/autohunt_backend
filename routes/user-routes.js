import express from "express";
import { check } from "express-validator";

import {
  signup,
  login,
  userLikedCar,
  updateUserPhoto,
  updateUserData,
  getUsersChatIds,
} from "../controllers/user-controllers.js";

export const userRouter = express.Router();

userRouter.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
    check("phone").isLength({ min: 9 }),
  ],
  signup
);
userRouter.post("/login", login);

userRouter.put("/update-user-cars/:userId", userLikedCar);
userRouter.put("/update-user-photo/:userId", updateUserPhoto);
userRouter.put("/update-user-data/:userId", updateUserData);

userRouter.get("/get-users-chat-id/:userId", getUsersChatIds);
