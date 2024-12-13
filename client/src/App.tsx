import './App.css'
import { Outlet } from "react-router-dom";
import Navbar from './components/Navbar'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getAllGenres } from './services/genreServices';
import { addGenre } from './features/genre/genreSlice';
import { RootState } from './store/store';
import { Genre } from './type/Genre';

function App() {
  const dispatch = useDispatch();
  const genreState = useSelector((state: RootState) => state.genre);

  useEffect(() => {
    const getGenre = async () => {
      const genreData = await getAllGenres();
      if(genreData){
        console.log('gen', genreState.length);
        if(genreState.length === 0)dispatch(addGenre(genreData))
        else{
          const currentBooks = genreState; 
          const newGenres = genreData.filter((genre: Genre) => !currentBooks.some((existingGenre) => existingGenre.id === genre.id));
          if (newGenres.length > 0) {
            dispatch(addGenre(newGenres));
          }
        }
      }
    }

    getGenre();
  })

  return (
    <>
      <Navbar/>
      <Outlet/>
    </>
  )
}

export default App
