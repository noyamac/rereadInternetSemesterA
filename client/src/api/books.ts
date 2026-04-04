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
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWI4MTJkNDRiODUzZjQ2ZGQ2OTEwZTUiLCJpYXQiOjE3NzUzMTQwMjIsImV4cCI6MTc3NTMxNzYyMn0.OW5s1baADMpP7N2wXaAQx2bwulmeMb7o44tT87wUF20`,
          },
        },
      )
      .then((r) => r.data),
};

//TODO: replace with real user ID from token
const parseBooks = (data: any[]): BookPost[] => {
  return data.map((book: any) => ({
    ...book,
    isLiked: book.likes?.includes('69b812d44b853f46dd6910e5'),
    likes: book.likes?.length || 0,
  }));
};
