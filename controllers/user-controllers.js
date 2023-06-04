import UserModel from "../models/user.js";
import { HttpError } from "../models/HttpError.js";
import { validationResult } from "express-validator";
import { hash, compare } from "bcrypt";
import fs from "fs";

export const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data", 422)
    );
  }

  const { name, email, password, phone, isAdmin, photo, messages, likedCars } =
    req.body;

  let existingUser;
  try {
    existingUser = await UserModel.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User exists already, please login instead.",
      422
    );
    return next(error);
  }

  let hashedPass;

  try {
    hashedPass = await hash(password, 12);
  } catch (e) {
    const error = new HttpError("Something went wrong", 500);
    return next(error);
  }

  const createdUser = new UserModel({
    name,
    email,
    password: hashedPass,
    phone,
    photo,
    isAdmin,
    messages,
    likedCars,
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again", 500);
    return next(error);
  }

  res.status(201).json({
    name,
    email,
    phone,
    isAdmin,
    photo,
    messages,
    likedCars,
    userId: createdUser._id,
  });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;

  try {
    existingUser = await UserModel.findOne({ email: email });
  } catch (error) {
    const err = new HttpError("Logging in failed, please try again later", 500);
    return next(err);
  }

  if (!existingUser) {
    const err = new HttpError(
      "Invalid credentials, could not log you in.",
      401
    );
    return next(err);
  }

  let isValidPass = false;

  try {
    isValidPass = await compare(password, existingUser.password);
  } catch (error) {
    const err = new HttpError("Can't log you in, check your inputs", 500);
    return next(err);
  }
  console.log(existingUser);
  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    name: existingUser.name,
    isAdmin: existingUser.isAdmin,
    photo: existingUser.photo,
    phone: existingUser.phone,
    chats: existingUser.chats,
    likedCars: existingUser.likedCars,
  });
};

export const userLikedCar = async (req, res, next) => {
  const likedCars = await req.body;
  const userId = req.params.userId;

  let user;
  try {
    user = await UserModel.findByIdAndUpdate(
      userId,
      { likedCars: likedCars },
      { new: true }
    );
  } catch (error) {
    return next("Can't update users data, try again", 500);
  }
  res.json({ message: "User updated", id: user._id });
};

export const updateUserPhoto = async (req, res, next) => {
  const id = req.params.userId;
  const photo = req.files.image;
  let userToReturn;
  try {
    if (photo) {
      const user = await UserModel.findById(id);
      const oldPhoto = user.photo || null;

      if (fs.existsSync(`uploads/${oldPhoto}`)) {
        fs.unlinkSync(`uploads/${oldPhoto}`);
      }

      const newPhoto = Date.now().toString() + photo.name;
      photo.mv(`uploads/` + newPhoto);
      await UserModel.findByIdAndUpdate(id, {
        $set: { photo: newPhoto },
      });
      userToReturn = await UserModel.findById(id);
    }
  } catch (error) {
    console.log(error);
    return next("Can't update user photo", 500);
  }
  res.json(userToReturn.photo);
};

export const updateUserData = async (req, res, next) => {
  const id = req.params.userId;
  const { name, phone } = req.body;
  console.log(req.params);
  console.log(name, phone);
  let updatedUser;
  try {
    updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { $set: { name: name, phone: phone } },
      { new: true }
    );
  } catch (error) {
    console.log(error);
    return next("Can't update user's data", 500);
  }
  res.json({ name: updatedUser.name, phone: updatedUser.phone });
};

export const getUsersChatIds = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await UserModel.findById(userId).lean();
    const chatIds = user.chats;
    res.json(chatIds);
  } catch (error) {
    console.log(error);
    return next(new HttpError("Can't load user's chats ids"));
  }
};
