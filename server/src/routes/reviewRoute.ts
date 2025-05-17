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
router.get("/:id/reviews", getAllReviewOfBook);

// Protected routes for authenticated users
router.get("/userreview/:id", authenticateToken, getReviewOfBook);
router.delete("/", authenticateToken, deleteReview);
router.post("/:id/reviews", authenticateToken, createUpdateReview);
//router.put("/:id", authenticateToken, updateReview);

export default router;
