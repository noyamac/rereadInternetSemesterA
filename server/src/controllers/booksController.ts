import { Response } from 'express';
import mongoose from 'mongoose';
import { book, BookDocument } from '../model/bookModel';
import { AIService } from '../services/aiService';
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
      const data = await this.model
        .find()
        .populate('sellerId', 'username')
        .skip(skip)
        .limit(limit);
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

    if (!currBook) {
      res.status(404).json({ error: 'Book not found' });
      return;
    }

    if (currBook.sellerId.toString() !== userId) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    try {
      const updatedBook = await book
        .findByIdAndUpdate(req.params.id, req.body, { new: true })
        .populate('sellerId', 'username');

      if (!updatedBook) {
        res.status(404).json({ error: 'Book not found' });
        return;
      }

      res.json(updatedBook);
    } catch (error) {
      res.status(500).json({
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
      });
    }
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
      const userBooks = await book
        .find({ sellerId: userIdMongo })
        .populate('sellerId', 'username');
      res.json(userBooks);
    } catch (error) {
      res.status(500).json({
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
      });
    }
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
      const populatedBook = await currBook.populate('sellerId', 'username');
      res.json(populatedBook);
    } catch (err) {
      res.status(500).json({ error: 'Error liking book', err });
    }
  }

  async regularSearch(req: AuthRequest, res: Response) {
    try {
      const { searchInput } = req.body.params;
      if (
        !searchInput ||
        searchInput.trim().length < 3 ||
        searchInput.length > 150
      ) {
        return res
          .status(400)
          .json({ message: 'Search query must be at least 3 characters long' });
      }

      const books = await this.model
        .find({
          $or: [
            { title: { $regex: searchInput, $options: 'i' } },
            { author: { $regex: searchInput, $options: 'i' } },
            { description: { $regex: searchInput, $options: 'i' } },
            { summary: { $regex: searchInput, $options: 'i' } },
          ],
        })
        .populate('sellerId', 'username')
        .limit(20);

      res.status(200).json({
        data: books,
      });
    } catch (error) {
      console.error('Regular Search Controller Error:', error);
      res.status(500).json({ message: 'Internal server error during search' });
    }
  }

  async aiSearch(req: AuthRequest, res: Response) {
    const aiService = new AIService();
    try {
      const { searchInput } = req.body.params;
      if (
        !searchInput ||
        searchInput.trim().length === 0 ||
        searchInput.length > 150
      ) {
        return res.status(400).json({ message: 'Search query is required' });
      }

      const expandedTerms = await aiService.generateResult(searchInput);
      let books = await this.model
        .find(
          { $text: { $search: expandedTerms } },
          { score: { $meta: 'textScore' } },
        )
        .populate('sellerId', 'username')
        .sort({ score: { $meta: 'textScore' } })
        .limit(20);

      if (books.length === 0) {
        books = await this.model
          .find({
            $or: [
              { title: { $regex: searchInput, $options: 'i' } },
              { author: { $regex: searchInput, $options: 'i' } },
              { description: { $regex: searchInput, $options: 'i' } },
              { summary: { $regex: searchInput, $options: 'i' } },
            ],
          })
          .populate('sellerId', 'username')
          .limit(20);
      }

      res.status(200).json({
        data: books,
      });
    } catch (error) {
      console.error('Search Controller Error:', error);
      res.status(500).json({ message: 'Internal server error during search' });
    }
  }
}

export default new BooksController();
