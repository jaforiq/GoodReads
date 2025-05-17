import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  token: "",
  //userId: -1, // To store the logged-in user's ID
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      //state.userId = action.payload.userId;
    },
    logout: (state) => {
      localStorage.removeItem("token");
      state.token = "";
      //state.userId = -1;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
