const playlistRouter = require("express").Router();
const {
  createPlaylist,
  getAllPlaylists,
  getOnePlaylist,
  pushVideoInPlaylist,
  deleteVideoInPlaylist,
  deletePlaylist,
} = require("../controllers/PlaylistController");
const checkMe = require("../middlewares/checkMe");

//! Create a new playlist
playlistRouter.post("/playlist", checkMe, createPlaylist);

//! Get all playlists
playlistRouter.get("/playlist", getAllPlaylists);

//! Get one playlist
playlistRouter.get("/playlist/:id", checkMe, getOnePlaylist);

//! Push video in playlist
playlistRouter.patch("/playlist/:id/add-video", checkMe, pushVideoInPlaylist);

//! Delete video in playlist
playlistRouter.patch(
  "/playlist/:id/delete-video",
  checkMe,
  deleteVideoInPlaylist
);

//! Delete playlist
playlistRouter.delete("/playlist/:id", checkMe, deletePlaylist);

module.exports = playlistRouter;
