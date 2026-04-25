import request from 'supertest';
import mongoose from 'mongoose';
import { Express } from 'express';
import { initApp } from '../index';
import { book } from '../model/bookModel';
import { user } from '../model/userModel';
import { userMock, bookMocks } from './testMocks';

let app: Express;
let accessToken: string;
let userId: string;

beforeAll(async () => {
  app = await initApp();
  await book.deleteMany();
  await user.deleteMany();

  const registerResponse = await request(app).post('/auth/register').send(userMock);
  accessToken = registerResponse.body.tokens.token;

  const savedUser = await user.findOne({ email: userMock.email });
  userId = savedUser!._id.toString();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Books API', () => {
  test('Get all books - no books uploaded', async () => {
    const res = await request(app).get('/book');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('Create book', async () => {
    const res = await request(app)
      .post('/book')
      .set('Authorization', 'Bearer ' + accessToken)
      .send(bookMocks[0]);

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe(bookMocks[0].title);
    expect(res.body.author).toBe(bookMocks[0].author);
    expect(res.body.sellerId).toBe(userId);
  });

  test('Create book - no auth', async () => {
    const res = await request(app).post('/book').send(bookMocks[0]);

    expect(res.statusCode).toBe(401);
  });

  test('Create book - missing fields', async () => {
    const res = await request(app)
      .post('/book')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({ title: 'Only title' });

    expect(res.statusCode).toBe(500);
  });

  test('Get all books', async () => {
    const res = await request(app).get('/book');

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });

  test('Get book by ID', async () => {
    const createRes = await request(app)
      .post('/book')
      .set('Authorization', 'Bearer ' + accessToken)
      .send(bookMocks[1]);
    const bookId = createRes.body._id;

    const res = await request(app)
      .get('/book/' + bookId)
      .set('Authorization', 'Bearer ' + accessToken);

    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(bookId);
    expect(res.body.title).toBe(bookMocks[1].title);
  });

  test('Get book by ID - not found', async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .get('/book/' + fakeId)
      .set('Authorization', 'Bearer ' + accessToken);

    expect(res.statusCode).toBe(404);
  });

  test('Get books by userId', async () => {
    const res = await request(app)
      .get('/book/' + userId + '/userBooks')
      .set('Authorization', 'Bearer ' + accessToken);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(res.body[0].sellerId).toEqual({
      _id: userId,
      username: 'testuser',
    });
  });

  test('Get books by user - invalid ID', async () => {
    const res = await request(app)
      .get('/book/wrongId/userBooks')
      .set('Authorization', 'Bearer ' + accessToken);

    expect(res.statusCode).toBe(400);
  });

  test('Update book', async () => {
    const createRes = await request(app)
      .post('/book')
      .set('Authorization', 'Bearer ' + accessToken)
      .send(bookMocks[0]);
    const bookId = createRes.body._id;

    const res = await request(app)
      .put('/book/' + bookId)
      .set('Authorization', 'Bearer ' + accessToken)
      .send({ title: 'Updated Title' });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Updated Title');
  });

  test('Update book - forbidden (different user)', async () => {
    const createRes = await request(app)
      .post('/book')
      .set('Authorization', 'Bearer ' + accessToken)
      .send(bookMocks[0]);
    const bookId = createRes.body._id;

    const otherUserRes = await request(app).post('/auth/register').send({
      username: 'other',
      email: 'other@test.com',
      password: 'pass123',
    });
    const otherToken = otherUserRes.body.tokens.token;

    const res = await request(app)
      .put('/book/' + bookId)
      .set('Authorization', 'Bearer ' + otherToken)
      .send({ title: 'Hacked Title' });

    expect(res.statusCode).toBe(403);
  });

  test('Like book', async () => {
    const createRes = await request(app)
      .post('/book')
      .set('Authorization', 'Bearer ' + accessToken)
      .send(bookMocks[0]);
    const bookId = createRes.body._id;

    const res = await request(app)
      .post('/book/' + bookId + '/like')
      .set('Authorization', 'Bearer ' + accessToken);

    expect(res.statusCode).toBe(200);
    expect(res.body.likes).toContain(userId);
  });

  test('Unlike book', async () => {
    const createRes = await request(app)
      .post('/book')
      .set('Authorization', 'Bearer ' + accessToken)
      .send(bookMocks[0]);
    const bookId = createRes.body._id;

    await request(app)
      .post('/book/' + bookId + '/like')
      .set('Authorization', 'Bearer ' + accessToken);

    const res = await request(app)
      .post('/book/' + bookId + '/like')
      .set('Authorization', 'Bearer ' + accessToken);

    expect(res.statusCode).toBe(200);
    expect(res.body.likes).not.toContain(userId);
  });

  test('Delete book', async () => {
    const createRes = await request(app)
      .post('/book')
      .set('Authorization', 'Bearer ' + accessToken)
      .send(bookMocks[1]);
    const bookId = createRes.body._id;

    const res = await request(app)
      .delete('/book/' + bookId)
      .set('Authorization', 'Bearer ' + accessToken);

    expect(res.statusCode).toBe(200);

    const getRes = await request(app)
      .get('/book/' + bookId)
      .set('Authorization', 'Bearer ' + accessToken);
    expect(getRes.statusCode).toBe(404);
  });

  test('Delete book - forbidden (different user)', async () => {
    const createRes = await request(app)
      .post('/book')
      .set('Authorization', 'Bearer ' + accessToken)
      .send(bookMocks[0]);
    const bookId = createRes.body._id;

    const otherUserRes = await request(app).post('/auth/register').send({
      username: 'other2',
      email: 'other2@test.com',
      password: 'pass123',
    });
    const otherToken = otherUserRes.body.tokens.token;

    const res = await request(app)
      .delete('/book/' + bookId)
      .set('Authorization', 'Bearer ' + otherToken);

    expect(res.statusCode).toBe(403);
  });
});
