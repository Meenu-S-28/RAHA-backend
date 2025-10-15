//to define the business logic
import Hospital from "../models/hospitals.models.js";

export const getAllHospitals = async () => {
  return await Hospital.find();
};

export const getHospitalById = async (id) => {
  return await Hospital.findOne({ hospitalId: id });
};

export const createHospital = async (data) => {
  const hospital = new Hospital(data);
  return await hospital.save();
};

export const updateHospital = async (id, data) => {
  return await Hospital.findOneAndUpdate({ hospitalId: id }, data, { new: true });
};

export const deleteHospital = async (id) => {
  return await Hospital.findOneAndDelete({ hospitalId: id });
};
