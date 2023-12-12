

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRoute from "./routes/user.js";
import adminRoute from "./routes/admin.js";
import { config } from 'dotenv';
config();

const app = express();

app.use(cors());
app.use(express.json());

const dbUrl = `${process.env.VITE_MONGO_URL}`;


//mongoose.connect(dbUrl, { useNewUrlParser: true });
mongoose.connect(dbUrl, { useNewUrlParser: true })
  .then(() => console.log('Successfully connected to MongoDB'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

app.use("/api/user", userRoute);
app.use("/api/admin", adminRoute);


app.listen(process.env.PORT || 8000, () => {
  console.log("Server started on port 8000");
});