const User = require("../models/user.js");
const Course = require("../models/course.js");
const Progress = require("../models/progress.js");

exports.enrollInCourse = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    let progress = await Progress.findOne({ user: userId, course: courseId });

    if (!progress) {
      const course = await Course.findById(courseId);

      let learner = await User.findById(userId);
      learner.courses.push(course);

      // Create a new Progress document
      progress = new Progress({
        user: userId,
        course: courseId,
        contentProgress: course.content.map((contentItem) => ({
          contentId: contentItem._id,
          completed: false,
        })),
      });

      await learner.save();
      await progress.save();

      console.log(progress);

      res.status(200).json({
        message:
          "Successfully enrolled in course. Please wait until the page refreshes itself.",
        success: true,
        newProgress: progress,
      });
    } else {
      res.status(200).json({
        message:
          "User already enrolled in the given course. Please refresh the page.",
        success: false,
        newProgress: progress,
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error: error });
  }
};

exports.updateProgress = async (req, res) => {
  try {
    const { userId, courseId, contentId } = req.body;

    const progressRecord = await Progress.findOne({
      user: userId,
      course: courseId,
      "contentProgress.contentId": contentId,
    });

    if (!progressRecord) {
      return res
        .status(404)
        .json({ success: false, message: "Progress record not found" });
    }

    const content = progressRecord.contentProgress.find(
      (cp) => cp.contentId.toString() === contentId
    );

    if (content && content.completed) {
      return res.status(400).json({
        success: false,
        message: "Content is already marked as complete",
      });
    }

    let updatedProgress = await Progress.findOneAndUpdate(
      {
        user: userId,
        course: courseId,
        "contentProgress.contentId": contentId,
      },
      { $set: { "contentProgress.$.completed": true } },
      { new: true, useFindAndModify: false }
    );

    console.log(updatedProgress);

    res
      .status(200)
      .json({
        message:
          "Marked as Complete! Please be patient while the updated contents are loading...",
        success: true,
        updatedProgress,
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error: error });
  }
};

exports.getProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.params;

    const course = await Course.findById(courseId).populate({
      path: "tutor",
      model: "User",
    });

    // Find the progress document for the user and course
    const progress = await Progress.findOne({ user: userId, course: courseId });

    if (!progress) {
      return res.status(404).json({ message: "Progress not found" });
    }

    res.status(200).json({ course, progress });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error: error });
  }
};
