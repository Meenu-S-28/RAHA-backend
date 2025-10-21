//Acts as a bridge to connect the api endpoints(routes) and the business logic(services)
import * as hospitalService from "../services/hospitals.services.js";
import { hospitalSchema } from "../schema/hospitals.schema.js";
import Hospital from "../models/hospitals.models.js";
import Village from "../models/villages.models.js";

export const getHospitals = async (req, res) => {
  try {
    const hospitals = await hospitalService.getAllHospitals();
    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hospitals", error });
  }
};

export const getHospital = async (req, res) => {
  try {
    const hospital = await hospitalService.getHospitalById(req.params.hospitalId);
    if (!hospital) return res.status(404).json({ message: "Hospital not found" });
    res.json(hospital);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hospital", error });
  }
};

export const createHospital = async (req, res) => {
  try {
    const parsed = hospitalSchema.parse(req.body);
    const newHospital = await hospitalService.createHospital(parsed);
    res.status(201).json(newHospital);
  } catch (error) {
    if (error.errors) res.status(400).json({ message: "Validation failed", errors: error.errors });
    else res.status(500).json({ message: "Error adding hospital", error });
  }
};

export const updateHospital = async (req, res) => {
  try {
    const parsed = hospitalSchema.partial().parse(req.body);
    const updated = await hospitalService.updateHospital(req.params.hospitalId, parsed);
    if (!updated) return res.status(404).json({ message: "Hospital not found" });
    res.json(updated);
  } catch (error) {
    if (error.errors) res.status(400).json({ message: "Validation failed", errors: error.errors });
    else res.status(500).json({ message: "Error updating hospital", error });
  }
};

export const deleteHospital = async (req, res) => {
  try {
    const deleted = await hospitalService.deleteHospital(req.params.hospitalId);
    if (!deleted) return res.status(404).json({ message: "Hospital not found" });
    res.json({ message: "Hospital deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting hospital", error });
  }
};

/**
 * GET /api/hospitals/nearest?service=Emergency&villageId=V001
 * OR
 * GET /api/hospitals/nearest?service=Emergency&lat=12.34&lng=77.56
 */
export const findNearestHospitalByService = async (req, res) => {
  try {
    const { service, lat, lng, villageId } = req.query;

    if (!service) {
      return res.status(400).json({ message: "Service parameter is required." });
    }

    let coordinates;

    // If villageId is provided, fetch its coordinates
    if (villageId) {
      const village = await Village.findOne({ villageId });

      if (!village) {
        return res.status(404).json({ message: `Village with ID ${villageId} not found.` });
      }

      coordinates = village.location.coordinates;
    } 
    // Otherwise, use lat/lng
    else if (lat && lng) {
      coordinates = [parseFloat(lng), parseFloat(lat)];
    } 
    else {
      return res.status(400).json({
        message: "Either villageId or coordinates (lat, lng) must be provided."
      });
    }

    // Perform Geo query for hospitals offering the given service
    const nearest = await Hospital.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates },
          distanceField: "distance",
          spherical: true,
          query: { services: { $regex: new RegExp(service, "i") } }
        }
      },
      { $limit: 1 }
    ]);

    if (!nearest.length) {
      return res.status(404).json({
        message: `No hospital found near provided location offering ${service}.`
      });
    }

    const result = nearest[0];

    return res.status(200).json({
      message: `Nearest hospital offering ${service}`,
      data: {
        hospitalId: result.hospitalId,
        name: result.name,
        district: result.district,
        services: result.services,
        coordinates: result.location.coordinates,
        distanceInKm: (result.distance / 1000).toFixed(2)
      }
    });
  } catch (error) {
    console.error("Error finding nearest hospital:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
