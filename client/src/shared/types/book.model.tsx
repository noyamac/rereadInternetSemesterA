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
  imageUrl?: string;
  sellerId: string;
  sellerUsername?: string;
  description: string;
  summary: string;
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
  summary?: string;
  date: string;
}

export interface EditBookFields {
  title: string;
  author: string;
  price: number;
  description: string;
  summary: string;
}
