import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import tripsRouter from "./routes/trips.js";
import { syncTripsToAlgolia } from "./syncToAlgolia.js";

dotenv.config();
const app = express();
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/carrier_search";
mongoose.connect(MONGODB_URI, { })
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

app.use("/api/trips", tripsRouter);

// Simple health
app.get("/health", (req,res) => res.json({ok:true}));

// Sync once on start and then every 60s
syncTripsToAlgolia().catch(err=>console.error(err));
setInterval(() => syncTripsToAlgolia().catch(err=>console.error(err)), 60_000);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`🚚 Server running on http://localhost:${port}`));
