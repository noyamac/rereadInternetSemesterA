import request from 'supertest';
import mongoose from 'mongoose';
import { Express } from 'express';
import { initApp } from '../index';
import { user } from '../model/userModel';
import { userMock, secondUserMock } from './testMocks';

let app: Express;
let accessToken: string;
let userId: string;

beforeAll(async () => {
  app = await initApp();
  await user.deleteMany();

  const registerRes = await request(app).post('/auth/register').send(userMock);
  accessToken = registerRes.body.tokens.token;

  const savedUser = await user.findOne({ email: userMock.email });
  userId = savedUser!._id.toString();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('User API', () => {
  test('Get user by ID', async () => {
    const res = await request(app).get('/user/' + userId);

    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(userId);
    expect(res.body.username).toBe(userMock.username);
    expect(res.body.email).toBe(userMock.email);
    expect(res.body.password).not.toBe(userMock.password);
  });

  test('Get user by ID - not found', async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app).get('/user/' + fakeId);

    expect(res.statusCode).toBe(404);
  });

  test('Update user', async () => {
    const res = await request(app)
      .put('/user/' + userId)
      .set('Authorization', 'Bearer ' + accessToken)
      .send({ username: 'updatedusername' });

    expect(res.statusCode).toBe(200);
    expect(res.body.username).toBe('updatedusername');
    expect(res.body.email).toBe(userMock.email);
  });

  test('Update user - no auth', async () => {
    const res = await request(app)
      .put('/user/' + userId)
      .send({ username: 'newUsername' });

    expect(res.statusCode).toBe(401);
  });

  test('Update user - forbidden (different user)', async () => {
    const otherRes = await request(app)
      .post('/auth/register')
      .send(secondUserMock);
    const otherToken = otherRes.body.tokens.token;

    const res = await request(app)
      .put('/user/' + userId)
      .set('Authorization', 'Bearer ' + otherToken)
      .send({ username: 'hackedname' });

    expect(res.statusCode).toBe(403);
  });

});
