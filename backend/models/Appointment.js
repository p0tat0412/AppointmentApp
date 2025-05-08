const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // Store as string or Date depending on your use case
  time: { type: String, required: true },
  patientType: { type: String, required: true },
  fullName: { type: String, required: true }, 
  gender: { type: String, required: true },
  problem: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);