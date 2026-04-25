import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Reread API',
      version: '1.0.0',
      description:
        'API for the Reread application - a platform for book sharing and community',
    },
    servers: [
      {
        url: 'http://localhost:8080',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Tokens: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              description: 'JWT access token',
            },
            refreshToken: {
              type: 'string',
              description: 'JWT refresh token',
            },
          },
        },
        Book: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Book identifier',
            },
            sellerId: {
              oneOf: [
                { type: 'string' },
                {
                  type: 'object',
                  properties: {
                    _id: { type: 'string' },
                    username: { type: 'string' },
                  },
                },
              ],
              description: 'Seller id or populated seller object',
            },
            imageUrl: {
              type: 'string',
              description: 'Optional image URL',
            },
            title: {
              type: 'string',
              description: 'Book title',
            },
            author: {
              type: 'string',
              description: 'Book author',
            },
            price: {
              type: 'number',
              description: 'Book price',
            },
            summary: {
              type: 'string',
              description: 'Book summary',
            },
            description: {
              type: 'string',
              description: 'Book description',
            },
            comments: {
              type: 'array',
              items: { type: 'string' },
              description: 'Comment ids on this book',
            },
            likes: {
              type: 'array',
              items: { type: 'string' },
              description: 'User ids who liked the book',
            },
            date: {
              type: 'string',
              format: 'date-time',
              description: 'Creation date',
            },
          },
        },
        SearchRequest: {
          type: 'object',
          properties: {
            params: {
              type: 'object',
              properties: {
                searchInput: {
                  type: 'string',
                  description: 'Text input for searching books',
                },
              },
              required: ['searchInput'],
            },
          },
        },
        Comment: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Comment identifier',
            },
            userId: {
              oneOf: [
                { type: 'string' },
                {
                  type: 'object',
                  properties: {
                    _id: { type: 'string' },
                    username: { type: 'string' },
                  },
                },
              ],
              description: 'User id or populated user object',
            },
            bookId: {
              type: 'string',
              description: 'Book identifier',
            },
            content: {
              type: 'string',
              description: 'Comment content',
            },
            date: {
              type: 'string',
              format: 'date-time',
              description: 'Creation date',
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'User identifier',
            },
            username: {
              type: 'string',
              description: 'Username',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
            },
            profilePicture: {
              type: 'string',
              description: 'Profile picture URL',
            },
            tokens: {
              type: 'array',
              items: { type: 'string' },
              description: 'Stored refresh tokens',
            },
          },
        },
        UploadResponse: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              description: 'Public URL of the uploaded file',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
            },
            details: {
              type: 'string',
              description: 'Additional error details',
            },
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    tags: [
      {
        name: 'Auth',
        description: 'Authentication endpoints',
      },
      {
        name: 'Books',
        description: 'Book management and search endpoints',
      },
      {
        name: 'Comments',
        description: 'Comment creation and moderation endpoints',
      },
      {
        name: 'Users',
        description: 'User profile and account management endpoints',
      },
      {
        name: 'Files',
        description: 'File upload endpoints',
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

const specs = swaggerJsdoc(options);

export default specs;
