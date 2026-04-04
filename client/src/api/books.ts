import axios from 'axios';

const api = axios.create({
  baseURL: '/books',
  headers: { 'Content-Type': 'application/json' },
});

export const booksApi = {
  books: (page: number = 1, limit: number = 10) =>
    api.get(`/book?page=${page}&limit=${limit}`).then((r) => r.data),

  likeBook: (bookId: string) =>
    api.post(`/book/${bookId}/like`).then((r) => r.data),

  getUserBooks: (sellerId: string, token: string) =>
    api
      .get(`/book/${sellerId}/userBooks`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((r) => r.data),
};
