import mongoose from "mongoose";

const Schema = mongoose.Schema;

const News = new Schema({
  time: { type: Number },
  image: { type: String },
  image2: { type: String },
  title: { type: String },
  text: { type: String },
  text2: { type: String },
  expert: {
    name: { type: String },
    photo: { type: String },
    phone: { type: String },
    email: { type: String },
  },
  popular: { type: Boolean },
  tags: [{ type: String }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});

const NewsModel = mongoose.model("New", News);
export default NewsModel;
