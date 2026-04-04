import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String },
  tokens: { type: [String] },
});

export type UserDocument = mongoose.InferSchemaType<typeof userSchema> &
  mongoose.Document;

export const user = mongoose.model<UserDocument>('User', userSchema);
