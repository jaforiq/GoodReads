import { format } from "date-fns";
import { Star } from 'lucide-react'
import { User } from '@/type/User'
import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { getAllUser } from '@/services/userServices'
import type { Comment, CommentDB } from '../type/Comment'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createUserReview, getAllReview } from '@/services/reviewServices'


export default function BookComment(props: any) {
  const id = props.id;
  const token = localStorage.getItem('token');
  const [users, setUsers] = useState<User[]>();
  const [newComment, setNewComment] = useState('')
  const [comments, setComments] = useState<Comment[]>([])
  const [review, setReview] = useState<CommentDB[]>([]);

  const fetchUsers = async () => {
    if(token){
      const allUsers = await getAllUser(token); 
      setUsers(allUsers);
    }
  }

  const fetchAllReview = async () => {
    if(token){
      console.log(id);
      const response = await getAllReview(id);
      setReview(response);
    }
  }

   
  useEffect(() => {
    fetchUsers();
    fetchAllReview();
  },[])

  //
  useEffect(() => {

    const transformedComments = review.map((item) => ({
      id: item.id,
      author: {
        name: users?.find((user) => user.id === item.userId)?.username || "Unknown User",
        avatar: '/placeholder.svg',
      },
      rating: item.rating,
      content: item.review as Text,
      date: format(item.createdAt, "MMMM dd, yyyy"),
    }));

    setComments(transformedComments);
  }, [review, users]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return
    if(token){
      const response = await createUserReview(newComment, id, token) 
      const userId = response.userId;
      const authorName = users?.find((user) => user.id === userId)?.username || "Unknown User";
    
    const comment: Comment = {
      id: response.id,
      author: {
        name: authorName,
        avatar: '/placeholder.svg',  //
      },
      rating: response.rating ? response.rating : 0,
      content: response.review,
      date: format(response.createdAt, "MMMM dd, yyyy") 
    }
    setComments([comment, ...comments])
    setNewComment('')
    }
  }

//console.log('review: ', review);
//console.log('user: ', users)
  return (
    token ? (
      <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Community Reviews</h2>
        
        {/* Add Comment Section */}
        <div className="flex gap-4">
          <Textarea
            placeholder="Write your review..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        <div className="flex justify-end">
          <Button 
            onClick={handleAddComment}
            disabled={!newComment.trim()}
          >
            Add Review
          </Button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-8">
        {comments.map((comment) => (
          <div key={comment.id} className="space-y-4">
            <div className="flex items-start gap-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={comment.author.avatar} />
                <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <h3 className="font-semibold">{comment.author.name}</h3>
                  {/* <div className="text-sm text-gray-500">
                    {comment.author.reviews} reviews · {comment.author.followers} followers
                  </div> */}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < comment.rating
                            ? 'fill-orange-400 stroke-orange-400'
                            : 'fill-gray-200 stroke-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">{comment.date}</span>
                </div>
                <p className="mt-2 text-gray-700 whitespace-pre-line">{String(comment.content)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    ) : (
      <p>No reviews yet</p>
    )
    
  )
}

