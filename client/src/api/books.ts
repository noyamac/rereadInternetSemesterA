import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import type { BookCreatePayload, BookPost } from '../shared/types/book.model';
import {
  getStoredAccessToken,
  getUserIdFromStoredAccessToken,
} from '../shared/utils/authToken';

const api = axios.create({
  baseURL: '/book',
  headers: { 'Content-Type': 'application/json' },
});

const attachAuthToken = (config: InternalAxiosRequestConfig) => {
  const token = getStoredAccessToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

api.interceptors.request.use(attachAuthToken);

type ServerBook = Omit<BookPost, 'likes' | 'isLiked' | 'sellerId'> & {
  likes?: string[];
  sellerId: string | { _id: string; username?: string };
};

export const booksApi = {
  books: (page: number = 1, limit: number = 10) =>
    api.get(`/?page=${page}&limit=${limit}`).then((r) => parseBooks(r.data)),

  createBook: (bookData: BookCreatePayload) =>
    api.post('/', bookData).then((r) => r.data),

  likeBook: (bookId: string) =>
    api.post(`/${bookId}/like`, {}).then((r) => r.data),

  getUserBooks: (sellerId: string) =>
    api.get(`/${sellerId}/userBooks`).then((r) => parseBooks(r.data)),
};

const parseBooks = (data: ServerBook[]): BookPost[] => {
  const currentUserId = getUserIdFromStoredAccessToken();

  return data.map((book) => ({
    ...book,
    sellerId:
      typeof book.sellerId === 'string' ? book.sellerId : book.sellerId._id,
    isLiked: currentUserId
      ? (book.likes?.includes(currentUserId) ?? false)
      : false,
    likes: book.likes?.length || 0,
  }));
};
