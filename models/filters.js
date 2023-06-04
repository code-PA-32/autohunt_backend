import mongoose from "mongoose";

const Schema = mongoose.Schema;

const citySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const Filters = new Schema({
  brand: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    enum: [
      "White",
      "Black",
      "Silver",
      "Gray",
      "Blue",
      "Red",
      "Brown",
      "Green",
      "Orange",
      "Gold",
      "Navy",
    ],
    required: true,
  },
  bodyType: [
    {
      type: String,
      required: true,
    },
  ],
  year: {
    type: String,
    required: true,
    min: 2010,
    max: 2023,
  },
  drive: [
    {
      type: String,
      required: true,
    },
  ],
  chargingType: [{ type: String, required: true }],
  batteryCapacity: [{ type: String, required: true }],
  chargingTime: [{ type: String, required: true }],
  transmission: [
    {
      type: String,
      required: true,
    },
  ],
  fuelType: [
    {
      type: String,
      required: true,
    },
  ],
  features: {
    PowerSteering: Boolean,
    AC: Boolean,
    Alarm: Boolean,
    Bluetooth: Boolean,
    HeatedSeats: Boolean,
    WiFi: Boolean,
    CruiseControl: Boolean,
    FrontParkingSensor: Boolean,
    RearParkingSensor: Boolean,
    RoofRack: Boolean,
    PowerWindows: Boolean,
    Sunroof: Boolean,
    UsbPort: Boolean,
    SoundSystem: Boolean,
    MemorySeat: Boolean,
    Camera360: Boolean,
  },
  locations: {
    name: {
      type: String,
      required: true,
    },
    cities: [citySchema],
  },
});

const FiltersModel = mongoose.model("Filters", Filters);

export default FiltersModel;
