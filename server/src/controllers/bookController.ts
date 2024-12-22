import { Op } from "sequelize";
import sequelize, { Book, BookGenre } from "../models";
import { Request, RequestHandler, Response } from "express";
import { fetchGenresByName } from "./genreController";
import { QueryTypes } from "sequelize";
import { parse } from "path";

export const createBook: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log("createBook");
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
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;
    const { title, details, AuthorName, PublisherName, thumbnailUrl } =
      req.body;

    //console.log(typeof id);
    //console.log("updateBook--------", id, userId);

    const book = await Book.findByPk(id);
    //console.log("book=============: ", book);
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
    res.status(200).json(book);
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
  console.log("deleteBook");
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

// export const getAllBooks: RequestHandler = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   console.log("AllBook");
//   try {
//     const books = await Book.findAll();
//     res.status(200).json({ books });
//     return;
//   } catch (error) {
//     res.status(500).json({ message: "Error retrieving all books", error });
//     return;
//   }
// };

export const getAllBooks: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1; // Default to page 1
    const pageSize = parseInt(req.query.pageSize as string) || 24; // Default to 20 items per page

    const offset = (page - 1) * pageSize;

    const books = await Book.findAll({
      limit: pageSize,
      offset,
    });
    //console.log("BEBooks: ", books);
    res.status(200).json(books);
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
  console.log("getById");
  try {
    const book = await Book.findOne({ where: { id } });

    if (!book) {
      res.status(404).json({ message: "Book not found or unauthorized" });
      return;
    }

    res.status(200).json({ book });
    return;
  } catch (error) {
    res.status(500).json({ message: "Error retrieving getbookById", error });
    return;
  }
};

export const getBookDetails: RequestHandler = async (
  //********************************************************** */
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  console.log("getBookdetails");
  try {
    const book = await Book.findOne({ where: { id } });

    if (!book) {
      res.status(404).json({ message: "Book not found or unauthorized" });
      return;
    }
    const bookId = book.id;
    const bookGenreName = await sequelize.query(
      `
      select genres.name
      from genres 
      inner join book_genres on (genres.id = book_genres."genreId")
      inner join books on (books.id = book_genres."bookId")
      where books.id IN (:bookId)
      `,
      {
        replacements: { bookId },
        type: QueryTypes.SELECT,
      }
    );
    const genreNames = (bookGenreName as { name: string }[]).map(
      (genre) => genre.name
    );
    const bookDetails = { ...book.toJSON(), genreName: genreNames };
    //console.log("BackEnd: ", bookDetails);

    res.status(200).json(bookDetails);
    return;
  } catch (error) {
    res.status(500).json({ message: "Error retrieving getbookById", error });
    return;
  }
};

export const searchBookByTitle: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const title = req.query.title as string | undefined;
  //const details = req.query.details as string | undefined;

  console.log("titleSearch");
  try {
    const books = await Book.findAll({
      where: title
        ? {
            [Op.or]: [
              { title: { [Op.iLike]: `%${title}%` } },
              { details: { [Op.iLike]: `%${title}%` } },
            ],
          }
        : {}, // Fetch all books if no title is provided
    });

    if (books.length === 0) {
      res.status(200).json({ message: "Book Not found." });
      return;
    }

    res.status(200).json(books);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving book search title.", error });
  }
};

// export const searchBookByGenre: RequestHandler = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   const genreIds = req.query as number[];
//   console.log("genreSearch");
//   try {
//     //const genre = await fetchGenresByName(name);

//     if (!genreIds.length) {
//       res.status(404).json({ message: "No genre found." });
//       return;
//     }
//     //const genreIds = genre.map((gen) => gen.id);

//     const books = await sequelize.query(
//       `
//       SELECT books.*
//       FROM books
//       INNER JOIN book_genres ON books.id = book_genres."bookId"
//       INNER JOIN genres ON genres.id = book_genres."genreId"
//       WHERE genres.id IN (:genreIds);
//       `,
//       {
//         replacements: { genreIds }, // Pass genre IDs as parameters
//         type: QueryTypes.SELECT, // Define query type
//       }
//     );

//     if (!books.length) {
//       res.status(404).json({ message: "No books found for the given genre." });
//       return;
//     }

//     res.status(200).json(books);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error retrieving book search genre .", error });
//   }
// };
export const searchBookByGenre: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Extract and parse `genreIds` from query
    const genreIds = (req.query.genreIds as string | undefined)
      ?.split(",") // Split the comma-separated values into an array of strings
      .map((id) => parseInt(id.trim(), 10)) // Convert each string to a number
      .filter((id) => !isNaN(id)); // Filter out invalid numbers

    console.log("Parsed genreIds:", genreIds);

    if (!genreIds || genreIds.length === 0) {
      res.status(404).json({ message: "No genre IDs provided." });
      return;
    }

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
    res
      .status(500)
      .json({ message: "Error retrieving books by genre.", error });
  }
};

export const userBooks: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = (req as any).user?.id;
  console.log("userBooks");
  try {
    const book = await Book.findAll({ where: { userId } });

    if (!book) {
      res.status(404).json({ message: "Book not found or unauthorized" });
      return;
    }

    res.status(200).json(book);
    return;
  } catch (error) {
    res.status(500).json({ message: "Error retrieving User's books", error });
    return;
  }
};
