const userRouter = require("express").Router();
const {
  register,
  login,
  getMe,
  getAllUsers,
  getOneUser,
  updateUser,
  toggleSubscription,
  checkSubscription,
  getSubscribersCount,
} = require("../controllers/UserController");
const { registerValidation, loginValidation } = require("../validations/auth");
const checkMe = require("../middlewares/checkMe");

userRouter.post("/register", registerValidation, register);
userRouter.post("/login", loginValidation, login);
userRouter.get("/me", checkMe, getMe);
userRouter.get("/users", getAllUsers);
userRouter.get("/users/:id", getOneUser);
userRouter.patch("/me", checkMe, updateUser);
userRouter.post("/subscribe/:id", checkMe, toggleSubscription);
userRouter.get("/is-subscribed/:id", checkMe, checkSubscription);
userRouter.get("/subscribers-count/:id", getSubscribersCount);

module.exports = userRouter;
