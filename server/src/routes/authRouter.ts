import express from 'express';
import authController from '../controllers/authController';

export const authRouter = express.Router();

authRouter.post('/register', authController.register);

authRouter.post('/google-login', authController.googleLogin);

authRouter.post('/login', authController.login);

authRouter.post('/logout', authController.logout);

authRouter.post('/refresh-token', authController.refreshToken);
