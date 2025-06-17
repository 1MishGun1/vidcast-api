const playlistRouter = require("express").Router();
const {
  createPlaylist,
  getAllPlaylists,
  getOnePlaylist,
  getPlaylistsByUser,
  pushVideoInPlaylist,
  updatePlaylist,
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

//! Get playlists by user
playlistRouter.get("/playlist/user/:userId", checkMe, getPlaylistsByUser);

//! Push video in playlist
playlistRouter.patch("/playlist/:id/add-video", checkMe, pushVideoInPlaylist);

//! Delete video in playlist
playlistRouter.patch(
  "/playlist/:id/delete-video",
  checkMe,
  deleteVideoInPlaylist
);

//! Update playlist
playlistRouter.patch("/playlist/:id", checkMe, updatePlaylist);

//! Delete playlist
playlistRouter.delete("/playlist/:id", checkMe, deletePlaylist);

module.exports = playlistRouter;
