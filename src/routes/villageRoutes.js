
import express from "express";
import {
  getVillages,
  getVillage,
  createVillage,
  updateVillage,
  deleteVillage,
  assignNearestHospitals,
  getVillageAccessHeatmap,
  getVillageHospitalConnections,
} from "../controllers/villageController.js";

const router = express.Router();

// REST API Endpoints
router.get("/", getVillages);          // GET all
router.get("/:id", getVillage);        // GET one
router.post("/", createVillage);       // POST create
router.put("/:id", updateVillage);     // PUT update
router.delete("/:id", deleteVillage);  // DELETE

// Bulk updater API
router.post("/assignNearestHospitals", assignNearestHospitals);

router.get("/heatmap/access", getVillageAccessHeatmap);

router.get("/connections",getVillageHospitalConnections);


export default router;

