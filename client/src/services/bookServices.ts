import { Book } from "@/type/Book";
import apiClient from "./api-client";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
//const token = useSelector((state: RootState) => state.user.token);

export const getAllBooks = async () => {
  try {
    const response = await apiClient.get("/books/");
    //console.log("ser: ", response.data.books);
    return response.data.books;
  } catch (err: any) {
    console.log("Error occure from book service.", err);
  }
};

export const createBook = async (book: Book, token: string) => {
  try {
    //console.log("book: ", token);
    const response = await apiClient.post("/books/", book, {
      headers: { authorization: `Bearer ${token}` },
    });
    //console.log("resp: ", response);
    return response.data.newBook;
  } catch (error: any) {
    throw new Error(error.response.data);
  }
};

export const findBook = async (id: any) => {
  try {
    const response = await apiClient.get(`/books/${id}`);
    return response.data.book;
  } catch (err: any) {
    console.log(
      "Error occure from bookById in book service.",
      err.response.data
    );
  }
};
