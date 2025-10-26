import mongoose from "mongoose";

const VillageSchema = new mongoose.Schema(
  {
    villageId: {
      type: String,
      required: [true, "Village ID is required"],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Village name is required"],
      trim: true,
    },
    district: {
      type: String,
      required: [true, "District is required"],
      trim: true,
    },
    population: {
      type: Number,
      required: [true, "Population is required"],
      min: [0, "Population cannot be negative"],
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
          validator: function (val) {
            return Array.isArray(val) && val.length === 2;
          },
          message: "Coordinates must be an array of [longitude, latitude]",
        },
      },
    },
    accessScore: {
      type: Number,
      default: null,
      min: 0,
      max: 100,
    },
     nearestHospitals: [
    {
      type: String, // since you’re using hospitalId like "H001"
      ref: "Hospital",
    },
  ],
  nearestHospitalsDistance: [Number],
  },
  {
    timestamps: true,
  }
);

// Enable spatial queries
VillageSchema.index({ location: "2dsphere" });

export default mongoose.model("Village", VillageSchema);
