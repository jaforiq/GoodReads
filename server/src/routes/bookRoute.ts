import { Router } from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import {
  createBook,
  deleteBook,
  getAllBooks,
  updateBook,
} from "../controllers/bookController";

const router = Router();

// Public route
router.get("/", getAllBooks);

// Protected routes for authenticated users
router.post("/", authenticateToken, createBook);
router.put("/:id", authenticateToken, updateBook);
router.delete("/:id", authenticateToken, deleteBook);

export default router;
