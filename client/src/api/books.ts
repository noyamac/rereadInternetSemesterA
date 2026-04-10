import axios from 'axios';
import type { BookComment, BookPost } from '../shared/types/book.model';

const api = axios.create({
  baseURL: '/books',
  headers: { 'Content-Type': 'application/json' },
});

type ServerBook = Omit<
  BookPost,
  'likes' | 'isLiked' | 'sellerId' | 'sellerUsername'
> & {
  likes?: string[];
  sellerId: string | { _id: string; username?: string };
};

type ServerComment = Omit<BookComment, 'userId' | 'username'> & {
  userId: { _id: string; username?: string };
};

export const booksApi = {
  books: (page: number = 1, limit: number = 10) =>
    api
      .get(`/book?page=${page}&limit=${limit}`)
      .then((r) => parseBooks(r.data)),

  commentsByBook: (bookId: string) =>
    api
      .get(`/comment?bookId=${bookId}`)
      .then((r) =>
        (r.data as ServerComment[]).map((comment) => normalizeComment(comment)),
      ),

  createComment: (bookId: string, content: string) =>
    api
      .post(
        '/comment',
        { bookId, content },
        {
          // TODO: Replace temporary token with authenticated user token
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWQxMTkyZjU0YWMwMjQzZTMyYWY3YmQiLCJpYXQiOjE3NzU0MDU2NDcsImV4cCI6MTc3NTQwOTI0N30.ZSXR6AzghEjEx-xYVeLFmmybQOjTLdCCSr0saoN89Qc`,
          },
        },
      )
      .then((r) => normalizeComment(r.data as ServerComment)),

  likeBook: (bookId: string) =>
    api
      .post(
        `/book/${bookId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWQxMTkyZjU0YWMwMjQzZTMyYWY3YmQiLCJpYXQiOjE3NzU4Mzc4MTEsImV4cCI6MTc3NTg0MTQxMX0.klA_y6ORMRZ6lv8NdZqEh7X8mLk5FU99_dcMwIdSQXE`,
          },
        },
      )
      .then((r) => r.data),

  getUserBooks: (sellerId: string, token: string) =>
    api
      .get(`/book/${sellerId}/userBooks`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((r) => parseBooks(r.data)),

  deleteBook: (bookId: string, token: string) =>
    api.delete(`/book/${bookId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  updateBook: (
    bookId: string,
    token: string,
    fields: Partial<
      Pick<BookPost, 'title' | 'author' | 'price' | 'description' | 'summery'>
    >,
  ) =>
    api
      .put(`/book/${bookId}`, fields, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((r) => parseBooks([r.data as ServerBook])[0]),
};

//TODO: replace with real user ID from token
const parseBooks = (data: ServerBook[]): BookPost[] => {
  return data.map((book) => ({
    ...book,
    sellerId:
      typeof book.sellerId === 'string' ? book.sellerId : book.sellerId._id,
    sellerUsername:
      typeof book.sellerId === 'string' ? undefined : book.sellerId.username,
    isLiked: book.likes?.includes('69b812d44b853f46dd6910e5') ?? false,
    likes: book.likes?.length || 0,
  }));
};

const normalizeComment = (comment: ServerComment): BookComment => ({
  ...comment,
  userId: comment.userId._id,
  username: comment.userId.username,
});
