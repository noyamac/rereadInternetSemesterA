import { Response } from 'express';
import { comment, CommentDocument } from '../model/commentModel';
import { book } from '../model/bookModel';
import baseController from './baseController';
import { AuthRequest } from '../utils/types/auth';

class CommentsController extends baseController<CommentDocument> {
  constructor() {
    super(comment);
  }

  async getAll(req: AuthRequest, res: Response) {
    const filter = req.query;

    try {
      const data = await comment.find(filter).populate('userId', 'username');
      res.json(data);
    } catch (err) {
      res.status(500).send({ error: 'error receiving data', err });
    }
  }

  async create(req: AuthRequest, res: Response) {
    const userId = req.user?._id;
    const { bookId, content } = req.body;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!bookId || !content) {
      res.status(400).json({ error: 'Missing bookId or content' });
      return;
    }

    const foundBook = await book.findById(bookId);
    if (!foundBook) {
      res.status(404).json({ error: 'Book not found' });
      return;
    }

    req.body.userId = userId;
    req.body.date = new Date();

    const newComment = await comment.create(req.body);
    foundBook.comments.push(newComment._id);
    await foundBook.save();

    const populatedComment = await newComment.populate('userId', 'username');
    res.status(201).json(populatedComment);
  }

  async update(req: AuthRequest, res: Response) {
    const userId = req.user?._id;
    const currComment = await comment.findById(req.params.id);
    if (currComment?.userId.toString() !== userId) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }
    req.body = { content: req.body.content };
    return super.update(req, res);
  }

  async delete(req: AuthRequest, res: Response) {
    const userId = req.user?._id;
    const currComment = await comment.findById(req.params.id);
    if (!currComment) {
      res.status(404).json({ error: 'Comment not found' });
      return;
    }

    if (currComment.userId.toString() !== userId) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    await book.findByIdAndUpdate(currComment.bookId, {
      $pull: { comments: currComment._id },
    });

    return super.delete(req, res);
  }
}

export default new CommentsController();
