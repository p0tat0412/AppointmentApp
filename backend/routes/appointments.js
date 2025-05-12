const express = require('express');
const router = express.Router();
const { GetCommand, PutCommand, UpdateCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');
const { ddbClient } = require("../dynamodbClient");


const TABLE_NAME = 'Appointments';
const USERS_TABLE = 'Users';

// POST /api/appointments
router.post('/', async (req, res) => {
  const { doctorId, patientId, date, time, patientType, fullName, gender, problem } = req.body;

  if (!doctorId || !patientId || !date || !time) {
    return res.status(400).json({ error: 'All required fields must be provided.' });
  }

  try {
    // Check if doctor exists
    const doctorRes = await ddbClient.send(new GetCommand({
      TableName: USERS_TABLE,
      Key: { id: doctorId },
    }));

    if (!doctorRes.Item || doctorRes.Item.role !== 'doctor') {
      return res.status(404).json({ error: 'Doctor not found.' });
    }

    // Check if appointment already exists
    const existingAppointments = await ddbClient.send(new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: 'doctorId = :doc AND #d = :date AND #t = :time',
      ExpressionAttributeNames: {
        '#d': 'date',
        '#t': 'time'
      },
      ExpressionAttributeValues: {
        ':doc': doctorId,
        ':date': date,
        ':time': time
      }
    }));

    if (existingAppointments.Count > 0) {
      return res.status(409).json({ message: 'This time slot is already booked.' });
    }

    const newAppointment = {
      appointmentId: uuidv4(),
      doctorId,
      patientId,
      date,
      time,
      patientType,
      fullName,
      gender,
      problem,
    };

    await ddbClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: newAppointment
    }));

    res.status(201).json({ message: 'Appointment booked successfully.', appointment: newAppointment });
  } catch (err) {
    console.error('Error booking appointment:', err);
    res.status(500).json({ error: 'Server error while booking appointment.' });
  }
});

// GET /api/appointments/doctor/:doctorId
router.get('/doctor/:doctorId', async (req, res) => {
  try {
    const doctorId = req.params.doctorId;

    const result = await ddbClient.send(new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: 'doctorId = :doctorId',
      ExpressionAttributeValues: {
        ':doctorId': doctorId
      }
    }));

    const sortedAppointments = result.Items.sort((a, b) => {
      const aDateTime = new Date(`${a.date} ${a.time}`);
      const bDateTime = new Date(`${b.date} ${b.time}`);
      return aDateTime - bDateTime;
    });

    res.json(sortedAppointments);
  } catch (err) {
    console.error('Error fetching appointments:', err);
    res.status(500).json({ message: 'Error fetching appointments' });
  }
});

// routes/appointments.js
router.put('/:id/feedback', async (req, res) => {
  const { symptoms, diagnosis, medications, followUps } = req.body;

  try {
    await ddbClient.send(new UpdateCommand({
      TableName: 'Appointments',
      Key: { appointmentId: req.params.id },
      UpdateExpression: 'SET symptoms = :sym, diagnosis = :diag, medications = :meds, followUps = :follow',
      ExpressionAttributeValues: {
        ':sym': symptoms,
        ':diag': diagnosis,
        ':meds': medications,
        ':follow': followUps,
      },
    }));

    res.status(200).json({ message: 'Feedback saved successfully.' });
  } catch (err) {
    console.error('Feedback update failed:', err);
    res.status(500).json({ message: 'Failed to save feedback', error: err.message });
  }
});


module.exports = router;
