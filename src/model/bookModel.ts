import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  imageUrl: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  price: { type: Number, required: true },
  summery: { type: String, required: true },
  comments: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'comment',
    required: true,
  },
  description: { type: String },
  date: { type: Date, required: true },
});

export type BookDocument = mongoose.InferSchemaType<typeof bookSchema> &
  mongoose.Document;

export const book = mongoose.model<BookDocument>('Book', bookSchema);
