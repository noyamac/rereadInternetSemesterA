import express from 'express';
import commentsController from '../controllers/commentsController';
import authMiddleware from '../middlewares/authMiddleware';

export const commentRouter = express.Router();

/**
 * @swagger
 * /comment:
 *   get:
 *     summary: Get all comments
 *     tags: [Comments]
 *     parameters:
 *       - in: query
 *         name: bookId
 *         schema:
 *           type: string
 *         description: Optional book ID filter
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Optional user ID filter
 *     responses:
 *       200:
 *         description: List of comments returned
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       500:
 *         description: Server error fetching comments
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
commentRouter.get('/', commentsController.getAll.bind(commentsController));

/**
 * @swagger
 * /comment/{id}:
 *   get:
 *     summary: Get a comment by id
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment identifier
 *     responses:
 *       200:
 *         description: Comment returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error fetching comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
commentRouter.get('/:id', commentsController.getById.bind(commentsController));

/**
 * @swagger
 * /comment:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookId
 *               - content
 *             properties:
 *               bookId:
 *                 type: string
 *                 description: ID of the book being commented on
 *               content:
 *                 type: string
 *                 description: Comment content
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Missing required fields or invalid request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - authentication required
 *       404:
 *         description: Book not found
 */
commentRouter.post(
  '/',
  authMiddleware,
  commentsController.create.bind(commentsController),
);

/**
 * @swagger
 * /comment/{id}:
 *   put:
 *     summary: Update a comment by id
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment identifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: Updated comment content
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       403:
 *         description: Forbidden - cannot edit this comment
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error updating comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
commentRouter.put(
  '/:id',
  authMiddleware,
  commentsController.update.bind(commentsController),
);

/**
 * @swagger
 * /comment/{id}:
 *   delete:
 *     summary: Delete a comment by id
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment identifier
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       403:
 *         description: Forbidden - cannot delete this comment
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error deleting comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
commentRouter.delete(
  '/:id',
  authMiddleware,
  commentsController.delete.bind(commentsController),
);
