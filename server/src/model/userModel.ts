import mongoose from 'mongoose';

const serverBaseUrl = (): string => {
  const domain = process.env.DOMAIN_BASE || 'localhost';
  const port = process.env.PORT || '8080';
  return `http://${domain}:${port}`;
};

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: {
    type: String,
    default: () =>
      `${serverBaseUrl()}/public/photos/default-profile-picture.jpg`,
  },
  tokens: { type: [String] },
});

export type UserDocument = mongoose.InferSchemaType<typeof userSchema> &
  mongoose.Document;

export const user = mongoose.model<UserDocument>('User', userSchema);
