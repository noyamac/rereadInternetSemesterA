import express from 'express';
import booksController from '../controllers/booksController';
import authMiddleware from '../middlewares/authMiddleware';

export const bookRouter = express.Router();

bookRouter.get('/', booksController.getAll.bind(booksController));

bookRouter.get(
  '/:id',
  authMiddleware,
  booksController.getById.bind(booksController),
);

bookRouter.post(
  '/',
  authMiddleware,
  booksController.create.bind(booksController),
);

bookRouter.delete(
  '/:id',
  authMiddleware,
  booksController.delete.bind(booksController),
);

bookRouter.put(
  '/:id',
  authMiddleware,
  booksController.update.bind(booksController),
);

bookRouter.post(
  '/:bookId/like',
  authMiddleware,
  booksController.likeBook.bind(booksController),
);