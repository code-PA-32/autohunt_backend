import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Expert = new Schema({
  name: { type: String },
  photo: { type: String },
  phone: { type: String },
  email: { type: String },
});

const ReviewSchema = new Schema({
  car: { type: String },
  price: { type: String },
  video: { type: String },
  img: { type: String },
  intro: { type: String },
  pros: [{ type: String }],
  cons: [{ type: String }],
  whatNew: [{ type: String }],
  expert: { type: Expert },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});

const ReviewModel = mongoose.model("Review", ReviewSchema);
export default ReviewModel;
