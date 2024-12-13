import { Book, BookGenre } from "../models";
import { Request, RequestHandler, Response } from "express";

export const createBook: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, details, thumbnailUrl, AuthorName, PublisherName, genreId } =
      req.body;
    const userId = (req as any).user?.id; // authenticated user

    const newBook = await Book.create({
      title,
      details,
      thumbnailUrl,
      AuthorName,
      PublisherName,
      userId,
    });

    if (!newBook) res.status(500).json({ message: "Failed to create book" });
    //console.log("GenId: ", genreId);
    //Genre
    for (let i = 0; i < genreId.length; i++) {
      const genreid = genreId[i];
      //console.log(genreid);
      BookGenre.create({
        bookId: newBook.id,
        genreId: genreid,
      });
    }

    res.status(201).json({ message: "New Book created successfully", newBook });
    return;
  } catch (error) {
    res.status(500).json({ message: "Failed to create book", error });
    return;
  }
};

export const updateBook: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { title, details, thumbnailUrl, AuthorName, PublisherName } = req.body;

  const userId = (req as any).user?.id;
  //console.log("req: ", req);
  try {
    const book = await Book.findOne({ where: { id, userId } });

    if (!book) {
      res.status(404).json({ message: "Book not found or unauthorized" });
      return;
    }

    await book.update({
      title,
      details,
      AuthorName,
      PublisherName,
      thumbnailUrl,
    });
    res.status(200).json({ message: "Book updated successfully", book });
    return;
  } catch (error) {
    res.status(500).json({ message: "Failed to update book", error });
    return;
  }
};

export const deleteBook: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const userId = (req as any).user?.id;

  try {
    const book = await Book.findOne({ where: { id, userId } });

    if (!book) {
      res.status(404).json({ message: "Book not found or unauthorized" });
      return;
    }

    await book.destroy();
    res.status(200).json({ message: "Book deleted successfully" });
    return;
  } catch (error) {
    res.status(500).json({ message: "Failed to delete book", error });
    return;
  }
};

export const getAllBooks: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const books = await Book.findAll();
    res.status(200).json({ books });
    return;
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books", error });
    return;
  }
};

export const getBookById: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const book = await Book.findOne({ where: { id } });

    if (!book) {
      res.status(404).json({ message: "Book not found or unauthorized" });
      return;
    }

    res.status(200).json({ book });
    return;
  } catch (error) {
    res.status(500).json({ message: "Error retrieving book", error });
    return;
  }
};
