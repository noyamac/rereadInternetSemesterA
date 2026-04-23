import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Tokens } from '../utils/types/tokens';
import { user } from '../model/userModel';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client();

const serverBaseUrl = (): string => {
  const domain = process.env.DOMAIN_BASE || 'localhost';
  const port = process.env.PORT || '8080';
  return `http://${domain}:${port}`;
};

const DEFAULT_PROFILE_PICTURE = `${serverBaseUrl()}/public/photos/default-profile-picture.jpg`;

const generateToken = (userId: string): Tokens => {
  const secret: string = process.env.JWT_SECRET || 'secretkey';
  const refreshTokenSecret: string =
    process.env.JWT_REFRESH_TOKEN_SECRET || 'secretkey';

  const exp: number = parseInt(process.env.JWT_EXPIRES_IN || '3600');
  const token: string = jwt.sign({ userId: userId }, secret, {
    expiresIn: exp,
  });
  const refreshexp: number = parseInt(
    process.env.JWT_REFRESH_EXPIRES_IN || '86400',
  );

  const refreshToken: string = jwt.sign(
    { userId: userId },
    refreshTokenSecret,
    {
      expiresIn: refreshexp,
    },
  );

  return { token, refreshToken };
};

const register = async (req: Request, res: Response) => {
  const { username, email, password, profilePicture } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ error: 'Username, email and password are required' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);

    const newUser = await user.create({
      username,
      email,
      password: encryptedPassword,
      profilePicture: profilePicture || DEFAULT_PROFILE_PICTURE,
    });

    const tokens: Tokens = generateToken(newUser._id.toString());

    newUser.tokens.push(tokens.refreshToken);

    await newUser.save();

    res.status(201).json({ tokens });
  } catch (err) {
    return res
      .status(400)
      .json({ error: 'Failed to register the user', details: err });
  }
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const currUser = await user.findOne({ email });
    if (!currUser) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const matchPassword = await bcrypt.compare(password, currUser.password);
    if (!matchPassword) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const tokens: Tokens = generateToken(currUser._id.toString());

    currUser.tokens.push(tokens.refreshToken);

    await currUser.save();

    res.status(201).json({ tokens });
  } catch (err) {
    return res.status(400).json({ error: 'Failed to login', details: err });
  }
};

const logout = async (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'];
  const refreshToken = authHeader && authHeader.split(' ')[1];

  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token is required' });
  }

  const secret: string = process.env.JWT_REFRESH_TOKEN_SECRET || 'secretkey';

  try {
    const decoded: any = jwt.verify(refreshToken, secret);

    const currUser = await user.findById(decoded.userId);

    if (!currUser) {
      return res.status(400).json({ error: 'Failed to logout' });
    }

    if (!currUser.tokens.includes(refreshToken)) {
      currUser.tokens = [];
      await currUser.save();
      return res.status(400).json({ error: 'Failed to logout' });
    }

    currUser.tokens = currUser.tokens.filter((token) => token !== refreshToken);
    await currUser.save();
    return res.status(200).send();
  } catch (err) {
    return res.status(400).json({ error: 'Failed to logout', details: err });
  }
};

const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token is required' });
  }

  try {
    const secret: string = process.env.JWT_REFRESH_TOKEN_SECRET || 'secretkey';
    const decoded: any = jwt.verify(refreshToken, secret);

    const currUser = await user.findById(decoded.userId);
    if (!currUser) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    if (!currUser.tokens.includes(refreshToken)) {
      currUser.tokens = [];
      await currUser.save();

      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const tokens = generateToken(currUser._id.toString());
    currUser.tokens = currUser.tokens.filter((token) => token !== refreshToken);
    currUser.tokens.push(tokens.refreshToken);
    await currUser.save();

    res.status(200).json(tokens);
  } catch (err) {
    return res
      .status(400)
      .json({ error: 'Failed to refresh token', details: err });
  }
};

const googleLogin = async (req: Request, res: Response) => {
  console.log(
    'Received Google login request with credential:',
    req.body.credential,
  );
  try {
    const ticket = await client.verifyIdToken({
      idToken: req.body.credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload?.email;

    if (!email) {
      return res.status(400).json({ error: 'Email not found in Google token' });
    }

    let currUser = await user.findOne({ email });
    console.log('Google login - found user:', currUser);
    if (!currUser) {
      currUser = await user.create({
        username: payload?.name || 'Google User',
        email,
        password: ' ',
        profilePicture: payload?.picture || DEFAULT_PROFILE_PICTURE,
      });
    }
    const tokens: Tokens = generateToken(currUser._id.toString());
    currUser.tokens.push(tokens.refreshToken);
    await currUser.save();
    console.log('Google login - existing user logged in:', currUser);
    res.status(200).json({ tokens });
  } catch (err) {
    return res
      .status(400)
      .json({ error: 'Failed to login with Google', details: err });
  }
};

export default {
  register,
  login,
  logout,
  refreshToken,
  googleLogin,
};
