import { Search } from "lucide-react";
import { useEffect, useState } from "react"
import BookCard from "@/components/BookCard";
import { useDispatch } from "react-redux";
import { searchBookByGenre, searchBookByTitle } from "@/services/searchServices";
import { addBooks, clearBooks } from "@/features/book/bookSlice";
import { Input, InputGroup, InputLeftAddon } from '@chakra-ui/react';

const Home = () => {
  const dispatch = useDispatch();
  
  // For debounching
  const [inputValue, setInputValue] = useState("");
  const [inputGenreValue, setInputGenreValue] = useState("");
  const [debouncedTitleInput, setDebouncedTitleInput] = useState("");
  const [debouncedGenreInput, setDebouncedGenreInput] = useState("");

  // debounce code
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedTitleInput(inputValue);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [inputValue,500]);


  // If title exist then fetch according to title other wise fetch all book data
  const fetchSearchResults = async () => {
    try {
      const response = await searchBookByTitle(debouncedTitleInput);
      //console.log('Search2: ', response);

      // Before insert serarch result store should clear
      dispatch(clearBooks());

      if(response.length > 0){
        dispatch(addBooks(response));
      }
      // setEvents(newEvents);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  useEffect(() => {  
  fetchSearchResults();
  }, [debouncedTitleInput]); 
  
  
  // debounce code
  // useEffect(() => {
  //   const timeoutId = setTimeout(() => {
  //     setDebouncedGenreInput(inputGenreValue);
  //   }, 500);
  //   return () => clearTimeout(timeoutId);
  // }, [inputGenreValue,500]);

  // const fetchSearchGenre = async () => {
  //   try {
  //     const response = await searchBookByGenre(debouncedGenreInput);
  //     console.log('genre2: ', response);

  //     // Before insert serarch result store should clear
  //     dispatch(clearBooks());
  //     console.log('store: ', bookstate)
  //     if(response.length > 0){
  //       dispatch(addBooks(response));
  //     }
  //     // setEvents(newEvents);
  //   } catch (error) {
  //     console.error('Error fetching search results:', error);
  //   }
  // };

  // useEffect(() => {  
  //   fetchSearchGenre();
  // }, [debouncedGenreInput]);  


  const handleTitleChange = (book: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(book.target.value);
  };

  const handleGenreChange = (genre: React.ChangeEvent<HTMLInputElement>) => {
    setInputGenreValue(genre.target.value);
  };

  return (
    <div>
      <InputGroup>
        <Input type='text' className='rounded-l-md ml-16 mt-1' placeholder='Search by book title...' onChange={handleTitleChange}/>
        <Input type='text' className='mt-1' rounded={'none'} placeholder='Search by book genres...' onChange={handleGenreChange}/>
        <InputLeftAddon className="mt-1" children={<Search className="mt-0 h-5 w-5" />}  />
      </InputGroup>
      <BookCard/>
    </div>
  )
}

 export default Home;




  // const fetchBooks = async () => {
  //   const response = await getAllBooks();
  //     if(response){
  //       const currentBooks = bookState; 
  //       const newBooks = response.filter((book: Book) => !currentBooks.some((existingBook) => existingBook.id === book.id));
  //       if (newBooks.length > 0) {
  //         dispatch(addBooks(newBooks));
  //       }
  //     }      
  //   }
    

  // useEffect(() => {    
  //   fetchBooks();    
  // },[])