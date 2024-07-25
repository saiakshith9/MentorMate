const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
  name: {
    type: String,
  },
  role: {
    type: Number,
  },
  username: {
    type: String,
  },
  question: {
    type: String,
  },
  answer: {
    type: String,
  },
  courses: [
    {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  progress: [
    {
      type: Schema.Types.ObjectId,
      ref: "Progress",
    },
  ],
});

UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", UserSchema);

module.exports = User;
