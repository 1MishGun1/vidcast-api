const mainRouter = require("express").Router();

const userRouter = require("./user");
const videoRouter = require("./video");
const uploadRouter = require("./upload");

mainRouter.use(userRouter, videoRouter, uploadRouter);

module.exports = mainRouter;
