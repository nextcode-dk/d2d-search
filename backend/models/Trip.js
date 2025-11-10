import mongoose from "mongoose";

const routeSchema = new mongoose.Schema({
  startCountry: String,
  endCountry: String,
  dayOfWeek: {
    type: String,
    enum: [
      "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday", "Varies", "Weekly"
    ],
    required: true
  }
}, { _id: false });

const contactSchema = new mongoose.Schema({
  phones: [String],
  email: String,
  website: String
}, { _id: false });

const tripSchema = new mongoose.Schema({
  company: { type: String, required: true },
  profileImage: String,
  contact: contactSchema,
  routes: [routeSchema],
  description: String
}, { timestamps: true });

export default mongoose.model("Trip", tripSchema);
