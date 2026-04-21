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

    const { username, profilePicture } = req.body as {
      username?: string;
      profilePicture?: string;
    };

    try {
      const updateData: {
        username?: string;
        profilePicture?: string;
      } = {};

      if (typeof username === 'string') {
        updateData.username = username;
      }
      if (typeof profilePicture === 'string') {
        updateData.profilePicture = profilePicture;
      }

      const updatedUser = await user.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
        },
      );

      if (!updatedUser) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        profilePicture: updatedUser.profilePicture,
      });
    } catch (error) {
      res.status(500).json({
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
      });
    }
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
