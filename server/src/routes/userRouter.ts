import express from 'express';
import usersController from '../controllers/userController';
import authMiddleware from '../middlewares/authMiddleware';

export const userRouter = express.Router();

userRouter.get('/:id', usersController.getById.bind(usersController));

userRouter.put(
  '/:id',
  authMiddleware,
  usersController.update.bind(usersController),
);

userRouter.delete(
  '/:id',
  authMiddleware,
  usersController.delete.bind(usersController),
);

export default userRouter;
