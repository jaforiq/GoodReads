import { Router } from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import {
  createReview,
  deleteReview,
  getAllReviewOfBook,
  updateReview,
} from "../controllers/reviewController";

const router = Router();

// Public route
router.get("/:id", getAllReviewOfBook);

// Protected routes for authenticated users
router.delete("/:id", authenticateToken, deleteReview);
router.post("/:id", authenticateToken, createReview);
router.put("/:id", authenticateToken, updateReview);

export default router;
