import axios from 'axios';
import type { BookCreatePayload } from '../shared/types/book.model';
import type { BookComment, BookPost } from '../shared/types/book.model';

const api = axios.create({
  baseURL: '/book',
  headers: { 'Content-Type': 'application/json' },
});

type ServerBook = Omit<BookPost, 'likes' | 'isLiked'> & {
  likes?: string[];
};

type ServerComment = Omit<BookComment, 'userId' | 'username'> & {
  userId: { _id: string; username?: string };
};

export const booksApi = {
  books: (page: number = 1, limit: number = 10) =>
    api
      .get(`/?page=${page}&limit=${limit}`)
      .then((r) => parseBooks(r.data as ServerBook[])),

  createBook: (bookData: BookCreatePayload, token: string) =>
    api
      .post('/', bookData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((r) => r.data),

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
        `/${bookId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWQxMTkyZjU0YWMwMjQzZTMyYWY3YmQiLCJpYXQiOjE3NzUzODA2NTIsImV4cCI6MTc3NTM4NDI1Mn0._bm1_M4et-g6W_5ZOLbCzgYvDW1dY7z9zFlxUrzOlug`,
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
};

//TODO: replace with real user ID from token
const parseBooks = (data: ServerBook[]): BookPost[] => {
  return data.map((book) => ({
    ...book,
    isLiked: book.likes?.includes('69b812d44b853f46dd6910e5') ?? false,
    likes: book.likes?.length || 0,
  }));
};

const normalizeComment = (comment: ServerComment): BookComment => ({
  ...comment,
  userId: comment.userId._id,
  username: comment.userId.username,
});
