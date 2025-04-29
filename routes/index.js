const mainRouter = require("express").Router();

const userRouter = require("./user");
const videoRouter = require("./video");
const playlistRouter = require("./playlist");
const uploadRouter = require("./upload");

mainRouter.use(userRouter, videoRouter, playlistRouter, uploadRouter);

module.exports = mainRouter;
