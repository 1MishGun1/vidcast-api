const userRouter = require("express").Router();
const { register, login } = require("../controllers/UserController");

userRouter.post("/register", register);
userRouter.post("/login", login);

module.exports = userRouter;
