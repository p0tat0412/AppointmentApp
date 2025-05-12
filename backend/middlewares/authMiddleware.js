const jwt = require("jsonwebtoken");
const { ddbClient } = require("../dynamodbClient");
const { GetCommand } = require("@aws-sdk/lib-dynamodb");

const TABLE_NAME = "Users";

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userResponse = await ddbClient.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: { id: decoded.id },  // Assuming 'id' is your partition key
    }));

    const user = userResponse.Item;

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Remove password before attaching to req.user
    const { password, ...safeUser } = user;
    req.user = safeUser;

    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
