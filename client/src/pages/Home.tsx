
import Select from "react-select";
import { GenreOption } from "@/type/Genre";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import BookCard from "@/components/BookCard";
import { useDispatch, useSelector } from "react-redux";
import { getAllBooks } from "@/services/bookServices";
import DefaultSpinner from "@/components/DefaultSpinner";
import { FormControl, Input, InputGroup } from "@chakra-ui/react";
import { addBooks, clearBooks, setbooks } from "@/features/book/bookSlice";

const Home = () => {
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [inputTitle, setInputTitle] = useState("");
  const [debouncedTitle, setDebouncedTitle] = useState("");
  const [isLoading, setLoading] = useState<boolean>(false);
  const [selectedGenreIds, setSelectedGenreIds] = useState<number[]>([]);
  const [debouncedGenreIds, setDebouncedGenreIds] = useState<number[]>([]);
  const genreState = useSelector((state: RootState) => state.genre);
  const pageSize = 24;

  const genreOptions: GenreOption[] = genreState.map((genre) => ({
    value: genre.id,
    label: genre.name,
  }));

  const handleGenreChange = (selectedOptions: readonly GenreOption[]) => {
    const ids = selectedOptions.map((option) => option.value);
    setSelectedGenreIds(ids);
  };

  // Debounce logic
  useEffect(() => {
    const titleTimeout = setTimeout(() => setDebouncedTitle(inputTitle), 500);
    const genreTimeout = setTimeout(() => setDebouncedGenreIds(selectedGenreIds), 500);

    return () => {
      clearTimeout(titleTimeout);
      clearTimeout(genreTimeout);
    };
  }, [inputTitle, selectedGenreIds]);

    // Function to load more events when the user scrolls to the bottom
    const handleScroll = () => {
      //console.log('handleScroll start');
      if (
        window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight
      )
        return;
      //console.log('handralScroll end');  
      setPage((prevPage) => prevPage + 1);
    };
  
    useEffect(() => {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);


  const fetchBooks = async () => {
    try {
      setLoading(true);
  
      if (page === 1 && (!debouncedTitle.length || !debouncedGenreIds)) {
        dispatch(clearBooks()); // Clear only for the first page
      }
  
      if(debouncedTitle.length > 0 || debouncedGenreIds.length > 0) setPage(1);
      const allBooks = await getAllBooks(page, pageSize, debouncedTitle, debouncedGenreIds);
      dispatch(page === 1 ? setbooks(allBooks) : addBooks(allBooks));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching books:", error);
      setLoading(false);
    } 
  };
  
  useEffect(() => {
    fetchBooks();
  }, [page, debouncedTitle, debouncedGenreIds]);  // for two useEffect fetchBooks calls 2 times

  
  return (
    <div className="relative mt-1">
      <div className="sticky z-50 ">
        <InputGroup>
          <Input
            type="text"
            className="rounded-l-lg ml-16 mt-1"
            placeholder="Search by book title/descriptions"
            onChange={(e) => setInputTitle(e.target.value)}
          />
        <FormControl className="mt-1 my-1 mr-16 relative z-50">
          <Select
            isMulti
            name="genres"
            options={genreOptions}
            onChange={handleGenreChange}
            placeholder="Select Genres"
            aria-label="Select Genres"
            //styles={customStyles}
            closeMenuOnSelect={false}
            />
        </FormControl>
        {/* <InputLeftAddon className="mt-1" children={<Search className="mt-0 h-4 w-5" />} /> */}
      </InputGroup>
      </div>
      {isLoading ? (<div className='absolute top-[48%] left-[48%]'><DefaultSpinner /></div>)
      : (<div className="relative z-0">
        <BookCard isLoading={isLoading}/>
        </div>)  }      
    </div>
  );
};

export default Home;


  