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

// ---------------- Find Nearest Hospital ----------------
async function findNearestHospital(lat, lon) {
  const hospitals = await Hospital.find({});
  if (!hospitals.length) return null;

  let nearest = hospitals[0];
  let minDist = calculateDistance(
    lat,
    lon,
    hospitals[0].location.coordinates[1],
    hospitals[0].location.coordinates[0]
  );

  for (const hosp of hospitals) {
    const dist = calculateDistance(
      lat,
      lon,
      hosp.location.coordinates[1],
      hosp.location.coordinates[0]
    );
    if (dist < minDist) {
      minDist = dist;
      nearest = hosp;
    }
  }

  return { hospital: nearest, distanceKm: minDist };
};

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

export async function createVillage(data) {
  const parsed = villageSchema.parse(data);

  const [lon, lat] = parsed.location.coordinates;
  const nearest = await findNearestHospital(lat, lon);

  const villageData = {
    ...parsed,
    nearestHospitalId: nearest ? nearest.hospital.hospitalId : null,
    nearestHospitalDistance: nearest ? nearest.distanceKm : null
  };

  const newVillage = new Village(villageData);
  return await newVillage.save();
};

// export const updateVillage = async (villageId, data) => {
//   return await Village.findOneAndUpdate({villageId: villageId}, data, { new: true });
// };

// ---------------- UPDATE ----------------
export async function updateVillage(id, data) {
  const parsed = villageSchema.partial().parse(data);
  const existing = await Village.findById(id);
  if (!existing) throw new Error("Village not found");

  Object.assign(existing, parsed);

  if (parsed.location && parsed.location.coordinates) {
    const [lon, lat] = parsed.location.coordinates;
    const nearest = await findNearestHospital(lat, lon);
    existing.nearestHospitalId = nearest ? nearest.hospital.hospitalId : null;
    existing.nearestHospitalDistance = nearest ? nearest.distanceKm : null;
  }
  return await existing.save();
};

export const deleteVillage = async (villageId) => {
  return await Village.findOneAndDelete({villageId: villageId});
};

export async function assignNearestHospitalsToVillages() {
  const hospitals = await Hospital.find({});
  const villages = await Village.find({});
  if (!hospitals.length) throw new Error("No hospitals found in the database.");

  const updates = [];

  for (const village of villages) {
    const [lon, lat] = village.location.coordinates;
    const nearest = await findNearestHospital(lat, lon);
    if (nearest) {
      village.nearestHospitalId = nearest.hospital.hospitalId;
      village.nearestHospitalDistance = nearest.distanceKm;
      await village.save();

      updates.push({
        village: village.name,
        nearestHospital: nearest.hospital.name,
        distanceKm: nearest.distanceKm.toFixed(2)
      });
    }
  }

  return { updatedCount: updates.length, updates };
};

