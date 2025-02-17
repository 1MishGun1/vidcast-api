const userRouter = require("express").Router();
const { register, login, getMe } = require("../controllers/UserController");
const { registerValidation, loginValidation } = require("../validations/auth");
const checkMe = require("../middlewares/checkMe");

userRouter.post("/register", registerValidation, register);
userRouter.post("/login", loginValidation, login);
userRouter.get("/me", checkMe, getMe);

module.exports = userRouter;
