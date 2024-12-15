import apiClient from "./api-client";

export const getAllGenres = async () => {
  try {
    const response = await apiClient.get("/genres/");
    //console.log("ser: ", response);
    return response.data.genres;
  } catch (err: any) {
    console.log("Error occure from genre service.", err);
  }
};

export const getGenresOfBook = async (id: any) => {
  try {
    const response = await apiClient.get(`/genres/${id}`);
    const genres = response.data.genres;
    const genreIds = genres.map((genre: any) => genre.genreId);
    //console.log("Genres: ", genreIds);
    return genreIds;
  } catch (err: any) {
    console.log("Error occure from genre service.", err);
  }
};
