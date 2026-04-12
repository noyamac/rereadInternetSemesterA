import axios from 'axios';
import type { BookComment } from '../shared/types/book.model';

const commentApi = axios.create({
  baseURL: '/comment',
  headers: { 'Content-Type': 'application/json' },
});

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
      .post(
        '/',
        { bookId, content },
        {
          // TODO: Replace temporary token with authenticated user token
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWQxMTkyZjU0YWMwMjQzZTMyYWY3YmQiLCJpYXQiOjE3NzU4NDY2ODEsImV4cCI6MTc3NTg1MDI4MX0.dfSsb_IihrD9v-XFPhY70NT_n3AewW2EmQM2QKQLseo`,
          },
        },
      )
      .then((response) => normalizeComment(response.data as ServerComment)),
};

const normalizeComment = (comment: ServerComment): BookComment => ({
  ...comment,
  userId: comment.userId._id,
  username: comment.userId.username,
});
