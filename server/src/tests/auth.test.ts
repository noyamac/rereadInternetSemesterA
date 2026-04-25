import request from 'supertest';
import mongoose from 'mongoose';
import { Express } from 'express';
import { initApp } from '../index';
import { user } from '../model/userModel';
import { userMock } from './testMocks';

let app: Express;

beforeAll(async () => {
  app = await initApp();
  await user.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Auth API', () => {
  test('Register', async () => {
    const res = await request(app).post('/auth/register').send(userMock);

    expect(res.statusCode).toBe(201);
    expect(res.body.tokens).toBeDefined();
    expect(res.body.tokens.token).toBeDefined();
    expect(res.body.tokens.refreshToken).toBeDefined();
  });

  test('Register - missing fields', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ email: 'onlyEmail@test.com' });

    expect(res.statusCode).toBe(400);
  });

  test('Register - duplicate email', async () => {
    const res = await request(app).post('/auth/register').send(userMock);

    expect(res.statusCode).toBe(409);
  });

  test('Login', async () => {
    const res = await request(app).post('/auth/login').send({
      email: userMock.email,
      password: userMock.password,
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.tokens.token).toBeDefined();
    expect(res.body.tokens.refreshToken).toBeDefined();
  });

  test('Login - wrong password', async () => {
    const res = await request(app).post('/auth/login').send({
      email: userMock.email,
      password: 'wrongpassword',
    });

    expect(res.statusCode).toBe(400);
  });

  test('Login - wrong email', async () => {
    const res = await request(app).post('/auth/login').send({
      email: 'wrongemail@test.com',
      password: userMock.password,
    });

    expect(res.statusCode).toBe(400);
  });

  test('Login - missing fields', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: userMock.email });

    expect(res.statusCode).toBe(400);
  });

  test('Refresh token', async () => {
    const loginRes = await request(app).post('/auth/login').send({
      email: userMock.email,
      password: userMock.password,
    });
    const { refreshToken } = loginRes.body.tokens;

    const res = await request(app)
      .post('/auth/refresh-token')
      .send({ refreshToken });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();
  });

  test('Refresh token - invalid token', async () => {
    const res = await request(app)
      .post('/auth/refresh-token')
      .send({ refreshToken: 'invalidtoken' });

    expect(res.statusCode).toBe(400);
  });

  test('Logout', async () => {
    const loginRes = await request(app).post('/auth/login').send({
      email: userMock.email,
      password: userMock.password,
    });
    const { refreshToken } = loginRes.body.tokens;

    const res = await request(app)
      .post('/auth/logout')
      .set('Authorization', 'Bearer ' + refreshToken);

    expect(res.statusCode).toBe(200);
  });

  test('Logout - no token', async () => {
    const res = await request(app).post('/auth/logout');

    expect(res.statusCode).toBe(400);
  });
});
