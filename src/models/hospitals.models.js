import mongoose from "mongoose";

const HospitalSchema = new mongoose.Schema({
  hospitalId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, enum: ["District Hospital", "PHC", "Clinic", "Charitable Hospital"], required: true },
  district: { type: String, required: true },
  doctors: { type: Number, default: 0 },
  beds: { type: Number, default: 0 },
  services: [{ type: String }], // e.g., ["OPD", "Emergency"]
  admissionFee: { type: Number, default: 0 },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  lastUpdated: { type: Date, default: Date.now }
});

// Geo index for hospital locations
HospitalSchema.index({ location: "2dsphere" });

export default mongoose.model("Hospital", HospitalSchema);

