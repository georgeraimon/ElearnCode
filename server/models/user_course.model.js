
import mongoose from "mongoose";

const UserCourse = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    checked: [
      {
        type: Boolean,
      },
    ],

    progress: {
      type: Number,
      required: true,
      default: 0,
    },
    completed: {
      type: Boolean,
      required: true,
      default: false,
    },
    date_completed: {
      type: Date,
    },
  },
  { collection: "user-course" }
);

const model = mongoose.model("UserCourse", UserCourse);

export default model;
//module.exports = model;
