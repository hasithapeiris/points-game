import express from "express";
import {
  createResult,
  getTimer,
  getResults,
} from "../controllers/result.controller.js";
// import { isAdmin, protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/results", getResults);
router.get("/timer", getTimer);

export default router;
