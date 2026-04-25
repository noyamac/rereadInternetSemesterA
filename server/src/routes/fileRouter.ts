import express from 'express';
const router = express.Router();
import multer from 'multer';
import { getServerBaseUrl } from '../utils/serverBaseUrl';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/photos/');
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split('.').filter(Boolean).slice(1).join('.');
    cb(null, Date.now() + '.' + ext);
  },
});
const upload = multer({ storage: storage });

const handleUpload = (req: express.Request, res: express.Response) => {
  const base = `${getServerBaseUrl()}/`;

  const filePath = req.file?.path?.replace(/\\/g, '/');
  if (!filePath) {
    res.status(400).send({ error: 'file is missing' });
    return;
  }

  const url = base + filePath;
  res.status(200).send({ url });
};

/**
 * @swagger
 * /file:
 *   post:
 *     summary: Upload a file
 *     tags: [Files]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File to upload
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UploadResponse'
 *       400:
 *         description: Missing file or invalid upload request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', upload.single('file'), handleUpload);

export default router;
