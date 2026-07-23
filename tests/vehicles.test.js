const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');
const { app } = require('../src/app');
const Vehicle = require('../src/models/Vehicle');

let mongoServer;
let token;

describe('Vehicles API', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    
    token = jwt.sign({ userId: '12345', email: 'test@example.com' }, process.env.JWT_SECRET || 'testsecret', { expiresIn: '1h' });
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

  describe('POST /api/vehicles', () => {
    it('should create a new vehicle when authenticated', async () => {
      const vehicleData = {
        make: 'Toyota',
        model: 'Corolla',
        category: 'Sedan',
        price: 25000,
        quantity: 5
      };

      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${token}`)
        .send(vehicleData);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('vehicle');
      expect(res.body.vehicle.make).toBe(vehicleData.make);
      expect(res.body.vehicle.model).toBe(vehicleData.model);
      
      const dbVehicle = await mongoose.connection.collection('vehicles').findOne({ model: 'Corolla' });
      expect(dbVehicle).toBeTruthy();
    });

    it('should return 401 if unauthenticated', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .send({
          make: 'Honda',
          model: 'Civic',
          category: 'Sedan',
          price: 26000,
          quantity: 3
        });
      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/vehicles', () => {
    it('should list all vehicles when authenticated', async () => {
      await mongoose.connection.collection('vehicles').insertMany([
        { make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 25000, quantity: 5 },
        { make: 'Honda', model: 'Civic', category: 'Sedan', price: 26000, quantity: 3 }
      ]);

      const res = await request(app)
        .get('/api/vehicles')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.vehicles)).toBeTruthy();
      expect(res.body.vehicles.length).toBe(2);
    });

    it('should return 401 if unauthenticated', async () => {
      const res = await request(app).get('/api/vehicles');
      expect(res.statusCode).toBe(401);
    });
  });
});
