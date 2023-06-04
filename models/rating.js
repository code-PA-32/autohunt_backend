import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Rating = mongoose.Schema({
  date: { type: Number, required: true },
  photo: { type: String },
  name: { type: String, required: true },
  rev: { type: String, required: true },
  stared: {
    Comfort: { type: Number, required: true },
    Design: { type: Number, required: true },
    Performance: { type: Number, required: true },
    Price: { type: Number, required: true },
    Reliability: { type: Number, required: true },
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

export const RatingModel = mongoose.model("Rating", Rating);
