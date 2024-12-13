import apiClient from "./api-client";

export const getAllBooks = async () => {
  try {
    const response = await apiClient.get("/books/");
    //console.log("ser: ", response.data.books);
    return response.data.books;
  } catch (err: any) {
    console.log("Error occure from book service.", err);
  }
};
