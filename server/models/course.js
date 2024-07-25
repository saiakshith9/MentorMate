const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ContentSchema = new Schema({
  heading: {
    type: String,
  },
  type: {
    type: String,
  },
  url: {
    type: String,
  },
});

const CourseSchema = new Schema({
  name: {
    type: String,
  },
  tutor: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  logo: {
    type: String,
  },
  content: [ContentSchema],
});

const Course = mongoose.model("Course", CourseSchema);

module.exports = Course;
