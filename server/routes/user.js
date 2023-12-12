
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import axios from "axios";
import User from "../models/user.model.js";
import Track from "../models/track.model.js";
import Course from "../models/course.model.js";
import UserCourse from "../models/user_course.model.js";
import { config } from 'dotenv';
config();

const router = express.Router();

const saltRounds = parseInt(process.env.VITE_SALT_ROUNDS);

 router.use(function (_req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
   res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"   );
   next();
 });

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  bcrypt.hash(password, saltRounds, async (err, hash) => {
    if (err) {
      return res.status(500).json({
        error: "Internal server error",
      });
    } else {
      try {
        const user = await User.create({
          name,
          email,
          password: hash,
        });
        const token = jwt.sign(
          {
            id: user._id,
          },
          process.env.VITE_JWT_SECRET,
          {
            expiresIn: "1h",
          }
        );
        return res.status(201).json({
          token: token,
        });
      } catch (err) {
        return res.status(409).json({
          error: "Email already exists",
        });
      }
    }
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email, });
  if (!user) {
    return res.status(401).json({ error: "User not found" });
  }
  bcrypt.compare(password, user.password, async (err, result) => {
    if (err) {
      return res.status(401).json({ error: "Password incorrect" });
    }
    if (result) {
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.VITE_JWT_SECRET,
        { expiresIn: "8h" }
      );
      return res.status(200).json({ token: token });
    }
    return res.status(401).json({ error: "Password incorrect" });
  });
});


router.post("/verifyToken", async (req, res) => {
  const { token } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.VITE_JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (user) {
      return res.status(200).json({
        user: user,
      });
    } else {
      return res.status(401).json({
        error: "User not found",
      });
    }
  } catch (err) {
    return res.status(401).json({
      error: "Invalid token",
    });
  }
});

router.post("/getUserData", async (req, res) => {
  const { token } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.VITE_JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (user) {
      const userCourses = await UserCourse.find({
        user: user._id,
      });
      const courses = await Course.find({
        _id: {
          $in: userCourses.map((userCourse) => userCourse.course),
        },
      });
      return res.status(200).json({
        courses: courses,
        userCourses: userCourses,
      });
    } else {
      return res.status(401).json({
        error: "User not found",
      });
    }
  } catch (err) {
    return res.status(401).json({
      error: "Invalid token",
    });
  }
});

router.get("/getAllTracks", async (_req, res) => {
  const tracks = await Track.find({});
  return res.status(200).json({
    tracks: tracks,
  });
});

router.post("/getTrackById", async (req, res) => {
  const { id, token } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.VITE_JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        error: "User not found",
      });
    }
    const track = await Track.findById(id);
    const courses = await Track.findById(id).populate("courses");
    const userCourses = await UserCourse.find({
      user: user._id,
    });
    const userCoursesIds = userCourses.map((course) => course.course);
    return res.status(200).json({
      track: track,
      courses: courses,
      userCoursesIds: userCoursesIds,
      userCourses: userCourses,
    });
  } catch (err) {
    return res.status(401).json({
      error: "Invalid token",
    });
  }
});

 router.post("/startCourse", async (req, res) => {
  const { courseId, token } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.VITE_JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    const userCourse = await UserCourse.findOne({ user: user._id, course: courseId });
    if (userCourse) {
      return res.status(409).json({ error: "User already enrolled in this course" });
    }
    const course = await Course.findById(courseId);
    const length = course.videos.length;
    const userCourseCreated = await UserCourse.create({
      user: user._id,
      course: courseId,
      checked: Array(length).fill(false),
      progress: 0,
      completed: false,
    });
    return res.status(200).json({ success: true, userCourse: userCourseCreated });
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
});
router.post("/getCourseById", async (req, res) => {
  const { id, token } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.VITE_JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (user) {
      const course = await Course.findById(id);
      const userCourse = await UserCourse.findOne({
        user: user._id,
        course: id,
      });
      return res.status(200).json({
        course: course,
        userCourse: userCourse,
      });
    } else {
      return res.status(401).json({
        error: "User not found",
      });
    }
  } catch (err) {
    return res.status(401).json({
      error: "Invalid token",
    });
  }
});

router.post("/handleCourseProgress", async (req, res) => {
  const { courseId, token, progress, checked } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.VITE_JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (user) {
      const userCourse = await UserCourse.findOne({
        user: user._id,
        course: courseId,
      });
      const course = await Course.findById(courseId);
      if (userCourse) {
        userCourse.progress = progress;
        userCourse.checked = checked;
        if (course.videos.length === progress) {
          userCourse.completed = true;
          userCourse.date_completed = new Date();
        } else {
          userCourse.completed = false;
          userCourse.date_completed = null;
        }
        userCourse.save();
        return res.status(200).json({
          success: true,
          userCourse: userCourse,
        });
      }
    } else {
      return res.status(401).json({
        error: "User not found",
      });
    }
  } catch (err) {
    return res.status(401).json({
      error: "Invalid token",
    });
  }
});

{/*router.get("/contests", async (_req, res) => {
  axios 
    .get(`https://clist.by/api/v4/contest/?username=${process.env.VITE_CLIST_USERNAME}&api_key=${process.env.VITE_CLIST_APIKEY}&format=json`)
    .then((response) => {
      const contests = response.data;
      return res.status(200).json({
        contests: contests,
      });
    })
    .catch((error) => {
      console.error("Error fetching data: ", error);
      return res.status(500).json({ error: "An error occurred while fetching data" });
    });
});*/}

router.get("/contests", async (_req, res) => {
  axios 
    .get(`https://clist.by/api/v4/contest/?username=${process.env.VITE_CLIST_USERNAME}&api_key=${process.env.VITE_CLIST_APIKEY}&format=json`)
    .then((response) => {
      const contests = response.data.objects; // Adjusted this line
      return res.status(200).json({
        contests: contests,
      });
    })
    .catch((error) => {
      console.error("Error fetching data: ", error);
      return res.status(500).json({ error: "An error occurred while fetching data" });
    });
});




router.post("/compile", async (req, res) => {
  const { code, language, input } = req.body;
  console.log(code, language, input);
  const compileUrl = "https://judge0-ce.p.rapidapi.com/submissions";
  try {
    const response = await axios.request({
      method: "POST",
      url: compileUrl,
      params: { base64_encoded: "false", fields: "*" },
      headers: {
        "Content-Type": "application/json",
        "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
        "x-rapidapi-key": process.env.VITE_RAPIDAPI_KEY,
      },
      data: {
        language_id: language,
        source_code: code,
        stdin: input,
      },
    });

    console.log(response.data);

    let result = await axios.request({
      method: "GET",
      url: `${compileUrl}/${response.data.token}`,
      params: { base64_encoded: "false", fields: "*" },
      headers: {
        "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
        "x-rapidapi-key": process.env.VITE_RAPIDAPI_KEY,
      },
    });

    while (result.data.status.description === 'Processing') {
      result = await axios.request({
        method: "GET",
        url: `${compileUrl}/${response.data.token}`,
        params: { base64_encoded: "false", fields: "*" },
        headers: {
          "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
          "x-rapidapi-key": process.env.VITE_RAPIDAPI_KEY,
        },
      });
    }

    console.log(result.data);
    return res.status(200).json({
      output: result.data,
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
});




//const userRoute = router;
export default router;
//module.exports = router;
