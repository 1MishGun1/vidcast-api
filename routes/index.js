const mainRouter = require("express").Router();

const userRouter = require("./user");

mainRouter.use(userRouter);

module.exports = mainRouter;
