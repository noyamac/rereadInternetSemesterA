import express from 'express';
import booksController from '../controllers/booksController';
import authMiddleware from '../middlewares/authMiddleware';

export const bookRouter = express.Router();

/**
 * @swagger
 * /book:
 *   get:
 *     summary: Get all books with pagination
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Number of books per page
 *     responses:
 *       200:
 *         description: List of books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       500:
 *         description: Server error retrieving books
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
bookRouter.get('/', authMiddleware, booksController.getAll.bind(booksController));

/**
 * @swagger
 * /book/{id}:
 *   get:
 *     summary: Get a book by id
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book identifier
 *     responses:
 *       200:
 *         description: Book details returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error retrieving book
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
bookRouter.get(
  '/:id',
  authMiddleware,
  booksController.getById.bind(booksController),
);

/**
 * @swagger
 * /book:
 *   post:
 *     summary: Create a new book listing
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *               - price
 *               - summary
 *               - description
 *             properties:
 *               imageUrl:
 *                 type: string
 *                 description: Optional book image URL
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               price:
 *                 type: number
 *               summary:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Book created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         description: Validation or creation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
bookRouter.post(
  '/',
  authMiddleware,
  booksController.create.bind(booksController),
);

/**
 * @swagger
 * /book/{id}:
 *   delete:
 *     summary: Delete a book by id
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book identifier
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       403:
 *         description: Forbidden - user cannot delete this book
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error deleting book
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
bookRouter.delete(
  '/:id',
  authMiddleware,
  booksController.delete.bind(booksController),
);

/**
 * @swagger
 * /book/{id}:
 *   put:
 *     summary: Update a book by id
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book identifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               imageUrl:
 *                 type: string
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               price:
 *                 type: number
 *               summary:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Book updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       403:
 *         description: Forbidden - cannot update this book
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error updating book
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
bookRouter.put(
  '/:id',
  authMiddleware,
  booksController.update.bind(booksController),
);

/**
 * @swagger
 * /book/{sellerId}/userBooks:
 *   get:
 *     summary: Get books by a specific seller
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sellerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Seller user ID
 *     responses:
 *       200:
 *         description: Seller books returned
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       400:
 *         description: Invalid seller ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error retrieving seller books
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
bookRouter.get(
  '/:sellerId/userBooks',
  authMiddleware,
  booksController.getbookByUserId.bind(booksController),
);

/**
 * @swagger
 * /book/{bookId}/like:
 *   post:
 *     summary: Toggle like for a book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: Book identifier
 *     responses:
 *       200:
 *         description: Book like toggled successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error toggling like
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
bookRouter.post(
  '/:bookId/like',
  authMiddleware,
  booksController.likeBook.bind(booksController),
);

/**
 * @swagger
 * /book/search:
 *   post:
 *     summary: Search books with regular text matching
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SearchRequest'
 *     responses:
 *       200:
 *         description: Search results returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Book'
 *       400:
 *         description: Invalid search query
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error during search
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
bookRouter.post(
  '/search',
  authMiddleware,
  booksController.regularSearch.bind(booksController),
);

/**
 * @swagger
 * /book/ai-search:
 *   post:
 *     summary: Search books using AI-expanded keywords
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SearchRequest'
 *     responses:
 *       200:
 *         description: AI search results returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Book'
 *       400:
 *         description: Invalid search query
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error during AI search
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
bookRouter.post(
  '/ai-search',
  authMiddleware,
  booksController.aiSearch.bind(booksController),
);
