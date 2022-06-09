const jwt = require("jsonwebtoken");

module.exports = function (roles) {
  return function (req, res, next) {
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
      let hasRole = false
      decodedData.roles.forEach((role) => {
        if(roles.includes(role)) {
            hasRole = true
        }
      })
      if(!hasRole) {
        return res.status(403).json({ message: "You have not access for this" });
      }
      next();
    } catch (error) {
      return res.status(403).json({ message: "Unauthorized" });
    }
  };
};
