const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');
const { app } = require('../src/app');
const Vehicle = require('../src/models/Vehicle');

let mongoServer;
let token;
let adminToken;

describe('Vehicles API', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    
    token = jwt.sign({ userId: '12345', email: 'test@example.com', role: 'user' }, process.env.JWT_SECRET || 'testsecret', { expiresIn: '1h' });
    adminToken = jwt.sign({ userId: '67890', email: 'admin@example.com', role: 'admin' }, process.env.JWT_SECRET || 'testsecret', { expiresIn: '1h' });
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

  describe('GET /api/vehicles/search', () => {
    it('should filter vehicles by make, model, category, and price range', async () => {
      await mongoose.connection.collection('vehicles').insertMany([
        { make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 20000, quantity: 5 },
        { make: 'Toyota', model: 'Camry', category: 'Sedan', price: 26000, quantity: 2 },
        { make: 'Honda', model: 'Civic', category: 'Sedan', price: 24000, quantity: 3 },
        { make: 'Ford', model: 'F-150', category: 'Truck', price: 35000, quantity: 1 }
      ]);

      const res = await request(app)
        .get('/api/vehicles/search?make=Toyota&maxPrice=25000')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.vehicles)).toBeTruthy();
      expect(res.body.vehicles.length).toBe(1);
      expect(res.body.vehicles[0].model).toBe('Corolla');

      const res2 = await request(app)
        .get('/api/vehicles/search?category=Sedan&minPrice=22000&maxPrice=27000')
        .set('Authorization', `Bearer ${token}`);

      expect(res2.statusCode).toBe(200);
      expect(res2.body.vehicles.length).toBe(2);
      expect(res2.body.vehicles.map(v => v.model).sort()).toEqual(['Camry', 'Civic'].sort());
    });
  });

  describe('PUT /api/vehicles/:id', () => {
    it('should update a vehicle as any authenticated user', async () => {
      const vehicle = await mongoose.connection.collection('vehicles').insertOne({
        make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 20000, quantity: 5
      });
      
      const res = await request(app)
        .put(`/api/vehicles/${vehicle.insertedId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ price: 21000 });
        
      expect(res.statusCode).toBe(200);
      expect(res.body.vehicle.price).toBe(21000);
    });

    it('should return 401 if unauthenticated', async () => {
      const res = await request(app).put('/api/vehicles/123456789012').send({ price: 21000 });
      expect(res.statusCode).toBe(401);
    });
  });

  describe('DELETE /api/vehicles/:id', () => {
    it('should delete a vehicle as an admin', async () => {
      const vehicle = await mongoose.connection.collection('vehicles').insertOne({
        make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 20000, quantity: 5
      });
      
      const res = await request(app)
        .delete(`/api/vehicles/${vehicle.insertedId}`)
        .set('Authorization', `Bearer ${adminToken}`);
        
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Vehicle removed');
    });

    it('should return 403 for non-admins', async () => {
      const vehicle = await mongoose.connection.collection('vehicles').insertOne({
        make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 20000, quantity: 5
      });
      
      const res = await request(app)
        .delete(`/api/vehicles/${vehicle.insertedId}`)
        .set('Authorization', `Bearer ${token}`);
        
      expect(res.statusCode).toBe(403);
    });
  });

  describe('POST /api/vehicles/:id/purchase', () => {
    it('should decrement quantity on successful purchase', async () => {
      const vehicle = await mongoose.connection.collection('vehicles').insertOne({
        make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 20000, quantity: 1
      });
      
      const res = await request(app)
        .post(`/api/vehicles/${vehicle.insertedId}/purchase`)
        .set('Authorization', `Bearer ${token}`);
        
      expect(res.statusCode).toBe(200);
      expect(res.body.vehicle.quantity).toBe(0);
      expect(res.body.message).toBe('Vehicle purchased successfully');
    });

    it('should block purchase if quantity is 0', async () => {
      const vehicle = await mongoose.connection.collection('vehicles').insertOne({
        make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 20000, quantity: 0
      });
      
      const res = await request(app)
        .post(`/api/vehicles/${vehicle.insertedId}/purchase`)
        .set('Authorization', `Bearer ${token}`);
        
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Vehicle out of stock');
    });
  });

  describe('POST /api/vehicles/:id/restock', () => {
    it('should increment quantity when admin restocks', async () => {
      const vehicle = await mongoose.connection.collection('vehicles').insertOne({
        make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 20000, quantity: 0
      });
      
      const res = await request(app)
        .post(`/api/vehicles/${vehicle.insertedId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 5 });
        
      expect(res.statusCode).toBe(200);
      expect(res.body.vehicle.quantity).toBe(5);
      expect(res.body.message).toBe('Vehicle restocked successfully');
    });

    it('should return 403 for non-admins trying to restock', async () => {
      const vehicle = await mongoose.connection.collection('vehicles').insertOne({
        make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 20000, quantity: 0
      });
      
      const res = await request(app)
        .post(`/api/vehicles/${vehicle.insertedId}/restock`)
        .set('Authorization', `Bearer ${token}`)
        .send({ quantity: 5 });
        
      expect(res.statusCode).toBe(403);
    });
  });
});
