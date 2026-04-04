import { Response } from 'express';
import mongoose from 'mongoose';
import { book, BookDocument } from '../model/bookModel';
import { AuthRequest } from '../utils/types/auth';
import baseController from './baseController';

class BooksController extends baseController<BookDocument> {
  constructor() {
    super(book);
  }

  async create(req: AuthRequest, res: Response) {
    const userId = req.user?._id;
    req.body.sellerId = userId;
    return super.create(req, res);
  }

  async update(req: AuthRequest, res: Response) {
    const userId = req.user?._id;
    const currBook = await book.findById(req.params.id);
    if (currBook?.sellerId.toString() !== userId) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }
    return super.update(req, res);
  }

  async delete(req: AuthRequest, res: Response) {
    const userId = req.user?._id;
    const currBook = await book.findById(req.params.id);
    if (currBook?.sellerId.toString() !== userId) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }
    return super.delete(req, res);
  }

  async getbookByUserId(req: AuthRequest, res: Response) {
    try {
      const userId = req.params.sellerId;

      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid or missing User ID' });
      }

      const userIdMongo: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(
        userId,
      );
      const userBooks = await book.find({ sellerId: userIdMongo });
      res.json(userBooks);
    } catch (error) {
      res.status(500).json({
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
      });
    }
  }
}

export default new BooksController();
