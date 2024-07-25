const express = require("express");
const router = express.Router();
const progressController = require("../controllers/progressController");

router.get("/:userId/:courseId", progressController.getProgress);

router.post("/enroll", progressController.enrollInCourse);

router.post("/update", progressController.updateProgress);

module.exports = router;
