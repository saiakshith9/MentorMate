const express = require("express");
const router = express.Router();

const courseController = require("../controllers/courseController.js");
const wrapAsync = require("../utility/wrapAsync.js");
const middleware = require("../middlewares/middleware.js");

router.post("/add", wrapAsync(courseController.addCourse));

router.post("/update/:id", wrapAsync(courseController.updateCourse));

router.route("/all").get(wrapAsync(courseController.getCourses));

router.route("/:id").get(wrapAsync(courseController.getInfo));

router.route("/search").post(wrapAsync(courseController.search));

module.exports = router;
