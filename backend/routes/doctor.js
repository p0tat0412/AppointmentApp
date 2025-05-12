const express = require("express");
const router = express.Router();
const { ddbClient } = require("../dynamodbClient");
const {
  PutCommand,
  QueryCommand,
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");

const TABLE_NAME = "Availability";

// POST /api/doctor/availability
router.post("/availability", async (req, res) => {
  const { userId: doctorId, availability } = req.body;

  if (!doctorId || !availability) {
    return res.status(400).json({ message: "Doctor ID and availability are required." });
  }

  // Format availability into an array of objects by day and time
  const formattedAvailability = Object.entries(availability).map(([day, slots]) => ({
    day,
    slots: Object.entries(slots).map(([time, available]) => ({
      time,
      available,
    })),
  }));

  try {
    // Save or overwrite doctor's availability using a fixed ID (doctorId)
    await ddbClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        doctorId,
        availability: formattedAvailability,
      },
    }));

    res.status(200).json({ message: "Availability saved successfully!" });
  } catch (err) {
    console.error("Error saving availability:", err);
    res.status(500).json({ message: "Failed to save availability", error: err.message });
  }
});

// GET /api/doctor/availability/:userId
router.get("/availability/:userId", async (req, res) => {
  const doctorId = req.params.userId;

  try {
    const result = await ddbClient.send(new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "doctorId = :doctorId",
      ExpressionAttributeValues: {
        ":doctorId": doctorId,
      },
    }));

    if (!result.Items || result.Items.length === 0) {
      return res.status(404).json({ message: "No availability set" });
    }

    res.json({ availability: result.Items[0].availability });
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ message: "Failed to fetch availability", error: err.message });
  }
});

// GET /api/doctor - Fetch all doctors
router.get("/", async (req, res) => {
  try {
    const result = await ddbClient.send(new ScanCommand({
      TableName: "Users",
      FilterExpression: "#role = :doctor",
      ExpressionAttributeNames: {
        "#role": "role",
      },
      ExpressionAttributeValues: {
        ":doctor": "doctor",
      },
    }));

    const doctors = result.Items.map(({ password, ...rest }) => rest);
    res.json(doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
