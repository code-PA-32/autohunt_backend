import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Slider = new Schema({
  text: { type: String },
  image: { type: String },
});

const SliderModel = mongoose.model("Slider", Slider);

export default SliderModel;
