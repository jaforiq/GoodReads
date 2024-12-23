import { Book } from "@/type/Book";
import apiClient from "./api-client";

export const getAllBooks = async (
  page: number,
  pageSize: number,
  title?: string,
  genreIds?: number[]
) => {
  try {
    const params: any = { page, pageSize };
    if (title) params.input = title;
    if (genreIds && genreIds.length > 0) params.genreIds = genreIds.join(",");

    const response = await apiClient.get(`/books/`, { params });
    console.log("getAllBooks: ", response.data);
    return response.data;
  } catch (err: any) {
    console.log("Error occurred from book service.", err);
    return null;
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

export const findBookById = async (id: any) => {
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

export const getBookDetails = async (id: any) => {
  try {
    const response = await apiClient.get(`/books/details/${id}`);

    return response.data;
  } catch (err: any) {
    console.log(
      "Error occure from bookById in book service.",
      err.response.data
    );
  }
};

export const findUserBook = async (token: string) => {
  try {
    const response = await apiClient.get(`/books/createduser`, {
      headers: { authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (err: any) {
    console.log(
      "Error occure from bookById in book service.",
      err.response.data
    );
  }
};

export const deleteBook = async (id: any, token: string) => {
  try {
    const response = await apiClient.delete(`/books/${id}`, {
      headers: { authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (err: any) {
    console.log(
      "Error occure from deleteBook in book service.",
      err.response.data
    );
  }
};

export const updateBook = async (id: any, book: Book, token: string) => {
  try {
    console.log("book: ", id, book);
    console.log("token: ", token);
    const response = await apiClient.put(`/books/${id}`, book, {
      headers: { authorization: `Bearer ${token}` },
    });
    //console.log("resp: ", response);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data);
  }
};
