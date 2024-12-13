import apiClient from "./api-client";

export const getAllGenres = async () => {
  try {
    const response = await apiClient.get("/genres/");
    console.log("ser: ", response);
    return response.data.genres;
  } catch (err: any) {
    console.log("Error occure from genre service.", err);
  }
};
