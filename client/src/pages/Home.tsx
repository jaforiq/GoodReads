
import Select from "react-select";
import { Search } from "lucide-react";
import { GenreOption } from "@/type/Genre";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import BookCard from "@/components/BookCard";
import { useDispatch, useSelector } from "react-redux";
import { getAllBooks } from "@/services/bookServices";
import { addBooks, clearBooks } from "@/features/book/bookSlice";
import { FormControl, Input, InputGroup, InputLeftAddon } from "@chakra-ui/react";
import { searchBookByGenre, searchBookByTitle } from "@/services/searchServices";

const Home = () => {
  const dispatch = useDispatch();

  const [inputTitle, setInputTitle] = useState("");
  const [selectedGenreIds, setSelectedGenreIds] = useState<number[]>([]);
  const [debouncedTitle, setDebouncedTitle] = useState("");
  const [debouncedGenreIds, setDebouncedGenreIds] = useState<number[]>([]);
  const genreState = useSelector((state: RootState) => state.genre);

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

  const fetchBooks = async () => {
    try {
      dispatch(clearBooks());

      if (debouncedGenreIds.length > 0) {
        const genreResponse = await searchBookByGenre(debouncedGenreIds);
        if (genreResponse && genreResponse.length) {
          dispatch(addBooks(genreResponse));
        }
        return;
      }

      if (debouncedTitle) {
        const titleResponse = await searchBookByTitle(debouncedTitle);
        if (titleResponse && titleResponse.length) {
          dispatch(addBooks(titleResponse));
        }
        return;
      }

      // If neither title nor genre is provided, fetch all books
      const allBooks = await getAllBooks();
      dispatch(addBooks(allBooks));
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [debouncedTitle, debouncedGenreIds]);  // for two useEffect fetchBooks calls 2 times
  
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
      <div className="relative z-0">
      <BookCard />
      </div>
    </div>
  );
};

export default Home;


  