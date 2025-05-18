import "./App.css";
import { useEffect } from "react";
import { Genre } from "./type/Genre";
import Navbar from "./common/Navbar";
import { Outlet } from "react-router-dom";
import { RootState } from "./store/store";
import { login } from "./features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { getAllGenres } from "./services/genreServices";
import { addGenre } from "./features/genre/genreSlice";

function App() {
  const dispatch = useDispatch();
  const genreState = useSelector((state: RootState) => state.genre);
  const userId = useSelector((state: RootState) => state.user?.userId);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(login({ token, userId }));
    }
    const getGenre = async () => {
      const genreData = await getAllGenres();
      if (genreData) {
        console.log("gen", genreState);
        if (genreState.length === 0) dispatch(addGenre(genreData));
        else {
          const currentBooks = genreState;
          const newGenres = genreData.filter(
            (genre: Genre) =>
              !currentBooks.some(
                (existingGenre) => existingGenre.id === genre.id
              )
          );
          if (newGenres.length > 0) {
            dispatch(addGenre(newGenres));
          }
        }
      }
    };

    getGenre();
  }, []);

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default App;
