import { Star } from 'lucide-react'
import { Button } from "@/components/ui/button"
import emptyImage from '../../public/empty-folder.png';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { findBook } from '@/services/bookServices';
import { Book } from '@/type/Book';
import { getGenresOfBook } from '@/services/genreServices';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { createUserRating, createUserReview, getUserReview } from '@/services/reviewServices';

const BookDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [genre, setgenre] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const token = useSelector((state: RootState) => state.user.token);
  const genreState = useSelector((state: RootState) => state.genre);

  const fetchBook = async () => {
    const response = await findBook(id);
    //console.log(response);
    setBook(response);
  }

  const fetchGenreOfBook = async () => {
    const response = await getGenresOfBook(id);
    const filteredGenre = genreState
    .filter((genre) => response.includes(genre.id))
    .map((genre) => genre.name);
    //console.log('res: ', genreState);
    setgenre(filteredGenre);
  }

  const fetchRatingOfBook = async () => {
    const response = await getUserReview(id, token);
    setSelectedRating(response);
  }


  useEffect(()=> {
    fetchBook();
    fetchGenreOfBook();
    fetchRatingOfBook();
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
            {[1, 2, 3, 4, 5].map((star) => (
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
            {[1, 2, 3, 4].map((star) => (
              <Star key={star} className="w-6 h-6 fill-orange-400 stroke-orange-400" />
            ))}
            {/* <Star className="w-6 h-6 fill-orange-400 stroke-orange-400 fill-opacity-50" /> */}
          </div>
          <span className="text-2xl font-bold">4.45</span>
          <span className="text-gray-600">· 1,398 ratings · 217 reviews</span>
        </div>

        <p className="text-gray-800 mb-8 leading-relaxed">
          {/* A shocking and revelatory account of the murder of Emmett Till that lays bare how forces
          from around the world converged on the Mississippi Delta in the long lead-up to the crime,
          and how the truth was erased for so long. Wright Thompson's family farm in Mississippi is 23
          miles from the site of one of the most notorious and consequential killings in American history,
          yet he had to leave the state for college before he learned the first thing about it. To this day,
          many Americans know little more than what they learned from early newspaper coverage of the crime... */}
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
          <p>448 pages, Hardcover</p>
          <p>First published September 24, 2024</p>
        </div>
      </div>
    </div>
  )
}

export default BookDetails