const checkAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Доступ только для администраторов" });
  }
  next();
};

module.exports = checkAdmin;
