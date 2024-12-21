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

export interface BookBD {
  id?: number;
  title: string;
  details: string;
  thumbnailUrl: string;
  AuthorName: string;
  PublisherName: string;
  createdAt: string;
  genreName: string[];
}
