import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  imageUrl: { type: String },
  title: { type: String, required: true },
  author: { type: String, required: true },
  price: { type: Number, required: true },
  summary: { type: String, required: true },
  comments: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Comment',
    default: [],
  },
  description: { type: String, required: true },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
  date: { type: Date, required: true },
});

bookSchema.index(
  {
    title: 'text',
    author: 'text',
    summary: 'text',
  },
  {
    weights: {
      title: 10,
      author: 5,
      summary: 1,
    },
  },
);

export type BookDocument = mongoose.InferSchemaType<typeof bookSchema> &
  mongoose.Document;

export const book = mongoose.model<BookDocument>('Book', bookSchema);
