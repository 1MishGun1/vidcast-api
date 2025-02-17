const jwt = require("jsonwebtoken");

const checkMe = (req, res, next) => {
  const tokenUser = (req.headers.authorization || "").replace(/Bearer\s?/, "");

  if (tokenUser) {
    try {
      const decodeToken = jwt.verify(tokenUser, "secret-key-password-123-dasd");
      req.userId = decodeToken._id;
      next();
    } catch (error) {
      return res.status(403).json({
        message: "Нет прав доступа",
      });
    }
  } else {
    return res.status(403).json({
      message: "Нет прав доступа",
    });
  }
};

module.exports = checkMe;
