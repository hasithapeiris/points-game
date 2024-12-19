import express from "express";
import { createOut } from "../controllers/out.controller.js";
// import { isAdmin, protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", createOut);

// router
//   .route("/:id")
//   .get(protect, viewSingleScholarship)
//   .put(protect, isAdmin, updateScholarship)
//   .delete(protect, isAdmin, deleteScholarship);

export default router;
