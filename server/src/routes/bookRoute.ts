import { Router } from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import {
  createBook,
  deleteBook,
  getAllBooks,
  updateBook,
  userBooks,
  getBookDetails,
  getBookById,
} from "../controllers/bookController";

const router = Router();

// Public route
router.get("/", getAllBooks);
router.get("/details/:id", getBookDetails);

// Protected routes for authenticated users
router.get("/createduser", authenticateToken, userBooks);
router.post("/", authenticateToken, createBook);
router.put("/:id", authenticateToken, updateBook);
router.delete("/:id", authenticateToken, deleteBook);

//Annoying route
router.get("/:id", getBookById);

export default router;
