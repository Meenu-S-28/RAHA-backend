import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import villageRoutes from "./routes/villageRoutes.js";
import hospitalRoutes from "./routes/hospitalRoutes.js";
import campRoutes from "./routes/campRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/villages", villageRoutes);
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/camps", campRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
