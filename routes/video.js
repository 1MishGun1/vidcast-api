const videoRouter = require("express").Router();
const createVideo = require("../controllers/VideoController");
const checkMe = require("../middlewares/checkMe");

videoRouter.post("/videos", checkMe, createVideo);

module.exports = videoRouter;
