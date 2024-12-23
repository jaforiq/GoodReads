import { Op } from "sequelize";
import { QueryTypes } from "sequelize";
import sequelize, { Book, BookGenre } from "../models";
import { Request, RequestHandler, Response } from "express";

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

export const getAllBooks: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const input = req.query.input as string | undefined;
    const genreIds = (req.query.genreIds as string | undefined)
      ?.split(",")
      .map((id) => parseInt(id.trim(), 10))
      .filter((id) => !isNaN(id));
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 24;

    const offset = (page - 1) * pageSize;

    // Base query options
    const queryOptions: any = {
      limit: pageSize,
      offset,
    };

    // Add title-based filtering
    let books;
    if (genreIds && genreIds.length > 0) {
      // Handle genre-based filtering
      books = await sequelize.query(
        `
        SELECT books.*
        FROM books
        INNER JOIN book_genres ON books.id = book_genres."bookId"
        INNER JOIN genres ON genres.id = book_genres."genreId"
        WHERE genres.id IN (:genreIds)
        LIMIT :limit OFFSET :offset;
        `,
        {
          replacements: { genreIds, limit: pageSize, offset },
          type: QueryTypes.SELECT,
        }
      );
    } else if (input) {
      books = await Book.findAll({
        where: {
          [Op.or]: [
            { title: { [Op.iLike]: `%${input}%` } },
            { details: { [Op.iLike]: `%${input}%` } },
          ],
        },
        limit: pageSize,
        offset,
      });
    } else {
      // Fallback to Sequelize query if no genreIds
      books = await Book.findAll(queryOptions);
    }
    //console.log("books.length: ", books);
    if (!books || books.length === 0) {
      res.status(200).json(books);
      return;
    }

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books.", error });
  }
};
