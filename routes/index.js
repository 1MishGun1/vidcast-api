const mainRouter = require("express").Router();

const userRouter = require("./user");
const videoRouter = require("./video");
const playlistRouter = require("./playlist");
const uploadRouter = require("./upload");
const reactionRouter = require("./reaction");

mainRouter.use(userRouter, videoRouter, playlistRouter, uploadRouter);
mainRouter.use("/reactions", reactionRouter);

module.exports = mainRouter;
