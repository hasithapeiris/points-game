import express from "express";
import { createIn } from "../controllers/in.controller.js";
// import { isAdmin, protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", createIn);

// router
//   .route("/:id")
//   .get(protect, viewSingleScholarship)
//   .put(protect, isAdmin, updateScholarship)
//   .delete(protect, isAdmin, deleteScholarship);

export default router;
