export const userMock = {
  username: 'testuser',
  email: 'testuser@test.com',
  password: 'password123',
};

export const secondUserMock = {
  username: 'testuser2',
  email: 'testuser2@test.com',
  password: 'password456',
};

export const bookMocks = [
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    price: 15,
    description: 'A classic novel about the American Dream.',
    summary:
      'A novel about the American Dream and the decadence of the Jazz Age.',
    date: new Date().toISOString(),
  },
  {
    title: '1984',
    author: 'George Orwell',
    price: 12,
    description: 'A dystopian novel set in a totalitarian society.',
    summary:
      'A novel about a dystopian future where the government controls everything.',
    date: new Date().toISOString(),
  },
];

export const commentMock = {
  content: 'This is a great book!',
};
