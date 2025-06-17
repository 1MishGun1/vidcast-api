const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");

const checkMe = async (req, res, next) => {
  const tokenUser = (req.headers.authorization || "").replace(/Bearer\s?/, "");

  if (!tokenUser) {
    return res.status(403).json({ message: "Нет прав доступа" });
  }

  try {
    const decodeToken = jwt.verify(tokenUser, "secret-key-password-123-dasd");
    const user = await UserModel.findById(decodeToken._id).select(
      "-passwordHash"
    );

    if (!user) {
      return res.status(403).json({ message: "Пользователь не найден" });
    }

    req.user = user; // теперь доступно req.user.role
    req.userId = decodeToken._id;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Нет прав доступа" });
  }
};

module.exports = checkMe;
