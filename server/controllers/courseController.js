const Course = require("../models/course.js");
const User = require("../models/user.js");

module.exports.addCourse = async (req, res) => {
  try {
    let newCourse = new Course(req.body);
    
    let tutor = await User.findById(newCourse.tutor);
    newCourse.tutor = tutor._id;
    tutor.courses.push(newCourse);

    console.log("Updated Tutor :- ", tutor);
    console.log("New Course :- ", newCourse);

    await newCourse.save();
    await tutor.save();

    return res.status(200).json({
      message: "Course Successfully Added",
      success: true,
      _id: newCourse._id,
      tutor: tutor,
      course: newCourse,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error: error });
  }
};

module.exports.updateCourse = async (req, res) => {
  try {
    let { id } = req.params;
    let course = req.body;
    let updatedCourse = await Course.findByIdAndUpdate(id, { ...course });
    let tutor = await User.findById(updatedCourse.tutor);
    updatedCourse.tutor = tutor._id;

    await updatedCourse.save();
    await tutor.save();

    console.log("Tutor :- ", tutor);
    console.log("Updated Course :- ", updatedCourse);

    return res.status(200).json({
      message: "Course Successfully Updated",
      success: true,
      _id: updatedCourse._id,
      tutor: tutor,
      course: updatedCourse,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error: error });
  }
};

module.exports.getCourses = async (req, res) => {
  try {
    let courses = await Course.find({}).populate({
      path: "tutor",
      model: "User",
    });

    console.log("All courses details sent");

    return res.status(200).json({
      message: "All Courses Details returned",
      success: true,
      courses,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error: error });
  }
};

module.exports.getInfo = async (req, res) => {
  try {
    let { id } = req.params;
    
    let course = await Course.findById(id).populate({
      path: "tutor",
      model: "User",
    });

    console.log("Course Details returned");

    return res.status(200).json({
      message: "Course Details returned",
      success: true,
      course,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error: error });
  }
};

module.exports.search = async (req, res) => {
  try {
    const { search } = req.body;

    // Perform a case-insensitive search for courses based on the search query
    const courses = await Course.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { "tutor.name": { $regex: search, $options: "i" } },
        { "content.heading": { $regex: search, $options: "i" } },
      ],
    }).populate({
      path: "tutor",
      model: "User",
    });

    console.log("Course Search Results :- ", courses);

    return res.status(200).json({
      message: "Search Results returned",
      success: true,
      courses, // Send the courses in the response
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error });
  }
};
