import express from "express";
import { createResult, getTimer } from "../controllers/result.controller.js";
// import { isAdmin, protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/check-result", createResult);
router.get("/timer", getTimer);

export default router;
