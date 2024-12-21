


import { format } from "date-fns";
import { Star } from 'lucide-react';
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useEffect, useState } from 'react';
import type { Comment } from '../type/Comment';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createUserReview, deleteUserReview} from '@/services/reviewServices'; // Assume `updateUserReview` exists

export default function BookComment(props: any) {
  const { id, review } = props;
  const token = localStorage.getItem('token');
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState('');
  const [editCommentId, setEditCommentId] = useState<number | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const userid = useSelector((state: RootState) => state.user.userId);
  console.log('BComment: ', userid);
  useEffect(() => {
    const transformedComments = review
    .filter((item: any) => item.review !== null)
    .map((item: any) => ({
      id: item.id,
      author: {
        name: item.username,
        avatar: '/placeholder.svg',
      },
      rating: item.rating,
      content: item.review as Text,
      date: format(new Date(item.createdAt), "MMMM dd, yyyy"),
      userId: item.userId
    }));

    setComments(transformedComments);
  }, [review]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    if (token) {
      const response = await createUserReview(newComment, id, token);
      const comment: Comment = {
        id: response.id,
        author: {
          name: response.username,
          avatar: '/placeholder.svg',
        },
        rating: response.rating || 0,
        content: response.review,
        date: format(new Date(response.createdAt), "MMMM dd, yyyy"),
        userId: response.userId
      };
      setComments([comment, ...comments]);
      setNewComment('');
    }
  };

  const handleEdit = ( content: string, commentId: number,) => {
    setEditCommentId(commentId);
    setEditingComment(content);
  };

  const handleDelete = async (commentId: number) => {
    if(!token) return;
    try {
      await deleteUserReview(commentId, token);
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };
  const handleSaveChanges = async () => {
    if (!editingComment.trim() || editCommentId === null) return;
    if (token) {
      const response = await createUserReview(editingComment, id, token); // Assume API exists
      console.log('handleEdit: ', response);
      const updatedComments = comments.map((comment) =>
        comment.id === editCommentId
          ? { ...comment, content: response.review, date: format(new Date(response.updatedAt), "MMMM dd, yyyy") }
          : comment
      );
      setComments(updatedComments);
      setEditCommentId(null);
      setEditingComment('');
    }
  };

  return (
    <div className="space-y-8 text-left mt-5">
      {token && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            {editCommentId ? 'Edit Your Review' : 'Community Reviews'}
          </h2>
          <div className="flex gap-4">
            <Textarea
              placeholder={editCommentId ? 'Edit your review...' : 'Write your review...'}
              value={editCommentId ? editingComment : newComment}
              onChange={(e) => (editCommentId ? setEditingComment(e.target.value) : setNewComment(e.target.value))}
              className="min-h-[100px] max-w-xl"
            />
          </div>
          <div className="flex justify-start">
            <Button
              onClick={editCommentId ? handleSaveChanges : handleAddComment}
              disabled={!(editCommentId ? editingComment.trim() : newComment.trim())}
            >
              {editCommentId ? 'Save Changes' : 'Add Review'}
            </Button>
          </div>
        </div>
      )}
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
                {comment.userId === userid && (
                <div className="mt-2">
                  <Button
                    variant="outline"
                    className="mr-2"
                    onClick={() => handleEdit(comment.content, comment.id,)}
                  >
                    Edit
                  </Button>
                  {/* <Button onClick={() => handleDelete(comment.id)} variant="outline" className="text-red-500">
                    Delete
                  </Button> */}
                </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
}
