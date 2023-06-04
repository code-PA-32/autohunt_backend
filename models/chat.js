import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Chat = new Schema({
  car: { type: mongoose.Schema.Types.ObjectId, ref: "Car" },
  subject: { type: String, required: true },
  title: { type: String },
  image: { type: String },
  users: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  ],
  messages: [
    {
      senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      text: { type: String },
      textImage: { type: String },
      timestamp: { type: Date, default: Date.now },
      status: { type: Boolean, default: false },
    },
  ],
});

const ChatModel = mongoose.model("Chat", Chat);

export default ChatModel;
