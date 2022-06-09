const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  if (req.method === "OPTIONS") {
    next();
  }

  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const secretKey = process.env.SECRET_KEY;
    const decodedData = jwt.verify(token, secretKey);
    req.user = decodedData;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Unauthorized" });
  }
};
