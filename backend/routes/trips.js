import express from "express";
import Trip from "../models/Trip.js";

const router = express.Router();

// Create trip
router.post("/", async (req,res) => {
  try {
    const trip = new Trip(req.body);
    await trip.save();
    res.status(201).json(trip);
  } catch(err) {
    res.status(400).json({error: err.message});
  }
});
router.post("/batch", async (req,res) => {
  try {
    const trips = await Promise.all(
      req.body.map(tripData => {
        const trip = new Trip(tripData);
        return trip.save();
      })
    );
    res.status(201).json(trips);
  } catch(err) {
    res.status(400).json({error: err.message});
  }
});

// List trips
router.get("/", async (req,res) => {
  const trips = await Trip.find();
  res.json(trips);
});

export default router;
