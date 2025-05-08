const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const User = require('../models/User');

// POST /api/appointments
router.post('/', async (req, res) => {
  const { doctorId, patientId, date, time, problem } = req.body;

  if (!doctorId || !patientId || !date || !time) {
    return res.status(400).json({ error: 'All required fields must be provided.' });
  }

  try {
    // Check if doctor exists
    const doctor = await User.findOne({ _id: doctorId, role: 'doctor' });
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found.' });
    }

    // Optionally check if appointment slot is already booked
    const existing = await Appointment.findOne({ doctor: doctorId, date, time });
    if (existing) {
      return res.status(409).json({ error: 'This time slot is already booked.' });
    }

    const newAppointment = new Appointment({
      doctor: doctorId,
      patient: patientId,
      date,
      time,
      problem
    });

    await newAppointment.save();
    res.status(201).json({ message: 'Appointment booked successfully.', appointment: newAppointment });
  } catch (err) {
    console.error('Error booking appointment:', err);
    res.status(500).json({ error: 'Server error while booking appointment.' });
  }
});

module.exports = router;
