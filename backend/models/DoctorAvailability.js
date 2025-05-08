const mongoose = require("mongoose");

// Define time slot schema
const timeSlotSchema = new mongoose.Schema({
  time: { type: String, required: true },
  available: { type: Boolean, required: true },
}, { _id: false });

// Define daily availability schema
const dailyAvailabilitySchema = new mongoose.Schema({
  day: { type: String, required: true },
  slots: [timeSlotSchema], // Array of time slots
}, { _id: false });

// Define doctor availability schema
const doctorAvailabilitySchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // This references the User model
    required: true,
  },
  availability: [dailyAvailabilitySchema], // Array of daily availability objects
});

module.exports = mongoose.model("DoctorAvailability", doctorAvailabilitySchema);
