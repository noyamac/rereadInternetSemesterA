import express from 'express';
import usersController from '../controllers/userController';
import authMiddleware from '../middlewares/authMiddleware';

export const userRouter = express.Router();

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Get user details by id
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User identifier
 *     responses:
 *       200:
 *         description: User profile returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: User not found
 *       403:
 *         description: Forbidden - cannot get another user's profile
 *       500:
 *         description: Server error fetching user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
userRouter.get('/:id', authMiddleware, usersController.getById.bind(usersController));

/**
 * @swagger
 * /user/{id}:
 *   put:
 *     summary: Update a user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User identifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               profilePicture:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Forbidden - cannot update another user
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error updating user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
userRouter.put(
  '/:id',
  authMiddleware,
  usersController.update.bind(usersController),
);

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Delete a user account
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User identifier
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       403:
 *         description: Forbidden - cannot delete another user
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error deleting user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
userRouter.delete(
  '/:id',
  authMiddleware,
  usersController.delete.bind(usersController),
);

export default userRouter;
