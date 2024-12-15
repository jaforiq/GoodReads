import express from "express";
import {
  getGenres,
  createGenre,
  getGenreOfBook,
} from "../controllers/genreController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", getGenres);
router.get("/:id", getGenreOfBook);

// Protected route
router.post("/", authenticateToken, createGenre);

export default router;
