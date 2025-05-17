import { format } from "date-fns";
import { Star } from "lucide-react";
import { BookBD } from "@/type/Book";
import { CommentDB } from "@/type/Comment";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import BookComment from "@/components/BookComment";
import { getBookDetails } from "@/services/bookServices";
import { createUserRating, getAllReview } from "@/services/reviewServices";

const BookDetails = () => {
  const { id } = useParams<{ id: string }>();
  const token = localStorage.getItem("token");
  const [book, setBook] = useState<BookBD | null>(null);
  const [review, setReview] = useState<CommentDB[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const userid = useSelector((state: RootState) => state.user.userId);

  const fetchBook = async () => {
    const response = await getBookDetails(id);
    console.log("getBookDetails: :", response);
    setBook(response);

    //const response = await findBookById(id);
  };

  const calAvg = () => {
    if (review.length > 0) {
      const totalRating = review.reduce((sum, item) => sum + item.rating, 0);
      const avg = totalRating / review.length;
      setAverageRating(Number(avg.toFixed(2)));
    } else {
      setAverageRating(null);
    }
  };

  const fetchAllReview = async () => {
    const response = await getAllReview(id);
    console.log("Details response: ", response);
    if (userid) {
      console.log("userid: ", userid);
      const rating = response.find(
        (item: any) => item.userId === userid
      ).rating;
      console.log("Rating: ", rating);
      setSelectedRating(rating);
    }
    setReview(response);
  };
  useEffect(() => {
    fetchAllReview();
    fetchBook();
  }, []);

  useEffect(() => {
    calAvg();
  }, [review]);

  const handleRating = async (star: number) => {
    if (token) {
      const response = await createUserRating(star, id, token);

      setSelectedRating(star);

      setReview((prevReviews) => {
        const existingIndex = prevReviews.findIndex(
          (review) => review.id === response.id
        );

        if (existingIndex !== -1) {
          // Update existing review
          const updatedReviews = [...prevReviews];
          updatedReviews[existingIndex] = {
            ...updatedReviews[existingIndex],
            rating: response.rating, // Update rating
          };
          return updatedReviews;
        } else {
          // Add new review
          return [...prevReviews, response];
        }
      });
    }
  };

  console.log("Review: ", review);
  return (
    <div className="flex min-h-screen bg-white">
      <div className="fixed w-[300px] p-6 flex flex-col items-center">
        <img
          src={book?.thumbnailUrl}
          alt="The Barn book cover"
          className="w-full h-auto rounded shadow-lg mb-8"
        />
        {token && (
          <div className="w-full">
            <h3 className="text-center mb-2 text-gray-700">Rate this book</h3>
            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-8 h-8 ${
                    star <= (selectedRating || 0)
                      ? "stroke-orange-400 fill-orange-400"
                      : "stroke-gray-300"
                  } hover:stroke-orange-400 hover:fill-orange-400 cursor-pointer transition-colors duration-150 ease-in-out`}
                  onClick={() => handleRating(star)}
                  onMouseEnter={(e) => {
                    const stars = e.currentTarget.parentElement?.children;
                    if (stars) {
                      for (let i = 0; i < star; i++) {
                        stars[i].classList.add(
                          "stroke-orange-400",
                          "fill-orange-400"
                        );
                      }
                    }
                  }}
                  onMouseLeave={(e) => {
                    const stars = e.currentTarget.parentElement?.children;
                    if (stars) {
                      for (let star of stars) {
                        if (
                          star.classList.contains("stroke-orange-400") &&
                          !selectedRating
                        ) {
                          star.classList.remove(
                            "stroke-orange-400",
                            "fill-orange-400"
                          );
                        }
                      }
                    }
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Scrollable Content */}
      <div className="ml-[300px] p-8 flex-1">
        <h1 className="font-serif text-4xl mb-2">{book?.title}</h1>
        <h2 className="text-xl text-gray-600 mb-6">{book?.AuthorName}</h2>

        <div className="flex items-center gap-2 mb-6">
          <div className="text-gray-600">AVG:</div>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-6 h-6 ${
                  i < Math.floor(averageRating || 0)
                    ? "fill-orange-400 stroke-orange-400"
                    : i < (averageRating || 0)
                    ? "fill-orange-400 stroke-orange-400 fill-opacity-50"
                    : "fill-gray-200 stroke-gray-200"
                }`}
              />
            ))}
          </div>
          <span className="text-2xl font-bold">{averageRating}</span>
          <span className="text-gray-600">
            {" "}
            {review.length} ratings and reviews
          </span>
        </div>

        <p className="text-gray-800 mb-8 leading-relaxed">{book?.details}</p>

        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {book?.genreName.map((gen) => (
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
          <p>
            First published{" "}
            {format(
              book?.createdAt ? new Date(book.createdAt) : new Date(),
              "MMMM dd, yyyy"
            )}
          </p>
        </div>
        <div className="flex-1">
          <BookComment id={id} review={review} />
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
