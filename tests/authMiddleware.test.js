const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const { protect } = require('../src/middleware/auth');

const app = express();
app.use(express.json());

app.get('/api/protected', protect, (req, res) => {
  res.status(200).json({ message: 'Success', user: req.user });
});

describe('Auth Middleware', () => {
  it('should return 401 if no token is provided', async () => {
    const res = await request(app).get('/api/protected');
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message', 'Not authorized, no token');
  });

  it('should return 401 if token is invalid', async () => {
    const res = await request(app)
      .get('/api/protected')
      .set('Authorization', 'Bearer invalid_token_string');
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message', 'Not authorized, token failed');
  });

  it('should call next() and set req.user if token is valid', async () => {
    const token = jwt.sign({ userId: '12345', email: 'test@example.com' }, process.env.JWT_SECRET || 'testsecret', { expiresIn: '1h' });
    
    const res = await request(app)
      .get('/api/protected')
      .set('Authorization', `Bearer ${token}`);
      
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Success');
    expect(res.body.user).toHaveProperty('userId', '12345');
    expect(res.body.user).toHaveProperty('email', 'test@example.com');
  });
});
