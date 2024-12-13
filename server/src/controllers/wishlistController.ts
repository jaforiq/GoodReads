import Wishlist from "../models/Wishlist";
import { Request, RequestHandler, Response } from "express";

export const createWishlist: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user?.id; // authenticated user
    const { id } = req.params;
    const bookId = parseInt(id, 10); // string to int

    const createWishlist = await Wishlist.create({
      userId,
      bookId,
    });

    if (!createWishlist)
      res.status(500).json({ message: "Failed to create Wishlist" });
    //console.log("GenId: ", genreId);

    res
      .status(201)
      .json({ message: "New Wishlist created successfully", createWishlist });
    return;
  } catch (error) {
    res.status(500).json({ message: "Failed to create Wishlist", error });
    return;
  }
};

export const deleteWishlist: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const userId = (req as any).user?.id;
  const bookId = parseInt(id, 10);

  try {
    const userWishlist = await Wishlist.findOne({ where: { bookId, userId } });

    if (!userWishlist) {
      res.status(404).json({ message: "Wishlist not found or unauthorized" });
      return;
    }

    await userWishlist.destroy();
    res.status(200).json({ message: "Wishlist deleted successfully" });
    return;
  } catch (error) {
    res.status(500).json({ message: "Failed to delete Wishlist", error });
    return;
  }
};

export const getUserWishBook: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = (req as any).user?.id;
  const { id } = req.params;
  const bookId = parseInt(id, 10);

  try {
    const userWishlist = await Wishlist.findOne({ where: { bookId, userId } });

    if (!userWishlist) {
      res.status(404).json({ message: "Wishlist not found or unauthorized" });
      return;
    }

    res.status(200).json({ userWishlist });
    return;
  } catch (error) {
    res.status(500).json({ message: "Error retrieving wishlist", error });
    return;
  }
};
