const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const DoctorAvailability = require("../models/DoctorAvailability");
const User = require("../models/User");

// POST /api/doctor/availability
router.post('/availability', async (req, res) => {
  const { userId: doctorId, availability } = req.body;

  // Transform availability object to match the schema
  const formattedAvailability = Object.entries(availability).map(([day, slots]) => ({
    day,
    slots: Object.entries(slots).map(([time, available]) => ({
      time,
      available,
    })),
  }));

  try {
    let doctorAvailability = await DoctorAvailability.findOne({ doctorId });

    if (!doctorAvailability) {
      doctorAvailability = new DoctorAvailability({ doctorId, availability: formattedAvailability });
    } else {
      doctorAvailability.availability = formattedAvailability;
    }

    await doctorAvailability.save();
    res.status(200).json({ message: 'Availability saved successfully!' });
  } catch (err) {
    console.error("Error saving availability:", err);
    res.status(500).json({ message: "Failed to save availability", error: err.message });
  }
});

router.get('/availability/:userId', async (req, res) => {
    try {
      const docAvailability = await DoctorAvailability.findOne({ doctorId: req.params.userId });
      if (!docAvailability) return res.status(404).json({ message: "No availability set" });
  
      console.log(docAvailability)
      res.json({ availability: docAvailability.availability});
    } catch (err) {
      console.error("Fetch error:", err);
      res.status(500).json({ message: "Failed to fetch availability" });
    }
});

router.get('/', async (req, res) => {
    try {
      const doctors = await User.find({ role: 'doctor' }).select('-password');
      res.json(doctors);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
module.exports = router;
