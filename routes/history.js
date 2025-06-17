const historyRouter = require("express").Router();
const checkMe = require("../middlewares/checkMe");
const {
  addAndUpdateHistory,
  getHistory,
} = require("../controllers/HistoryController");

//! Add and update history
historyRouter.post("/", checkMe, addAndUpdateHistory);

//! Get history
historyRouter.get("/", checkMe, getHistory);

module.exports = historyRouter;
