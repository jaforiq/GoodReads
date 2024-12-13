import express from "express";
import {
  createGenre,
  getGenres,
  updateGenre,
  deleteGenre,
} from "../controllers/genreController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", getGenres);

// Protected route
router.post("/", authenticateToken, createGenre);
router.put("/:id", authenticateToken, updateGenre);
router.delete("/:id", authenticateToken, deleteGenre);

export default router;
