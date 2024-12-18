import { Request, Response } from "express";
import Genre from "../models/Genre";
import { BookGenre } from "../models";
import { Op } from "sequelize";

export const createGenre = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const newGenre = await Genre.create({ name });
    res.status(201).json({ message: "Genre created successfully", newGenre });
  } catch (error) {
    res.status(500).json({ message: "Error creating genre", error });
  }
};

export const getGenres = async (req: Request, res: Response) => {
  //console.log("getGenre");
  try {
    const genres = await Genre.findAll();
    res.status(200).json({ genres });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving genres", error });
  }
};

export const getGenresByName = async (req: Request, res: Response) => {
  const name = req.query.name as string | undefined;

  try {
    const genre = await fetchGenresByName(name);

    if (!genre.length) {
      res.status(404).json({ message: "No genre found." });
      return;
    }
    const genreId = genre.map((gen) => gen.id);
    res.status(200).json(genreId);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving genre.", error });
  }
};

export const getGenreOfBook = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  //console.log("getGOfBook");
  try {
    const bookId = id;
    const genres = await BookGenre.findAll({
      where: { bookId },
      attributes: ["genreId"],
    });
    if (!genres) {
      res.status(404).json({ message: "Genre not found" });
      return;
    }

    res.status(200).json({ message: "Genre retrive successfully", genres });
  } catch (error) {
    res.status(500).json({ message: "Error retriving genre", error });
  }
};

export const fetchGenresByName = async (name?: string) => {
  return await Genre.findAll({
    where: { name: { [Op.iLike]: `%${name}%` } },
  });
};

// export const deleteGenre = async (req: Request, res: Response) => {
//   const { id } = req.params;

//   try {
//     const genre = await Genre.findByPk(id);
//     if (!genre) {
//       res.status(404).json({ message: "Genre not found" });
//       return;
//     }

//     await genre.destroy();
//     res.status(200).json({ message: "Genre deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting genre", error });
//   }
// };
