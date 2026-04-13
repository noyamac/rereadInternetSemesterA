import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import type { BookComment } from '../shared/types/book.model';
import { getStoredAccessToken } from '../shared/utils/authToken';

const commentApi = axios.create({
  baseURL: '/comment',
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

commentApi.interceptors.request.use(attachAuthToken);

type ServerComment = Omit<BookComment, 'userId' | 'username'> & {
  userId: { _id: string; username?: string };
};

export const commentsApi = {
  commentsByBook: (bookId: string) =>
    commentApi
      .get(`/?bookId=${bookId}`)
      .then((response) =>
        (response.data as ServerComment[]).map((comment) =>
          normalizeComment(comment),
        ),
      ),

  createComment: (bookId: string, content: string) =>
    commentApi
      .post('/', { bookId, content })
      .then((response) => normalizeComment(response.data as ServerComment)),
};

const normalizeComment = (comment: ServerComment): BookComment => ({
  ...comment,
  userId: comment.userId._id,
  username: comment.userId.username,
});
