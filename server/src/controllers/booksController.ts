import { Response } from 'express';
import mongoose from 'mongoose';
import { book, BookDocument } from '../model/bookModel';
import { AuthRequest } from '../utils/types/auth';
import baseController from './baseController';

class BooksController extends baseController<BookDocument> {
  constructor() {
    super(book);
  }

  async getAll(req: AuthRequest, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    try {
      const data = await this.model.find().skip(skip).limit(limit);
      res.json(data);
    } catch (err) {
      res.status(500).send({ error: 'error receiving data', err });
    }
  }

  async create(req: AuthRequest, res: Response) {
    const userId = req.user?._id;
    req.body.sellerId = userId;
    req.body.date = new Date();
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

  async likeBook(req: AuthRequest, res: Response) {
    const bookId = req.params.bookId;
    const userId = req.user?._id;

    try {
      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid or missing User ID' });
      }

      const userIdMongo: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(
        userId,
      );
      const currBook = await book.findById(bookId);
      if (!currBook) {
        res.status(404).json({ error: 'Book not found' });
        return;
      }

      if (!currBook.likes) {
        currBook.likes = [];
      }

      const likeIndex = currBook.likes.indexOf(userIdMongo);
      if (likeIndex > -1) {
        currBook.likes.splice(likeIndex, 1);
      } else {
        currBook.likes.push(userIdMongo);
      }

      await currBook.save();
      res.json(currBook);
    } catch (err) {
      res.status(500).json({ error: 'Error liking book', err });
    }
  }
}

export default new BooksController();
