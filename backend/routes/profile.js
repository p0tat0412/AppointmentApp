const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middlewares/authMiddleware");
const { ddbClient } = require("../dynamodbClient");
const { UpdateCommand } = require("@aws-sdk/lib-dynamodb");


const TABLE_NAME = "Users";

// GET user profile
router.get("/profile", authMiddleware, async (req, res) => {
  res.json(req.user);
});

// PUT /api/users/profile
router.put("/profile", authMiddleware, async (req, res) => {
  const { fullName, email, mobileNumber, dateOfBirth } = req.body;

  if (!fullName || !email) {
    return res.status(400).json({ message: "Full name and email are required." });
  }

  try {
    const updateParams = {
      TableName: TABLE_NAME,
      Key: { id: req.user.id }, // assuming 'id' is the partition key
      UpdateExpression:
        "SET fullName = :fullName, email = :email, mobileNumber = :mobileNumber, dateOfBirth = :dateOfBirth",
      ExpressionAttributeValues: {
        ":fullName": fullName,
        ":email": email,
        ":mobileNumber": mobileNumber || null,
        ":dateOfBirth": dateOfBirth || null,
      },
      ReturnValues: "ALL_NEW",
    };

    const result = await ddbClient.send(new UpdateCommand(updateParams));

    res.json({
      message: "Profile updated successfully",
      user: result.Attributes,
    });
  } catch (error) {
    console.error("Profile update failed:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
