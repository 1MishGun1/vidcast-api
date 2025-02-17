const userRouter = require("express").Router();
const register = require("../controllers/UserController");

userRouter.post("/register", register);

module.exports = userRouter;
