//to define the business logic
import Village from "../models/villages.models.js";

export const getAllVillages = async () => {
  return await Village.find();
};

// export const getVillageById = async (id) => {
//   return await Village.findById(id);
// };
export const getVillageByVillageId = async (villageId) => {
  return await Village.findOne({villageId: villageId});
};

export const createVillage = async (data) => {
  const village = new Village(data);
  return await village.save();
};

export const updateVillage = async (villageId, data) => {
  return await Village.findOneAndUpdate({villageId: villageId}, data, { new: true });
};

export const deleteVillage = async (villageId) => {
  return await Village.findOneAndDelete({villageId: villageId});
};
