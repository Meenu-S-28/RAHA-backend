import CampRecommendation from "../models/campRecommendation.models.js";
import Village from "../models/villages.models.js";
import Hospital from "../models/hospitals.models.js";

export const generateCampRecommendations = async () => {
  const villages = await Village.find();
  const recommendations = [];

  for (const village of villages) {
     const hospital = await Hospital.findOne({hospitalId: village.nearestHospitalId});
     const distanceKm = village.nearestHospitalDistance??0;
     const accessScore = village.accessScore??0;

    let needsCamp = false;
    let reason = "";
    let severityScore = 0;
    const servicesRecommended = [];

    
    // --- Apply rules ---
    if (distanceKm > 20) {
      needsCamp = true;
      reason = `No hospital within 20 km (nearest: ${distanceKm.toFixed(1)} km)`;
      severityScore = 1;
      servicesRecommended.push("General OPD");
    } else if (
      village.population > 3000 &&
      (hospital.doctors < 50 || hospital.beds < 50)
    ) {
      needsCamp = true;
      reason = `High population (${village.population}) but low hospital capacity (doctors: ${hospital.doctors}, beds: ${hospital.beds})`;
      severityScore = 0.8;
      servicesRecommended.push("Maternal Care", "Emergency");
    } else if (accessScore < 0.3) {
      needsCamp = true;
      reason = `Low access score (${accessScore.toFixed(2)})`;
      severityScore = 0.6;
      servicesRecommended.push("OPD");
    }

    if (needsCamp) {
      recommendations.push({
        targetVillageId: village._id,
        nearestHospitalId: hospital._id,
        reason,
        severityScore,
        servicesRecommended
      });
    }
  }

// --- Sort by severity (descending) ---
  recommendations.sort((a, b) => b.severityScore - a.severityScore);

  // --- Compute summary stats ---
  const summary = {
    total: recommendations.length,
    avgSeverity:
      recommendations.length > 0
        ? recommendations.reduce((sum, r) => sum + r.severityScore, 0) /
          recommendations.length
        : 0,
    reasonsCount: recommendations.reduce((acc, r) => {
      const key =
        r.reason.includes("No hospital within") ? "Distance > 20km" :
        r.reason.includes("High population") ? "High pop / low capacity" :
        "Low access score";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {}),
  };


  // Clear old recommendations and insert new ones
  await CampRecommendation.deleteMany({});
  await CampRecommendation.insertMany(recommendations);

   // ---log to console for analytics visibility ---
  console.log("✅ Camp recommendations generated:");
  console.log(`Total: ${summary.total}`);
  console.log(`Average Severity: ${summary.avgSeverity.toFixed(2)}`);
  console.table(summary.reasonsCount);

  return {summary, recommendations};
};