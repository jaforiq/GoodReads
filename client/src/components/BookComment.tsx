import { format } from "date-fns";
import { Star } from 'lucide-react'
import { User } from '@/type/User'
import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { Comment, CommentDB } from '../type/Comment'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createUserReview, getAllReview } from '@/services/reviewServices'


export default function BookComment(props: any) {
  const {id, review} = props;
  const token = localStorage.getItem('token');
  const [newComment, setNewComment] = useState('')
  const [comments, setComments] = useState<Comment[]>([])
  //const [review, setReview] = useState<CommentDB[]>([]);

  useEffect(() => {

    const transformedComments = review.map((item: any) => ({
      id: item.id,
      author: {
        name: item.username,
        avatar: '/placeholder.svg',
      },
      rating: item.rating,
      content: item.review as Text,
      date: format(item.createdAt, "MMMM dd, yyyy"),
    }));

    setComments(transformedComments);
  }, [review]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return
    if(token){
      const response = await createUserReview(newComment, id, token) 
      //const userId = response.userId;
      //const authorName = 
    
    const comment: Comment = {
      id: response.id,
      author: {
        name: response.username,
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

console.log('review: ', review);
//console.log('user: ', users)
  return (
    <div className="space-y-8 text-left mt-5">
        {token ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Community Reviews</h2>
          
          {/* Add Comment Section */}
          <div className="flex gap-4">
            <Textarea
              placeholder="Write your review..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px] max-w-xl"
            />
          </div>
          <div className="flex justify-start">
            <Button 
              onClick={handleAddComment}
              disabled={!newComment.trim()}
            >
              Add Review
            </Button>
          </div>
        </div>
      ) : (
      <p className="mt-10 flex justify-center">Want to review Login First</p>
        )}
       {/* Comments List */}
        <div className="space-y-8 text-left">
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

    
  )
}


// import { format } from "date-fns";
// import { Star, Edit, Trash2 } from 'lucide-react'
// import { User } from '@/type/User'
// import { useEffect, useState } from 'react'
// import { Button } from "@/components/ui/button"
// import { Textarea } from "@/components/ui/textarea"
// import { getAllUser } from '@/services/userServices'
// import type { Comment, CommentDB } from '../type/Comment'
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { createUserReview, getAllReview, updateUserReview, deleteUserReview } from '@/services/reviewServices'

// export default function BookComment({ id, onReviewUpdate }: { id: string | undefined, onReviewUpdate: () => void }) {
//   const token = localStorage.getItem('token');
//   const [users, setUsers] = useState<User[]>();
//   const [newComment, setNewComment] = useState('')
//   const [comments, setComments] = useState<Comment[]>([])
//   const [review, setReview] = useState<CommentDB[]>([]);
//   const [editingCommentId, setEditingCommentId] = useState<number | null>(null);

//   const fetchUsers = async () => {
//     if(token){
//       const allUsers = await getAllUser(token); 
//       setUsers(allUsers);
//     }
//   }

//   const fetchAllReview = async () => {
//     if(token){
//       const response = await getAllReview(id);
//       setReview(response);
//     }
//   }

//   useEffect(() => {
//     fetchUsers();
//     fetchAllReview();
//   }, [])

//   useEffect(() => {
//     const transformedComments = review.map((item) => ({
//       id: item.id,
//       author: {
//         name: users?.find((user) => user.id === item.userId)?.username || "Unknown User",
//         avatar: '/placeholder.svg',
//       },
//       rating: item.rating,
//       content: item.review as Text,
//       date: format(new Date(item.createdAt), "MMMM dd, yyyy"),
//       userId: item.userId,
//     }));

//     setComments(transformedComments);
//   }, [review, users]);

//   const handleAddComment = async () => {
//     if (!newComment.trim()) return
//     if(token){
//       const response = await createUserReview(newComment, id, token) 
//       const userId = response.userId;
//       const authorName = users?.find((user) => user.id === userId)?.username || "Unknown User";
    
//       const comment: Comment = {
//         id: response.id,
//         author: {
//           name: authorName,
//           avatar: '/placeholder.svg',
//         },
//         rating: response.rating ? response.rating : 0,
//         content: response.review,
//         date: format(new Date(response.createdAt), "MMMM dd, yyyy"),
//         userId: userId,
//       }
//       setComments([comment, ...comments])
//       setNewComment('')
//       onReviewUpdate();
//     }
//   }

//   const handleEditComment = async (commentId: number, newContent: string) => {
//     if(token) {
//       await updateUserReview(commentId, newContent, token);
//       const updatedComments = comments.map(comment => 
//         comment.id === commentId ? { ...comment, content: newContent } : comment
//       );
//       setComments(updatedComments);
//       setEditingCommentId(null);
//       onReviewUpdate();
//     }
//   }

//   const handleDeleteComment = async (commentId: number) => {
//     if(token) {
//       await deleteUserReview(commentId, token);
//       const updatedComments = comments.filter(comment => comment.id !== commentId);
//       setComments(updatedComments);
//       onReviewUpdate();
//     }
//   }

//   const currentUserId = users?.find(user => user.username === localStorage.getItem('username'))?.id;

//   return (
//     token ? (
//       <div className="space-y-8 text-left mt-5">
//         <div className="space-y-4">
//           <h2 className="text-xl font-semibold">Community Reviews</h2>
          
//           {/* Add Comment Section */}
//           <div className="flex gap-4">
//             <Textarea
//               placeholder="Write your review..."
//               value={newComment}
//               onChange={(e) => setNewComment(e.target.value)}
//               className="min-h-[100px] max-w-xl"
//             />
//           </div>
//           <div className="flex justify-start">
//             <Button 
//               onClick={handleAddComment}
//               disabled={!newComment.trim()}
//             >
//               Add Review
//             </Button>
//           </div>
//         </div>

//        {/* Comments List */}
//         <div className="space-y-8 text-left">
//           {comments.map((comment) => (
//             <div key={comment.id} className="space-y-4">
//               <div className="flex items-start gap-4">
//                 <Avatar className="w-12 h-12">
//                   <AvatarImage src={comment.author.avatar} />
//                   <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
//                 </Avatar>
//                 <div className="flex-1">
//                   <div className="flex items-baseline gap-2">
//                     <h3 className="font-semibold">{comment.author.name}</h3>
//                   </div>
//                   <div className="flex items-center gap-2 mt-1">
//                     <div className="flex">
//                       {[...Array(5)].map((_, i) => (
//                         <Star
//                           key={i}
//                           className={`w-4 h-4 ${
//                             i < comment.rating
//                               ? 'fill-orange-400 stroke-orange-400'
//                               : 'fill-gray-200 stroke-gray-200'
//                           }`}
//                         />
//                       ))}
//                     </div>
//                     <span className="text-sm text-gray-500">{comment.date}</span>
//                   </div>
//                   {editingCommentId === comment.id ? (
//                     <div>
//                       <Textarea
//                         value={String(comment.content)}
//                         onChange={(e) => {
//                           const updatedComments = comments.map(c => 
//                             c.id === comment.id ? { ...c, content: e.target.value } : c
//                           );
//                           setComments(updatedComments);
//                         }}
//                         className="mt-2 min-h-[100px]"
//                       />
//                       <div className="mt-2">
//                         <Button onClick={() => handleEditComment(comment.id, String(comment.content))}>Save</Button>
//                         <Button onClick={() => setEditingCommentId(null)} variant="outline" className="ml-2">Cancel</Button>
//                       </div>
//                     </div>
//                   ) : (
//                     <p className="mt-2 text-gray-700 whitespace-pre-line">{String(comment.content)}</p>
//                   )}
//                   {currentUserId === comment.userId && editingCommentId !== comment.id && (
//                     <div className="mt-2">
//                       <Button onClick={() => setEditingCommentId(comment.id)} variant="outline" className="mr-2">
//                         <Edit className="w-4 h-4 mr-2" />
//                         Edit
//                       </Button>
//                       <Button onClick={() => handleDeleteComment(comment.id)} variant="outline" className="text-red-500">
//                         <Trash2 className="w-4 h-4 mr-2" />
//                         Delete
//                       </Button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     ) : (
//       <p className="mt-10 flex justify-center">No reviews yet</p>
//     )
//   )
// }

