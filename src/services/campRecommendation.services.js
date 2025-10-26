import CampRecommendation from "../models/campRecommendation.models.js";
import Village from "../models/villages.models.js";
import Hospital from "../models/hospitals.models.js";

export const generateCampRecommendations = async () => {
  const villages = await Village.find();
  const recommendations = [];

  for (const village of villages) {
    // Fetch top 3 hospitals based on stored IDs
    const hospitalIds = village.nearestHospitals || [];
    const hospitals = await Hospital.find({ hospitalId: { $in: hospitalIds } });

    // Extract data
    const distances = village.nearestHospitalsDistance || [];
    const avgDistance =
      distances.length > 0
        ? distances.reduce((a, b) => a + b, 0) / distances.length
        : 0;

    const accessScore = village.accessScore ?? 0;
    const avgDoctors =
      hospitals.length > 0
        ? hospitals.reduce((sum, h) => sum + (h.doctors || 0), 0) / hospitals.length
        : 0;
    const avgBeds =
      hospitals.length > 0
        ? hospitals.reduce((sum, h) => sum + (h.beds || 0), 0) / hospitals.length
        : 0;

    let needsCamp = false;
    const reasons = [];
    let severityScore = 0;
    const servicesRecommended = [];

    // --- Rule 1: Far distance ---
    if (avgDistance > 20) {
      needsCamp = true;
      reasons.push(`No hospital within 20 km (avg: ${avgDistance.toFixed(1)} km)`);
      severityScore = Math.max(severityScore, 1);
      servicesRecommended.push("General OPD");
    }

    // --- Rule 2: High population but low capacity ---
    if (village.population > 3000 && (avgDoctors < 50 || avgBeds < 50)) {
      needsCamp = true;
      reasons.push(
        `High population (${village.population}) but low average hospital capacity (doctors: ${avgDoctors.toFixed(
          1
        )}, beds: ${avgBeds.toFixed(1)})`
      );
      severityScore = Math.max(severityScore, 0.8);
      servicesRecommended.push("Maternal Care", "Emergency");
    }

    // --- Rule 3: Low access score ---
    if (accessScore < 0.3) {
      needsCamp = true;
      reasons.push(`Low access score (${accessScore.toFixed(2)})`);
      severityScore = Math.max(severityScore, 0.6);
      servicesRecommended.push("OPD");
    }

    if (needsCamp) {
      recommendations.push({
        targetVillageId: village._id,
        nearestHospitals: hospitals.map((h) => h._id),
        reasons,
        severityScore,
        servicesRecommended,
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
      for (const reason of r.reasons) {
        const key =
          reason.includes("20 km")
            ? "Distance > 20km"
            : reason.includes("population")
            ? "High pop / low capacity"
            : "Low access score";
        acc[key] = (acc[key] || 0) + 1;
      }
      return acc;
    }, {}),
  };

  // --- Replace old recommendations ---
  await CampRecommendation.deleteMany({});
  await CampRecommendation.insertMany(recommendations);

  // --- Log summary ---
  console.log("✅ Camp recommendations generated:");
  console.log(`Total: ${summary.total}`);
  console.log(`Average Severity: ${summary.avgSeverity.toFixed(2)}`);
  console.table(summary.reasonsCount);

  return { summary, recommendations };
};
