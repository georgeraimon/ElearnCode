
import mongoose from "mongoose";


const Track = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    cloudinaryId: {
      type: String,
      required: true,
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CourseData",
      },
    ],
  }, { collection: "track-data" }
);

const model = mongoose.model("TrackData", Track);
export default model;
//module.exports = model;
