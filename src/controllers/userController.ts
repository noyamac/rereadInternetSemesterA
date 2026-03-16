import { Response } from 'express';
import { AuthRequest } from '../utils/types/auth';
import { user, UserDocument } from '../model/userModel';
import baseController from './baseController';

class UsersController extends baseController<UserDocument> {
  constructor() {
    super(user);
  }

  async update(req: AuthRequest, res: Response) {
    const userId = req.user?._id;
    const currUser = await user.findById(req.params.id);
    if (currUser?._id.toString() !== userId) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }
    return super.update(req, res);
  }

  async delete(req: AuthRequest, res: Response) {
    const userId = req.user?._id;
    const currUser = await user.findById(req.params.id);
    if (currUser?._id.toString() !== userId) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }
    return super.delete(req, res);
  }
}

export default new UsersController();
