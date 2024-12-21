export interface Comment {
  id: number;
  author: {
    name: string;
    avatar: string;
  };
  rating: number;
  content: Text;
  date: string;
}

export interface CommentDB {
  id: number;
  rating: number;
  review: Text;
  userId: number;
  bookId: number;
  createdAt: Date;
  updatedAt: Date;
  username: string;
}
