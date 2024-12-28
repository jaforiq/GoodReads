import { QueryTypes } from "sequelize";
import sequelize, { Review } from "../models";
import { Request, RequestHandler, Response } from "express";

export const createUpdateReview: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { rating, review } = req.body;
  const userId = (req as any).user?.id; // authenticated user
  const { id } = req.params;
  const bookId = parseInt(id, 10); // string to int

  console.log("back: ", rating, "rev: ", review);

  try {
    let newReview = await Review.findOne({ where: { bookId, userId } });

    if (!newReview) {
      let bookReview = await Review.create({
        rating,
        review,
        userId,
        bookId,
      });

      const user = await sequelize.query(
        `select username from users where id = :userId`,
        {
          replacements: { userId }, // Pass genre IDs as parameters
          type: QueryTypes.SELECT, // Define query type
        }
      );
      //console.log("User: ", user);
      if (user && user[0] && "username" in user[0]) {
        //console.log("User2: ", user);
        const bookReviewWithUsername = {
          ...bookReview.toJSON(), // Convert Sequelize instance to plain object
          username: (user[0] as { username: string }).username, // Explicit type assertion for safety
        };

        res.status(201).json(bookReviewWithUsername);
      } else {
        res
          .status(404)
          .json({ message: "User not found to create or update review" });
      }
    } else {
      let bookReview = await newReview.update({
        rating,
        review,
      });

      const user = await sequelize.query(
        `select username from users where id = :userId`,
        {
          replacements: { userId }, // Pass genre IDs as parameters
          type: QueryTypes.SELECT, // Define query type
        }
      );
      //console.log("Review: ", bookReview);
      //console.log("User: ", user);
      if (user && user[0] && "username" in user[0]) {
        console.log("User2: ", user);
        const bookReviewWithUsername = {
          ...bookReview.toJSON(), // Convert Sequelize instance to plain object
          username: (user[0] as { username: string }).username, // Explicit type assertion for safety
        };

        res.status(201).json(bookReviewWithUsername);
      } else {
        res
          .status(404)
          .json({ message: "User not found to create or update review" });
      }
    }
    //console.log("bookReview: ", bookReview);
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
  //const bookId = parseInt(id, 10);
  const userId = (req as any).user?.id;

  try {
    const userReview = await Review.findByPk(id);

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
    console.log("rev controller: ", id);

    const bookReview = await sequelize.query(
      `
      select users.username, reviews.* 
      from users 
      inner join reviews on (users.id = reviews."userId")
      inner join books on (books.id = reviews."bookId")
      where books.id = :bookId
      `,
      {
        replacements: { bookId }, // Pass genre IDs as parameters
        type: QueryTypes.SELECT, // Define query type
      }
    );
    //console.log("Reviewers: ", bookReview);

    //console.log("Details: ", reviewDetails);
    res.status(200).json(bookReview);
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
