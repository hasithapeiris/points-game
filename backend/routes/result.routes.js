import express from "express";
import { createResult } from "../controllers/result.controller.js";
// import { isAdmin, protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/check-result", createResult);

export default router;
