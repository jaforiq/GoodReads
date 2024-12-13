import { Router } from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import {
  createWishlist,
  deleteWishlist,
  getUserWishBook,
} from "../controllers/wishlistController";

const router = Router();

// Protected routes for authenticated users
router.get("/:id", getUserWishBook);
router.delete("/:id", authenticateToken, deleteWishlist);
router.post("/:id", authenticateToken, createWishlist);

export default router;
