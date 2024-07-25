const Course = require("../models/course.js");
const User = require("../models/user.js");
const Joi = require("joi");

module.exports.signupValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    username: Joi.string().email().required(),
    password: Joi.string().min(4).max(20).required(),
    question: Joi.string().required(),
    answer: Joi.string().required(),
  });
  console.log(req.body);
  const { error } = schema.validate(req.body);
  if (error) {
    console.log(error);
    return res
      .status(400)
      .json({ message: "Bad request", error, success: false });
  }
  next();
};

module.exports.loginValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().allow(""),
    username: Joi.string().email().required(),
    password: Joi.string().min(4).max(20).required(),
    question: Joi.string().allow(""),
    answer: Joi.string().allow(""),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    console.log(error);
    return res
      .status(400)
      .json({ message: "Bad request", error, success: false });
  }
  next();
};
