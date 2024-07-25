const User = require("../models/user.js");
const Course = require("../models/course.js");
const Progress = require("../models/progress.js");

module.exports.tutorSignup = async (req, res) => {
  try {
    let user = { ...req.body };
    user.role = 1;
    let newUser = new User(user);

    let registeredUser = await User.register(newUser, user.password);

    console.log(`Registered User :- ${registeredUser}`);

    res.status(200).json({
      message: "Tutor Signup Success",
      success: true,
      _id: registeredUser._id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error", success: false, error: error });
  }
};
module.exports.learnerSignup = async (req, res) => {
  try {
    let user = { ...req.body };
    user.role = 0;
    let newUser = new User(user);

    let registeredUser = await User.register(newUser, user.password);

    console.log(`Registered User :- ${registeredUser}`);

    res.status(200).json({
      message: "Learner Signup Success",
      success: true,
      _id: registeredUser._id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error", success: false, error: error });
  }
};

module.exports.tutorLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("Tutor login request", username);

    // Find the user first to ensure they have the correct role
    let tutor = await User.findOne({ username: username, role: 1 });
    if (!tutor) {
      return res.status(403).json({
        message: "No Tutor found with given credentials",
        success: false,
      });
    }

    // Use the authenticate method provided by passport-local-mongoose
    User.authenticate()(username, password, (err, user, options) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Error", success: false, error: err });
      if (!user)
        return res
          .status(403)
          .json({ message: options.message, success: false });

      res.status(200).json({
        message: "Tutor Login Success",
        success: true,
        _id: user._id,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error", success: false, error: error });
  }
};

module.exports.learnerLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user first to ensure they have the correct role
    let learner = await User.findOne({ username: username, role: 0 });
    if (!learner) {
      return res.status(403).json({
        message: "No Learner found with given credentials",
        success: false,
      });
    }

    // Use the authenticate method provided by passport-local-mongoose
    User.authenticate()(username, password, (err, user, options) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Error", success: false, error: err });
      if (!user)
        return res
          .status(403)
          .json({ message: options.message, success: false });

      res.status(200).json({
        message: "Learner Login Success",
        _id: learner._id,
        success: true,
        user: learner,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error", success: false, error: error });
  }
};

module.exports.getInfo = async (req, res) => {
  try {
    let { id } = req.params;
    let user = await User.findById(id);
    if (!user) return res.status(400).json({ message: "User does not exist." });

    // Populate courses
    if (user.courses) {
      user = await user.populate({
        path: "courses",
        model: "Course",
        populate: {
          path: "tutor",
          model: "User",
          select: "name username", // Adjust to select fields you need
        },
      });
    }

    // Populate progress with nested contentProgress.contentId
    if (user.progress) {
      user = await user.populate({
        path: "progress",
        model: "Progress",
        populate: {
          path: "contentProgress.contentId",
          model: "Course",
          select: "content.heading",
        },
      });
    }

    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error", success: false, error: error });
  }
};

module.exports.getInfoByUsername = async (req, res) => {
  try {
    let { username } = req.params;

    let user = await User.findByUsername(username);

    if (!user) {
      res.status(404).json({
        message: "No user found with given username!",
        success: false,
      });
    } else {
      res.status(200).json({
        message: "User Details Returned",
        success: true,
        role: user.role,
        user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error", success: false, error });
  }
};

module.exports.reset = async (req, res) => {
  try {
    const { username, answer, password } = req.body;

    const user = await User.findByUsername(username);

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    if (user.answer !== answer) {
      return res
        .status(403)
        .json({ message: "Security answer is incorrect", success: false });
    }

    await user.setPassword(password);
    await user.save();

    res.status(200).json({
      message: "Password Changed Successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error", success: false, error });
  }
};
