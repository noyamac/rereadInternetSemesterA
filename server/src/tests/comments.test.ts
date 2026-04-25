import request from 'supertest';
import mongoose from 'mongoose';
import { Express } from 'express';
import { initApp } from '../index';
import { comment } from '../model/commentModel';
import { book } from '../model/bookModel';
import { user } from '../model/userModel';
import { userMock, bookMocks, commentMock } from './testMocks';

let app: Express;
let accessToken: string;
let userId: string;
let bookId: string;

beforeAll(async () => {
  app = await initApp();
  await comment.deleteMany();
  await book.deleteMany();
  await user.deleteMany();

  const registerRes = await request(app).post('/auth/register').send(userMock);
  accessToken = registerRes.body.tokens.token;

  const savedUser = await user.findOne({ email: userMock.email });
  userId = savedUser!._id.toString();

  const bookRes = await request(app)
    .post('/book')
    .set('Authorization', 'Bearer ' + accessToken)
    .send(bookMocks[0]);
  bookId = bookRes.body._id;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Comments API', () => {
  test('Get all comments - no comments uploaded', async () => {
    const res = await request(app).get('/comment');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('Create comment', async () => {
    const res = await request(app)
      .post('/comment')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({ ...commentMock, bookId });

    expect(res.statusCode).toBe(201);
    expect(res.body.content).toBe(commentMock.content);
    expect(res.body.userId._id).toBe(userId);
  });

  test('Create comment - no auth', async () => {
    const res = await request(app)
      .post('/comment')
      .send({ ...commentMock, bookId });

    expect(res.statusCode).toBe(401);
  });

  test('Create comment - missing bookId', async () => {
    const res = await request(app)
      .post('/comment')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({ content: 'Great book' });

    expect(res.statusCode).toBe(400);
  });

  test('Create comment - missing content', async () => {
    const res = await request(app)
      .post('/comment')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({ bookId });

    expect(res.statusCode).toBe(400);
  });

  test('Create comment - book not found', async () => {
    const fakeBookId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .post('/comment')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({ ...commentMock, bookId: fakeBookId });

    expect(res.statusCode).toBe(404);
  });

  test('Get all comments', async () => {
    const res = await request(app).get('/comment');

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });

  test('Get comments by bookId filter', async () => {
    const res = await request(app).get('/comment?bookId=' + bookId);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(res.body[0].bookId).toBe(bookId);
  });

  test('Get comment by ID', async () => {
    const createRes = await request(app)
      .post('/comment')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({ ...commentMock, bookId });
    const commentId = createRes.body._id;

    const res = await request(app).get('/comment/' + commentId);

    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(commentId);
  });

  test('Get comment by ID - not found', async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app).get('/comment/' + fakeId);

    expect(res.statusCode).toBe(404);
  });

  test('Update comment', async () => {
    const createRes = await request(app)
      .post('/comment')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({ ...commentMock, bookId });
    const commentId = createRes.body._id;

    const res = await request(app)
      .put('/comment/' + commentId)
      .set('Authorization', 'Bearer ' + accessToken)
      .send({ content: 'Updated content' });

    expect(res.statusCode).toBe(200);
    expect(res.body.content).toBe('Updated content');
  });

  test('Update comment - forbidden (different user)', async () => {
    const createRes = await request(app)
      .post('/comment')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({ ...commentMock, bookId });
    const commentId = createRes.body._id;

    const otherRes = await request(app).post('/auth/register').send({
      username: 'commentother',
      email: 'commentother@test.com',
      password: 'pass123',
    });
    const otherToken = otherRes.body.tokens.token;

    const res = await request(app)
      .put('/comment/' + commentId)
      .set('Authorization', 'Bearer ' + otherToken)
      .send({ content: 'Hacked content' });

    expect(res.statusCode).toBe(403);
  });

  test('Delete comment', async () => {
    const createRes = await request(app)
      .post('/comment')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({ ...commentMock, bookId });
    const commentId = createRes.body._id;

    const res = await request(app)
      .delete('/comment/' + commentId)
      .set('Authorization', 'Bearer ' + accessToken);

    expect(res.statusCode).toBe(200);

    const getRes = await request(app).get('/comment/' + commentId);
    expect(getRes.statusCode).toBe(404);

    const bookRes = await request(app)
      .get('/book/' + bookId)
      .set('Authorization', 'Bearer ' + accessToken);
    expect(bookRes.body.comments).not.toContain(commentId);
  });

  test('Delete comment - forbidden (different user)', async () => {
    const createRes = await request(app)
      .post('/comment')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({ ...commentMock, bookId });
    const commentId = createRes.body._id;

    const otherRes = await request(app).post('/auth/register').send({
      username: 'commentother2',
      email: 'commentother2@test.com',
      password: 'pass123',
    });
    const otherToken = otherRes.body.tokens.token;

    const res = await request(app)
      .delete('/comment/' + commentId)
      .set('Authorization', 'Bearer ' + otherToken);

    expect(res.statusCode).toBe(403);
  });
});
