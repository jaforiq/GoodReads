import { Router } from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import {
  createUpdateReview,
  deleteReview,
  getAllReviewOfBook,
  getReviewOfBook,
} from "../controllers/reviewController";

const router = Router();

// Public route
router.get("/:id", getAllReviewOfBook);

// Protected routes for authenticated users
router.get("/userreview/:id", authenticateToken, getReviewOfBook);
router.delete("/:id", authenticateToken, deleteReview);
router.post("/:id", authenticateToken, createUpdateReview);
//router.put("/:id", authenticateToken, updateReview);

export default router;
