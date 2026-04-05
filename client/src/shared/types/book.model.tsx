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
