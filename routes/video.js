const videoRouter = require("express").Router();
const {
  createVideo,
  getAllVideos,
  getOneVideo,
  updateVideo,
} = require("../controllers/VideoController");
const checkMe = require("../middlewares/checkMe");

//! Create a new video
videoRouter.post("/videos", checkMe, createVideo);

//! Get all videos
videoRouter.get("/videos", getAllVideos);

//! Get all videos
videoRouter.get("/videos/:id", getOneVideo);

//! Update video data
videoRouter.patch("/videos/:id", checkMe, updateVideo);

module.exports = videoRouter;
