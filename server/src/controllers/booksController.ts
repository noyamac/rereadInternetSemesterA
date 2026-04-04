import { Response } from "express";
import { book, BookDocument } from "../model/bookModel";
import baseController from "./baseController";
import { AuthRequest } from "../utils/types/auth";

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
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    return super.update(req, res);
  }

  async delete(req: AuthRequest, res: Response) {
    const userId = req.user?._id;
    const currBook = await book.findById(req.params.id);
    if (currBook?.sellerId.toString() !== userId) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    return super.delete(req, res);
  }
}

export default new BooksController();
