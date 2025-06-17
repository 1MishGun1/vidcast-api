const {
  blockUserTemporarily,
  blockUserPermanently,
} = require("../controllers/AdminController.js");
const checkMe = require("../middlewares/checkMe.js");
const checkAdmin = require("../middlewares/adminCheck");

const adminRouter = require("express").Router();

adminRouter.patch("/block/:userId", checkMe, checkAdmin, blockUserTemporarily);
adminRouter.patch(
  "/block-permanent/:userId",
  checkMe,
  checkAdmin,
  blockUserPermanently
);

module.exports = adminRouter;
