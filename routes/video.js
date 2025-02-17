const videoRouter = require("express").Router();
const {
  createVideo,
  getAllVideos,
  getOneVideo,
  updateVideo,
  deleteVideo,
} = require("../controllers/VideoController");
const videoValidation = require("../validations/video");
const checkMe = require("../middlewares/checkMe");

//! Create a new video
videoRouter.post("/videos", checkMe, videoValidation, createVideo);

//! Get all videos
videoRouter.get("/videos", getAllVideos);

//! Get all videos
videoRouter.get("/videos/:id", getOneVideo);

//! Update video data
videoRouter.patch("/videos/:id", checkMe, videoValidation, updateVideo);

//! Delete video
videoRouter.delete("/videos/:id", checkMe, deleteVideo);

module.exports = videoRouter;
