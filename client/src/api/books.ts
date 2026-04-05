import axios from 'axios';
import type { BookPost } from '../shared/types/book.model';

const api = axios.create({
  baseURL: '/books',
  headers: { 'Content-Type': 'application/json' },
});

export const booksApi = {
  books: (page: number = 1, limit: number = 10) =>
    api
      .get(`/book?page=${page}&limit=${limit}`)
      .then((r) => parseBooks(r.data)),

  likeBook: (bookId: string) =>
    api
      .post(
        `/book/${bookId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWI4MTJkNDRiODUzZjQ2ZGQ2OTEwZTUiLCJpYXQiOjE3NzUzNzk3OTQsImV4cCI6MTc3NTM4MzM5NH0.h2Cs4oUS6_H7pwGmn7FKIw-LdmL5IBaoJJ8o4gZa2Mo`,
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
const parseBooks = (data: any[]): BookPost[] => {
  return data.map((book: any) => ({
    ...book,
    isLiked: book.likes?.includes('69b812d44b853f46dd6910e5'),
    likes: book.likes?.length || 0,
  }));
};
