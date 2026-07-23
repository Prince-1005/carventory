const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { app } = require('../src/app');

let mongoServer;

describe('Auth API - POST /api/auth/register', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany();
    }
  });

  it('should register a new user, hash the password, and return 201', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    };

    const res = await request(app)
      .post('/api/auth/register')
      .send(userData);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'User registered successfully');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user.username).toBe(userData.username);
    expect(res.body.user.email).toBe(userData.email);
    expect(res.body.user).not.toHaveProperty('password'); // Password should not be returned in API response

    // Verify user is actually saved in DB and password is hashed
    const usersCollection = mongoose.connection.collection('users');
    const userInDb = await usersCollection.findOne({ email: userData.email });
    
    expect(userInDb).toBeTruthy();
    expect(userInDb.password).not.toBe(userData.password); // Password must be hashed in DB
  });
});
