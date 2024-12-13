import { Review } from "../models";
import { Request, RequestHandler, Response } from "express";

export const createReview: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { rating, review } = req.body;
    const userId = (req as any).user?.id; // authenticated user
    const { id } = req.params;
    const bookId = parseInt(id, 10); // string to int

    const createReview = await Review.create({
      rating,
      review,
      userId,
      bookId,
    });

    if (!createReview)
      res.status(500).json({ message: "Failed to create review" });
    //console.log("GenId: ", genreId);

    res
      .status(201)
      .json({ message: "New Review created successfully", createReview });
    return;
  } catch (error) {
    res.status(500).json({ message: "Failed to create review", error });
    return;
  }
};

export const updateReview: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { rating, review } = req.body;

  const { id } = req.params;
  const bookId = parseInt(id, 10);
  const userId = (req as any).user?.id;

  try {
    const userReview = await Review.findOne({ where: { bookId, userId } });

    if (!userReview) {
      res.status(404).json({ message: "Review not found or unauthorized" });
      return;
    }

    await userReview.update({
      rating,
      review,
    });
    res
      .status(200)
      .json({ message: "Review updated successfully", userReview });
    return;
  } catch (error) {
    res.status(500).json({ message: "Failed to update Review", error });
    return;
  }
};

export const deleteReview: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const bookId = parseInt(id, 10);
  const userId = (req as any).user?.id;

  try {
    const userReview = await Review.findOne({ where: { bookId, userId } });

    if (!userReview) {
      res.status(404).json({ message: "Review not found or unauthorized" });
      return;
    }

    await userReview.destroy();
    res.status(200).json({ message: "Review deleted successfully" });
    return;
  } catch (error) {
    res.status(500).json({ message: "Failed to delete Review", error });
    return;
  }
};

export const getAllReviewOfBook: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const bookId = parseInt(id, 10);

    const userReview = await Review.findAll({ where: { bookId } });
    res.status(200).json({ userReview });
    return;
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books", error });
    return;
  }
};
