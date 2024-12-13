import { Book } from "@/type/Book";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: Book[] = [];

const bookSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    setbooks: (state, action: PayloadAction<Book[]>) => {
      return action.payload;
    },
    addBooks: (state, action: PayloadAction<Book | Book[]>) => {
      const newBooks = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];

      // newBooks.forEach((book) => {
      //   if (!state.some((existingBook) => existingBook.id === book.id)) {
      //     state.push(book);
      //   }
      // });
      state.push(...newBooks);
    },
    editBook: (state, action: PayloadAction<Book>) => {
      const index = state.findIndex((book) => book.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    removeBook: (state, action: PayloadAction<number>) => {
      return state.filter((book) => book.id !== action.payload);
    },
  },
});

export const { setbooks, addBooks, editBook, removeBook } = bookSlice.actions;

export default bookSlice.reducer;
