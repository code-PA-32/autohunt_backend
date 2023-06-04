import mongoose from "mongoose";

const Schema = mongoose.Schema;

const LogoSchema = new mongoose.Schema({
  logo: { type: String },
  filter: { type: String },
});

const LogoModel = mongoose.model("Logo", LogoSchema);

export default LogoModel;
