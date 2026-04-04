import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export type CommentDocument = mongoose.InferSchemaType<typeof commentSchema> &
  mongoose.Document;

export const comment = mongoose.model<CommentDocument>(
  'Comment',
  commentSchema,
);
