export interface Book {
  id?: number;
  title: string;
  details: string;
  thumbnailUrl: string;
  AuthorName: string;
  PublisherName: string;
  createdAt: string;
  genreId: number[];
}
