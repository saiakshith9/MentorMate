const mongoose = require("mongoose");
const Schema = mongoose.Schema;

  const ProgressSchema = new Schema({
    user: {
      type: String,
    },
    course: {
      type: String,
    },
    contentProgress: [
      {
        contentId: {
          type: Schema.Types.ObjectId,
          required: true,
        },
        completed: {
          type: Boolean,
          default: false,
        },
      },
    ],
  });

const Progress = mongoose.model("Progress", ProgressSchema);

module.exports = Progress;
