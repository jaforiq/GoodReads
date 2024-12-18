import { Op } from "sequelize";
import sequelize, { Book, BookGenre } from "../models";
import { Request, RequestHandler, Response } from "express";
import { fetchGenresByName } from "./genreController";
import { QueryTypes } from "sequelize";

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
    res.status(500).json({ message: "Error retrieving all books", error });
    return;
  }
};

export const getBookById: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  //console.log("getById");
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

export const searchBookByTitle: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const title = req.query.title as string | undefined;

  try {
    const books = await Book.findAll({
      where: title
        ? { title: { [Op.iLike]: `%${title}%` } } // Search by title
        : {}, // Fetch all books if no title is provided
    });

    if (books.length === 0) {
      res.status(404).json({ message: "No books found." });
      return;
    }

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books.", error });
  }
};

export const searchBookByGenre: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const name = req.query.name as string | undefined;

  try {
    const genre = await fetchGenresByName(name);

    if (!genre.length) {
      res.status(404).json({ message: "No genre found." });
      return;
    }
    const genreIds = genre.map((gen) => gen.id);

    const books = await sequelize.query(
      `
      SELECT books.*
      FROM books
      INNER JOIN book_genres ON books.id = book_genres."bookId"
      INNER JOIN genres ON genres.id = book_genres."genreId"
      WHERE genres.id IN (:genreIds);
      `,
      {
        replacements: { genreIds }, // Pass genre IDs as parameters
        type: QueryTypes.SELECT, // Define query type
      }
    );

    if (!books.length) {
      res.status(404).json({ message: "No books found for the given genre." });
      return;
    }

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books.", error });
  }
};
