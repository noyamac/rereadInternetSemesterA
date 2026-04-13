export interface BookComment {
  _id: string;
  userId: string;
  username?: string;
  bookId: string;
  content: string;
  date: string;
}

export interface BookPost {
  _id: string;
  title: string;
  author: string;
  price: number;
  imageUrl: string;
  sellerId: string;
  sellerUsername?: string;
  description: string;
  summery: string;
  comments: BookComment[];
  likes: number;
  isLiked: boolean;
}

export interface BookCreatePayload {
  title: string;
  author: string;
  price: number;
  imageUrl?: string;
  description: string;
  summery?: string;
  date: string;
}
