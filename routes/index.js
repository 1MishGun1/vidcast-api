const mainRouter = require("express").Router();

const userRouter = require("./user");
const videoRouter = require("./video");
const playlistRouter = require("./playlist");
const uploadRouter = require("./upload");
const reactionRouter = require("./reaction");
const commentRouter = require("./comment");
const searchRouter = require("./search");
const adminRouter = require("./admin");
const historyRouter = require("./history");

mainRouter.use(userRouter, videoRouter, playlistRouter, uploadRouter);
mainRouter.use("/reactions", reactionRouter);
mainRouter.use("/comments", commentRouter);
mainRouter.use("/search", searchRouter);
mainRouter.use("/admin", adminRouter);
mainRouter.use("/history", historyRouter);

module.exports = mainRouter;
