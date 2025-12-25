//to define api endpoints
import express from "express";
import * as hospitalController from "../controllers/hospitalController.js";

const router = express.Router();

router.get("/nearest", hospitalController.findNearestHospitalByService);

router.get("/", hospitalController.getHospitals);
router.get("/:hospitalId", hospitalController.getHospital);
router.post("/", hospitalController.createHospital);
router.put("/:hospitalId", hospitalController.updateHospital);
router.delete("/:hospitalId", hospitalController.deleteHospital);


export default router;

