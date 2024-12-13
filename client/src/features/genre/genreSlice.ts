import { Genre } from "@/type/Genre";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: Genre[] = [];

const genreSlice = createSlice({
  name: "genres",
  initialState,
  reducers: {
    addGenre: (state, action: PayloadAction<Genre[]>) => {
      const newGenre = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];
      state.push(...newGenre);
    },
  },
});
export const { addGenre } = genreSlice.actions;

export default genreSlice.reducer;
