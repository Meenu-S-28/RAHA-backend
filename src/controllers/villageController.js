//Acts as a bridge to connect the api endpoints(routes) and the business logic(services)
import { villageSchema } from "../schema/villages.schema.js";
import * as villageService from "../services/villages.services.js";
import Village from "../models/villages.models.js";
import Hospital from "../models/hospitals.models.js";

export const getVillageHospitalConnections = async (req, res) => {
  try {
    const villages = await Village.find({
      nearestHospitals: { $exists: true, $ne: [] }
    });

    const hospitalMap = {};
    const hospitals = await Hospital.find();

    hospitals.forEach(h => {
      hospitalMap[h.hospitalId] = h;
    });

    const result = villages.map(v => ({
      village: {
        name: v.name,
        coordinates: [
          v.location.coordinates[1],
          v.location.coordinates[0]
        ],
        accessScore: v.accessScore
      },
      hospitals: v.nearestHospitals.map((hid, i) => {
        const h = hospitalMap[hid];
        return h
          ? {
              hospitalId: hid,
              name: h.name,
              coordinates: [
                h.location.coordinates[1],
                h.location.coordinates[0]
              ],
              distanceKm: v.nearestHospitalsDistance?.[i] ?? null
            }
          : null;
      }).filter(Boolean)
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch village-hospital connections",
      error: err.message
    });
  }
};

export const getVillageAccessHeatmap = async (req, res) => {
  try {
    const villages = await Village.find(
      { accessScore: { $exists: true } },
      {
        _id: 0,
        accessScore: 1,
        "location.coordinates": 1
      }
    );

    const heatmapData = villages.map(v => ({
      lat: v.location.coordinates[1],
      lng: v.location.coordinates[0],
      intensity: Math.min(1, Math.max(0, Number(v.accessScore)))
    }));

    res.json(heatmapData);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch village heatmap data",
      error: error.message
    });
  }
};


export const getVillages = async (req, res) => {
  try {
    const villages = await villageService.getAllVillages();
    res.status(200).json(villages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching villages", error });
  }
};

export const getVillage = async (req, res) => {
  try {
    const village = await villageService.getVillageByVillageId(req.params.id);
    if (!village) return res.status(404).json({ message: "Village not found" });
    res.status(200).json(village);
  } catch (error) {
    res.status(500).json({ message: "Error fetching village", error });
  }
};

export const createVillage = async (req, res) => {
  try {
    const parsed = villageSchema.parse(req.body);
    const newVillage = await villageService.createVillage(parsed);
    res.status(201).json(newVillage);
  } catch (error) {
    if (error.errors) {
      res.status(400).json({ message: "Validation failed", errors: error.errors });
    } else {
      res.status(500).json({ message: "Error creating village", error });
    }
  }
};

export const updateVillage = async (req, res) => {
  try {
    const parsed = villageSchema.partial().parse(req.body); // allow partial updates
    const updated = await villageService.updateVillage(req.params.id, parsed);
    if (!updated) return res.status(404).json({ message: "Village not found" });
    res.status(200).json(updated);
  } catch (error) {
    if (error.errors) {
      res.status(400).json({ message: "Validation failed", errors: error.errors });
    } else {
      res.status(500).json({ message: "Error updating village", error });
    }
  }
};

export const deleteVillage = async (req, res) => {
  try {
    const deleted = await villageService.deleteVillage(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Village not found" });
    res.status(200).json({ message: "Village deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting village", error });
  }
};

export const assignNearestHospitals = async (req, res) => {
  try {
    const result = await villageService.assignNearestHospitalsToVillages();
    res.status(200).json({
      message: "Nearest hospitals assigned successfully!",
      ...result,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};