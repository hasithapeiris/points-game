import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Extract cookie data from HTTP requests
app.use(cookieParser());

app.listen(PORT, () => {
  console.log(`Server is started at port ${PORT}`);
});
