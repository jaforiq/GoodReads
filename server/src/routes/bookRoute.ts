import { Router } from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import {
  createBook,
  deleteBook,
  getAllBooks,
  getBookById,
  updateBook,
  searchBookByGenre,
  searchBookByTitle,
} from "../controllers/bookController";

const router = Router();

// Public route
router.get("/", getAllBooks);
router.get("/searchtitle", searchBookByTitle);
router.get("/searchgenre", searchBookByGenre);
router.get("/:id", getBookById);

// Protected routes for authenticated users
router.post("/", authenticateToken, createBook);
router.put("/:id", authenticateToken, updateBook);
router.delete("/:id", authenticateToken, deleteBook);

export default router;
