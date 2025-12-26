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

/* -------- SPECIAL ROUTES FIRST -------- */
router.get("/heatmap/access", getVillageAccessHeatmap);
router.get("/connections", getVillageHospitalConnections);
router.post("/assignNearestHospitals", assignNearestHospitals);

/* -------- STANDARD CRUD -------- */
router.get("/", getVillages);
router.get("/:id", getVillage);
router.post("/", createVillage);
router.put("/:id", updateVillage);
router.delete("/:id", deleteVillage);

export default router;
