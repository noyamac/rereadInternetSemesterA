import axios from 'axios';
import type { BookCreatePayload } from '../shared/types/book.model';
import type { BookPost } from '../shared/types/book.model';

const api = axios.create({
  baseURL: '/book',
  headers: { 'Content-Type': 'application/json' },
});

type ServerBook = Omit<BookPost, 'likes' | 'isLiked' | 'sellerId'> & {
  likes?: string[];
  sellerId: string | { _id: string; username?: string };
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

  likeBook: (bookId: string) =>
    api
      .post(
        `/${bookId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWQxMTkyZjU0YWMwMjQzZTMyYWY3YmQiLCJpYXQiOjE3NzU4NDY2ODEsImV4cCI6MTc3NTg1MDI4MX0.dfSsb_IihrD9v-XFPhY70NT_n3AewW2EmQM2QKQLseo`,
          },
        },
      )
      .then((r) => r.data),

  getUserBooks: (sellerId: string, token: string) =>
    api
      .get(`/${sellerId}/userBooks`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((r) => parseBooks(r.data)),
};

//TODO: replace with real user ID from token
const parseBooks = (data: ServerBook[]): BookPost[] => {
  return data.map((book) => ({
    ...book,
    sellerId:
      typeof book.sellerId === 'string' ? book.sellerId : book.sellerId._id,
    isLiked: book.likes?.includes('69b812d44b853f46dd6910e5') ?? false,
    likes: book.likes?.length || 0,
  }));
};
