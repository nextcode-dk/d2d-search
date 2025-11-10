import mongoose from "mongoose";
import dotenv from "dotenv";
import Trip from "./models/Trip.js";

dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/carrier_search";

const sample = [
  {
    company: "EuroTrans Logistics",
    profileImage: "https://picsum.photos/seed/eurotrans/200",
    contact: {
      phones: ["+49 171 555 333", "+49 89 123 4567"],
      email: "info@eurotrans.eu",
      website: "https://www.eurotrans.eu"
    },
    routes: [
      { startCountry: "Germany", endCountry: "France", dayOfWeek: "Monday" },
      { startCountry: "France", endCountry: "Spain", dayOfWeek: "Wednesday" }
    ]
  },
  {
    company: "Nordic Haul",
    profileImage: "https://picsum.photos/seed/nordichaul/200",
    contact: {
      phones: ["+45 12 34 56 78"],
      email: "contact@nordichaul.dk",
      website: "https://www.nordichaul.dk"
    },
    routes: [
      { startCountry: "Denmark", endCountry: "Germany", dayOfWeek: "Tuesday" },
      { startCountry: "Denmark", endCountry: "Sweden", dayOfWeek: "Friday" }
    ]
  }
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  await Trip.deleteMany({});
  await Trip.insertMany(sample);
  console.log("Seeded sample trips");
  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
