const express = require("express");
const router = express.Router();
const passport = require("passport");

const userController = require("../controllers/userController.js");
const wrapAsync = require("../utility/wrapAsync.js");
const middleware = require("../middlewares/middleware.js");
const { route } = require("./userRouter.js");
const User = require("../models/user.js");

router.post(
  "/signup/tutor",
  middleware.signupValidation,
  wrapAsync(userController.tutorSignup)
);
router.post(
  "/signup/learner",
  middleware.signupValidation,
  wrapAsync(userController.learnerSignup)
);

router.post(
  "/login/tutor",
  middleware.loginValidation,
  wrapAsync(userController.tutorLogin)
);

router.post(
  "/login/learner",
  middleware.loginValidation,
  wrapAsync(userController.learnerLogin)
);

router.route("/info/:id").get(wrapAsync(userController.getInfo));

router
  .route("/info/user/:username")
  .get(wrapAsync(userController.getInfoByUsername));

router.route("/reset").post(wrapAsync(userController.reset));

module.exports = router;
