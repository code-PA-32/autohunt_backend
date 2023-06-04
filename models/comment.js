import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  text: { type: String, required: true },
  name: { type: String, required: true },
  photo: { type: String, required: true },
  userId: { type: String, required: true },
});

const CommentModel = mongoose.model("Comment", CommentSchema);

export default CommentModel;
