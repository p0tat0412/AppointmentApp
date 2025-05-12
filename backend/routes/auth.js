const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();
const jwt = require("jsonwebtoken");
const { uuid } = require('uuidv4');
const {ddbClient} = require("../dynamodbClient");

const {
  PutCommand,
  GetCommand,
  QueryCommand
} = require("@aws-sdk/lib-dynamodb");

const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const TABLE_NAME = "Users"

// Register
router.post("/register", async (req, res) => {
  try {
    const { password, email, fullName, role, mobileNumber, dateOfBirth, specialty, licenseNumber } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const id = uuid();

    // Check if user exists
    const existing = await ddbClient.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: { id },
    }));

    if (existing.Item) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id,
      email,
      fullName,
      password: hashedPassword,
      role,
      mobileNumber,
      dateOfBirth,
      specialty,
      licenseNumber,
    };

    await ddbClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: user,
    }));

    const token = generateToken(email, role);

    res.status(201).json({
      token,
      user: {
        id,
        email,
        name: fullName,
        role,
      },
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await ddbClient.send(new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: "email-index",
      KeyConditionExpression: "email = :email",
      ExpressionAttributeValues: {
        ":email": email,
      },
    }));

    const user = result.Items?.[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user.id, user.role);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.fullName,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});

module.exports = router;