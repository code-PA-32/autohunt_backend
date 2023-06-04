import mongoose from "mongoose";

const Schema = mongoose.Schema;

const LocationSchema = new Schema({
  state: { type: String, required: true },
  city: { type: String, required: true },
  coords: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
});

const CarDetailsSchema = new Schema({
  Brand: { type: String, required: true },
  Model: { type: String, required: true },
  Condition: { type: String, required: true },
  Year: { type: String, required: true },
  "Body Type": { type: String, required: true },
  Seats: { type: String, required: true },
  "Exterior Color": { type: String, required: true },
});

const EngineSchema = new Schema({
  "Fuel Type": { type: String, required: true },
  Mileage: { type: String, required: true },
  Transmission: { type: String, required: true },
  Drivetrain: { type: String, required: true },
  Power: { type: String, required: true },
  "Engine Capacity": { type: String, required: true },
});

const BatterySchema = new Schema({
  "Battery Capacity": { type: String, required: true },
  "Charge Port": { type: String, required: true },
  "Charge Time (0->Full)": { type: String, required: true },
});

const DimensionSchema = new Schema({
  Length: { type: String, required: true },
  Width: { type: String, required: true },
  Height: { type: String, required: true },
  "Cargo Volume": { type: String, required: true },
});

const FuturesSchema = new Schema({
  "Power Steering": { type: Boolean, required: true },
  AC: { type: Boolean, required: true },
  Alarm: { type: Boolean, required: true },
  Bluetooth: { type: Boolean, required: true },
  "Heated Seats": { type: Boolean, required: true },
  WiFi: { type: Boolean, required: true },
  "Cruise Control": { type: Boolean, required: true },
  "Front Parking Sensor": { type: Boolean, required: true },
  "Rear Parking Sensor": { type: Boolean, required: true },
  "Roof Rack": { type: Boolean, required: true },
  "Power Windows": { type: Boolean, required: true },
  Sunroof: { type: Boolean, required: true },
  "USB Port": { type: Boolean, required: true },
  "Sound System": { type: Boolean, required: true },
  "Memory Seat": { type: Boolean, required: true },
  "Camera 360": { type: Boolean, required: true },
});

const CarSchema = new Schema({
  condition: { type: Boolean, required: true },
  top: { type: Boolean, required: true },
  label: { type: String },
  price: { type: Number, required: true },
  views: { type: Number },
  saleId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  location: { type: LocationSchema, required: true },
  rating: [{ type: mongoose.Schema.Types.ObjectId, ref: "Rating" }],
  dealer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  review: { type: mongoose.Schema.Types.ObjectId, ref: "Review" },
  src: [{ type: String, required: false }],
  description: { type: String, required: true },
  details: {
    "Car Details": { type: CarDetailsSchema },
    Engine: { type: EngineSchema },
    "Battery and Charging": { type: BatterySchema },
    Dimension: { type: DimensionSchema },
    Futures: { type: FuturesSchema },
  },
});

const CarModel = mongoose.model("Car", CarSchema);

export default CarModel;
