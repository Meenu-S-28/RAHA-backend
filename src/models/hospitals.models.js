// import mongoose from "mongoose";

// const HospitalSchema = new mongoose.Schema({
//   hospitalId: { type: String, required: true, unique: true },
//   name: { type: String, required: true },
//   type: { type: String, enum: ["District Hospital", "PHC", "Clinic", "Charitable Hospital"], required: true },
//   district: { type: String, required: true },
//   doctors: { type: Number, default: 0 },
//   beds: { type: Number, default: 0 },
//   services: [{ type: String }], // e.g., ["OPD", "Emergency"]
//   admissionFee: { type: Number, default: 0 },
//   location: {
//     type: {
//       type: String,
//       enum: ["Point"],
//       default: "Point",
//       required: true
//     },
//     coordinates: {
//       type: [Number], // [longitude, latitude]
//       required: true
//     }
//   },
//   lastUpdated: { type: Date, default: Date.now }
// });

// // Geo index for hospital locations
// HospitalSchema.index({ location: "2dsphere" });

// export default mongoose.model("Hospital", HospitalSchema);

import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema(
  {
    hospitalId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["District Hospital", "PHC", "Clinic", "Charitable Hospital"],
    },
    district: {
      type: String,
      required: true,
      trim: true,
    },
    doctors: {
      type: Number,
      default: 0,
      min: 0,
    },
    beds: {
      type: Number,
      default: 0,
      min: 0,
    },
    services: {
      type: [String],
      default: [],
    },
    admissionFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
        required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
        validate: {
          validator: function (value) {
            if (!Array.isArray(value) || value.length !== 2) return false;
            const [lng, lat] = value;
            return (
              !isNaN(lng) &&
              !isNaN(lat) &&
              lng >= -180 &&
              lng <= 180 &&
              lat >= -90 &&
              lat <= 90
            );
          },
          message: "Invalid GeoJSON coordinates",
        },
      },
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Create geospatial index for queries like $near, $geoWithin
hospitalSchema.index({ location: "2dsphere" });

// Export the model
export default mongoose.model("Hospital", hospitalSchema);
