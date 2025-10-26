import Village from "../models/villages.models.js";
import { villageSchema } from "../schema/villages.schema.js";
import Hospital from "../models/hospitals.models.js"

// ---------------- Haversine Formula ----------------
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};


// ---------------- Find Top 3 Nearest Hospitals ----------------
async function findTopNearestHospitals(lat, lon, limit = 3) {
  const hospitals = await Hospital.find({});
  if (!hospitals.length) return [];

  // Calculate distances to all hospitals
  const distances = hospitals.map((h) => {
    const distKm = calculateDistance(
      lat,
      lon,
      h.location.coordinates[1],
      h.location.coordinates[0]
    );
    return {
      hospital: h,
      distanceKm: distKm,
    };
  });

  // Sort by ascending distance and take top 3
  distances.sort((a, b) => a.distanceKm - b.distanceKm);
  return distances.slice(0, limit);
}


// ---------------- Compute Access Score (Avg of Top 3) ----------------
function computeAverageAccessScore(village, hospitalData) {
  if (!hospitalData.length) return 0;

  // Score = (doctors/population)/distance
  const scores = hospitalData.map((h) => {
    const ratio = h.hospital.doctors / village.population;
    return ratio / h.distanceKm;
  });

  const avgScore = scores.reduce((sum, s) => sum + s, 0) / scores.length;

  // Optional clamp 0–1
  return Math.min(avgScore, 1);
}


export const getAllVillages = async () => {
  return await Village.find();
};

// export const getVillageById = async (id) => {
//   return await Village.findById(id);
// };
export const getVillageByVillageId = async (villageId) => {
  return await Village.findOne({villageId: villageId});
};

// export const createVillage = async (data) => {
//   const village = new Village(data);
//   return await village.save();
// };



// ---------------- CREATE ----------------
export async function createVillage(data) {
  const parsed = villageSchema.parse(data);
  const [lon, lat] = parsed.location.coordinates;

  const nearestHospitals = await findTopNearestHospitals(lat, lon);

  const hospitalIds = nearestHospitals.map((h) => h.hospital.hospitalId);
  const distances = nearestHospitals.map((h) => h.distanceKm);

  const villageData = {
    ...parsed,
    nearestHospitals: hospitalIds,
    nearestHospitalsDistance: distances,
  };

  const newVillage = new Village(villageData);

  // Compute avg access score across top 3
  newVillage.accessScore = computeAverageAccessScore(newVillage, nearestHospitals);

  return await newVillage.save();
}

// export const updateVillage = async (villageId, data) => {
//   return await Village.findOneAndUpdate({villageId: villageId}, data, { new: true });
// };


// ---------------- UPDATE ----------------
export async function updateVillage(villageId, data) {
  const parsed = villageSchema.partial().parse(data);
  const existing = await Village.findOne({ villageId });
  if (!existing) throw new Error("Village not found");

  Object.assign(existing, parsed);

  if (parsed.location && parsed.location.coordinates) {
    const [lon, lat] = parsed.location.coordinates;
    const nearestHospitals = await findTopNearestHospitals(lat, lon);

    existing.nearestHospitals = nearestHospitals.map((h) => h.hospital.hospitalId);
    existing.nearestHospitalsDistance = nearestHospitals.map((h) => h.distanceKm);
    existing.accessScore = computeAverageAccessScore(existing, nearestHospitals);
  } else {
    // Recalculate score using existing hospitals if available
    if (existing.nearestHospitals && existing.nearestHospitals.length) {
      const hospitals = await Hospital.find({
        hospitalId: { $in: existing.nearestHospitals },
      });
      const hospitalData = hospitals.map((h, i) => ({
        hospital: h,
        distanceKm: existing.nearestHospitalsDistance[i] ?? 1,
      }));
      existing.accessScore = computeAverageAccessScore(existing, hospitalData);
    }
  }

  return await existing.save();
}

export const deleteVillage = async (villageId) => {
  return await Village.findOneAndDelete({villageId: villageId});
};


// ---------------- BULK ASSIGN (Recalculate for All Villages) ----------------
export async function assignNearestHospitalsToVillages() {
  const hospitals = await Hospital.find({});
  const villages = await Village.find({});
  if (!hospitals.length) throw new Error("No hospitals found in the database.");

  const updates = [];

  for (const village of villages) {
    const [lon, lat] = village.location.coordinates;
    const nearestHospitals = await findTopNearestHospitals(lat, lon);

    if (nearestHospitals.length) {
      village.nearestHospitals = nearestHospitals.map((h) => h.hospital.hospitalId);
      village.nearestHospitalsDistance = nearestHospitals.map((h) => h.distanceKm);
      village.accessScore = computeAverageAccessScore(village, nearestHospitals);
 // 🧹 Remove deprecated fields
    village.set("nearestHospitalId", undefined, { strict: false });
    village.set("nearestHospitalDistance", undefined, { strict: false });

    await village.save();

      updates.push({
        village: village.name,
        nearestHospitals: village.nearestHospitals,
        distances: village.nearestHospitalsDistance.map((d) => d.toFixed(2)),
        accessScore: village.accessScore.toFixed(4),
      });
    }
  }

  return { updatedCount: updates.length, updates };
}