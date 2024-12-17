import { format } from "date-fns";
import { Star } from 'lucide-react'
import { Book } from '@/type/Book';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { CommentDB } from "@/type/Comment";
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button"
import { findBook } from '@/services/bookServices';
import BookComment from '@/components/BookComment';
import { getGenresOfBook } from '@/services/genreServices';
import { createUserRating, getAllReview, getUserReview } from '@/services/reviewServices';

const BookDetails = () => {
  const { id } = useParams<{ id: string }>();
  const token = localStorage.getItem('token');
  const [genre, setgenre] = useState<string[]>([]);
  const [book, setBook] = useState<Book | null>(null);
  const [review, setReview] = useState<CommentDB[]>([]);
  const genreState = useSelector((state: RootState) => state.genre);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [averageRating, setAverageRating] = useState<number | null>(null);

  const fetchBook = async () => {
    const response = await findBook(id);
    //console.log('Book: ',response);
    setBook(response);
  }

  const fetchGenreOfBook = async () => {
    const response = await getGenresOfBook(id);
    const filteredGenre = genreState
    .filter((genre) => response.includes(genre.id))
    .map((genre) => genre.name);

    setgenre(filteredGenre);
  }

  //fetch user rating
  const fetchRatingOfBook = async () => {
    if(token){
      const response = await getUserReview(id, token);
      setSelectedRating(response);
    }
  }

  const fetchAllReview = async () => {
    const response = await getAllReview(id);
    //console.log('Review: ',response);
    setReview(response); 
  }

  const calAvg = () => {
    if (review.length > 0) {
      //console.log('Inside');
      const totalRating = review.reduce((sum, item) => sum + item.rating, 0);
      const avg = totalRating / review.length;
  
      setAverageRating(avg);
      //console.log(`Average Rating: ${avg}`);
      //console.log(`Is Decimal: ${avg % 1 !== 0}`);
    } else {
      setAverageRating(null);
    }

  }

  useEffect(()=> {
    fetchBook();
    fetchGenreOfBook();
    fetchRatingOfBook();
    fetchAllReview();
    calAvg();
  }, [])


  return (
    <div className="flex min-h-screen bg-white">
      <div className="fixed w-[300px] p-6 flex flex-col items-center">
        <img
          src={book?.thumbnailUrl}
          alt="The Barn book cover"
          className="w-full h-auto rounded shadow-lg mb-8"
        />
        <div className="w-full">
          <h3 className="text-center mb-2 text-gray-700">Rate this book</h3>
          <div className="flex justify-center gap-1">
            {
            //for(let i = 1; i < averageRating; i++)
            [1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-8 h-8 ${
                  star <= (selectedRating || 0)
                    ? 'stroke-orange-400 fill-orange-400'
                    : 'stroke-gray-300'
                } hover:stroke-orange-400 hover:fill-orange-400 cursor-pointer transition-colors duration-150 ease-in-out`}
                onClick={async () => {
                  setSelectedRating(star);
                  //handleUserRating(star);
                  if(token)
                    await createUserRating(star, id, token);
                }}
                onMouseEnter={(e) => {
                  const stars = e.currentTarget.parentElement?.children;
                  if (stars) {
                    for (let i = 0; i < star; i++) {
                      stars[i].classList.add('stroke-orange-400', 'fill-orange-400');
                    }
                  }
                }}
                onMouseLeave={(e) => {
                  const stars = e.currentTarget.parentElement?.children;
                  if (stars) {
                    for (let star of stars) {
                      if (star.classList.contains('stroke-orange-400') && !selectedRating) {
                        star.classList.remove('stroke-orange-400', 'fill-orange-400');
                      }
                    }
                  }
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="ml-[300px] p-8 flex-1">
        <h1 className="font-serif text-4xl mb-2">
          {/* The Barn: The Secret History of a Murder in Mississippi */}
          {book?.title}
        </h1>
        <h2 className="text-xl text-gray-600 mb-6">{book?.AuthorName}</h2>
        
        <div className="flex items-center gap-2 mb-6">
          <div className="flex">
            { 
            [1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-6 h-6 fill-orange-400 stroke-orange-400" />
            ))}
          </div>
          <span className="text-2xl font-bold">{averageRating}</span>
          <span className="text-gray-600"> {review.length} ratings and reviews</span>
        </div>

        <p className="text-gray-800 mb-8 leading-relaxed">
          {book?.details}
        </p>

        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {
            genre.map((gen) => (
              <Button
                key={gen}
                variant="outline"
                className="rounded-full text-gray-700 hover:bg-gray-100"
              >
                {gen}
              </Button>
            ))}
          </div>
        </div>

        <div className="text-gray-600">
          <p>First published {format(book?.createdAt ? book.createdAt : new Date(), "MMMM dd, yyyy")}</p>
        </div>
        <div className="ml-[300px] p-8 flex-1">
          <BookComment id={id}/>
        </div>
      </div>
    </div>
  )
}

export default BookDetails