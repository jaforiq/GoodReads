import { Review } from "../models";
import { Request, RequestHandler, Response } from "express";

export const createUpdateReview: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { rating, review } = req.body;
  const userId = (req as any).user?.id; // authenticated user
  const { id } = req.params;
  const bookId = parseInt(id, 10); // string to int

  //console.log("back: ", rating, "rev: ", review);

  try {
    let newReview = await Review.findOne({ where: { bookId, userId } });
    if (!newReview) {
      //console.log("In: ", userId, bookId);
      // const createReview = await Review.create({
      //   rating,
      //   review,
      //   userId,
      //   bookId,
      // });
      //console.log("In2: ", userId, bookId, createReview);

      // if (!createReview)
      //   res.status(500).json({ message: "Failed to create review" });
      //console.log("GenId: ", genreId);
      //newReview = createReview;
      res.status(201).json(
        await Review.create({
          rating,
          review,
          userId,
          bookId,
        })
      );
      return;
    } else {
      // await newReview.update({
      //   rating,
      //   review,
      // });
      res.status(200).json(
        await newReview.update({
          rating,
          review,
        })
      );
      return;
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to create review", error });
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

// Get All review of book
export const getAllReviewOfBook: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const bookId = parseInt(id, 10);

    // const userAllReview = await Review.findAndCountAll({
    //   where: { bookId },
    // });
    // attributes: ["rating", "review"],
    res.status(200).json(
      await Review.findAndCountAll({
        where: { bookId },
      })
    );
    return;
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books", error });
    return;
  }
};

// User's previous rating
export const getReviewOfBook: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const bookId = parseInt(id, 10);
    const userId = (req as any).user?.id;

    const userReview = await Review.findOne({ where: { bookId, userId } });
    res.status(200).json({ userReview });
    return;
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books", error });
    return;
  }
};
