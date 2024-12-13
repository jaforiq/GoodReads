import { useEffect } from "react"
import { RootState } from "@/store/store";
import { addBooks } from "@/features/book/bookSlice";
import { getAllBooks } from "@/services/bookServices";
import { useDispatch, useSelector } from "react-redux"
import BookCard from "@/components/BookCard";
import { Book } from "@/type/Book";

const Home = () => {
  const dispatch = useDispatch();
  const bookState = useSelector((state: RootState) => state.book);
  

  const fetchBooks = async () => {
    const response = await getAllBooks();
      if(response){
        const currentBooks = bookState; 
        const newBooks = response.filter((book: Book) => !currentBooks.some((existingBook) => existingBook.id === book.id));
        if (newBooks.length > 0) {
          dispatch(addBooks(newBooks));
        }
      }      
    }
    

  useEffect(() => {    
    fetchBooks();    
  },[dispatch])

  return (
    <div>
      <BookCard/>
    </div>
  )
}

export default Home