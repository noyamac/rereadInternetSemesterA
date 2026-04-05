export interface BookPost {
  _id: string;
  title: string;
  author: string;
  price: number;
  imageUrl: string;
  sellerId: string;
  description: string;
  summery: string;
  comments: Comment[];
  likes: number;
  isLiked: boolean;
}

export interface BookCreatePayload {
  title: string;
  author: string;
  price: number;
  description: string;
  summery?: string;
  imageUrl?: string;
  date: string;
}
