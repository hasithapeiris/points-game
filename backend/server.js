import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import inRoutes from "./routes/in.routes.js";
import outRoutes from "./routes/out.routes.js";
import resultRoutes from "./routes/result.routes.js";
dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Extract cookie data from HTTP requests
app.use(cookieParser());

app.use("/api/ins", inRoutes);
app.use("/api/outs", outRoutes);
app.use("/api", resultRoutes);

app.listen(PORT, () => {
  console.log(`Server is started at port ${PORT}`);
});
