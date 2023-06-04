import mongoose from "mongoose";

const Schema = mongoose.Schema;

const User = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  photo: { type: String },
  image: { type: String },
  phone: { type: Number, required: true },
  isAdmin: { type: Boolean, required: true },
  chats: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chat" }],
  likedCars: [{ type: String }],
});

const UserModel = mongoose.model("User", User);

export default UserModel;
