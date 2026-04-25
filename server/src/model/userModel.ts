import mongoose from 'mongoose';
import { getServerBaseUrl } from '../utils/serverBaseUrl';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: {
    type: String,
    default: () =>
      `${getServerBaseUrl()}/public/photos/default-profile-picture.jpg`,
  },
  tokens: { type: [String] },
});

export type UserDocument = mongoose.InferSchemaType<typeof userSchema> &
  mongoose.Document;

export const user = mongoose.model<UserDocument>('User', userSchema);
