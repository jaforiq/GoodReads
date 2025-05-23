import { Book } from "@/type/Book";
import { useDispatch} from "react-redux";
import { useEffect, useState } from "react";
import { showToast } from "@/services/showToast";
import { addBooks } from "@/features/book/bookSlice";
import { useNavigate, useParams } from "react-router-dom";
import { findBookById, updateBook } from "@/services/bookServices"

const EditBook = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();

  
  const [book, setBook] = useState<Book>({
    title: '',
    details: '',
    AuthorName: '',
    PublisherName: '',
    thumbnailUrl: '',
    createdAt: '',
    genreId: []
  });

  const fetchBookById = async () => {
    try{
      const response = await findBookById(id);
      setBook(response);
    } catch(err: any){
      console.log('Error Book Edit getById.', err);
    }
  }

  useEffect(() => {
    fetchBookById();
  }, [])
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setBook(prev => ({ ...prev, [name]: value }));
    };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Inside FileChange");
    const cloudName = "dvrwupgzz";
    const presetName = "fr3ws4o";
    
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', presetName);
  
      fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      })
        .then(response => response.json())
        .then(data => {
          setBook(prev => ({ ...prev, thumbnailUrl: data.secure_url }));
        })
        .catch(error => console.log(error));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try{
      if(token){
        const newBook = await updateBook(id, book, token);
        console.log('newBook: ', newBook);
        if(newBook){
          // const currentBooks = bookState; 
          // const newBooks = newBook.filter((book: Book) => !currentBooks.some((existingBook) => existingBook.id === book.id));
          if (newBook.length > 0) {
            dispatch(addBooks(newBook));
          }
          navigate('/mybook');        
          showToast("Book Update", "Book Updated Successfull", 'success');
        }   
      }
    } catch(err: any){
      showToast("Book Update", "Book Updated failed", 'error');
      console.log('Error Book Update.', err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="flex items-center text-2xl font-bold mb-4">Edit Book</h2>
      <div className="flex flex-col md:flex-row gap-8">
        <form onSubmit={handleSubmit} className="space-y-4 flex-1">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Book Title</label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={book.title}
              placeholder="Enter title..."
              onChange={handleInputChange}
              className="mt-1 py-1 px-3 block w-full text rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-100"
            />
          </div>

          <div>
            <label htmlFor="details" className="block text-sm font-medium text-gray-700">Book Details</label>
            <textarea
              id="details"
              name="details"
              rows={4}
              required
              value={book.details}
              placeholder="Enter details..."
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            ></textarea>
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Author Name</label>
            <input
              type="text"
              id="AuthorName"
              name="AuthorName"
              required
              value={book.AuthorName}
              placeholder="Enter author name..."
              onChange={handleInputChange}
              className="mt-1 py-1 px-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Publisher Name</label>
            <input
              type="text"
              id="PublisherName"
              name="PublisherName"
              required
              value={book.PublisherName}
              placeholder="Enter publisher name..."
              onChange={handleInputChange}
              className="mt-1 py-1 px-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>


          {/* <FormControl>
          <label htmlFor="picture" className="block text-sm font-medium text-gray-700">Genre</label>
            <Select
              isMulti
              name="genres"
              options={genreOptions}
              onChange={handleGenreChange}
              placeholder="Select Genres"
              aria-label="Select Genres"
              closeMenuOnSelect={false}
            />
          </FormControl> */}

          <div>
            <label htmlFor="picture" className="block text-sm font-medium text-gray-700">Book Picture</label>
            <input
              type="file"
              id="picture"
              name="picture"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Update Book
            </button>
          </div>
        </form>

        <div className="flex-1 mt-8 md:mt-0">
          {book.thumbnailUrl ? (
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
              <img
                src={book.thumbnailUrl}
                alt="Event Preview"
                className="object-cover w-full h-full"
              />
            </div>
          ) : (
            <div className="aspect-w-16 aspect-h-9 rounded-lg bg-gray-100 flex items-center justify-center">
            </div>
          )}
        </div>
      </div>
    </div>
  );
  
}

export default EditBook