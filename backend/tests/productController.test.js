const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const express = require('express');
const request = require('supertest');
const Product = require('../src/models/Product');
const productRoutes = require('../src/routes/products');
const errorHandler = require('../src/middleware/errorHandler');

let mongoServer;
let app;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  app = express();
  app.use(express.json());
  app.use('/api/products', productRoutes);
  app.use(errorHandler);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Product.deleteMany({});
});

describe('Product Controller (Integration)', () => {
  const validProductData = {
    name: 'Test Product',
    description: 'A test product description',
    price: 29.99,
    category: 'Electronics',
  };

  describe('GET /api/products', () => {
    it('should return 200 with an array of products', async () => {
      await Product.create(validProductData);

      const res = await request(app).get('/api/products');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].name).toBe('Test Product');
    });

    it('should return 200 with an empty array when no products exist', async () => {
      const res = await request(app).get('/api/products');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(0);
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return 200 with the product for a valid ID', async () => {
      const product = await Product.create(validProductData);

      const res = await request(app).get(`/api/products/${product._id}`);

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Test Product');
      expect(res.body.price).toBe(29.99);
      expect(res.body.category).toBe('Electronics');
    });

    it('should return 404 for a non-existent ID', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const res = await request(app).get(`/api/products/${fakeId}`);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Product not found');
    });
  });

  describe('POST /api/products', () => {
    it('should return 201 with the created product for valid input', async () => {
      const res = await request(app).post('/api/products').send(validProductData);

      expect(res.status).toBe(201);
      expect(res.body._id).toBeDefined();
      expect(res.body.name).toBe('Test Product');
      expect(res.body.description).toBe('A test product description');
      expect(res.body.price).toBe(29.99);
      expect(res.body.category).toBe('Electronics');
      expect(res.body.stock).toBe(0);
    });

    it('should return 422 for missing required fields', async () => {
      const res = await request(app)
        .post('/api/products')
        .send({ name: '', price: -5 });

      expect(res.status).toBe(422);
      expect(res.body.errors).toBeDefined();
      expect(Array.isArray(res.body.errors)).toBe(true);
      expect(res.body.errors.length).toBeGreaterThan(0);
    });

    it('should return 422 for invalid price type', async () => {
      const res = await request(app)
        .post('/api/products')
        .send({
          name: 'Test',
          description: 'Desc',
          price: 'not-a-number',
          category: 'Test',
        });

      expect(res.status).toBe(422);
      expect(res.body.errors).toBeDefined();
    });

    it('should return 422 for name exceeding 100 characters', async () => {
      const res = await request(app)
        .post('/api/products')
        .send({
          name: 'a'.repeat(101),
          description: 'Desc',
          price: 10,
          category: 'Test',
        });

      expect(res.status).toBe(422);
      expect(res.body.errors).toBeDefined();
    });
  });

  describe('PUT /api/products/:id', () => {
    it('should return 200 with the updated product', async () => {
      const product = await Product.create(validProductData);

      const res = await request(app)
        .put(`/api/products/${product._id}`)
        .send({
          name: 'Updated Name',
          description: 'Updated Description',
          price: 49.99,
          category: 'Books',
        });

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Updated Name');
      expect(res.body.description).toBe('Updated Description');
      expect(res.body.price).toBe(49.99);
      expect(res.body.category).toBe('Books');
    });

    it('should return 404 for a non-existent ID', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .put(`/api/products/${fakeId}`)
        .send({
          name: 'Test',
          description: 'Desc',
          price: 10,
          category: 'Test',
        });

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Product not found');
    });

    it('should return 422 for invalid input', async () => {
      const product = await Product.create(validProductData);

      const res = await request(app)
        .put(`/api/products/${product._id}`)
        .send({ name: '', price: -10 });

      expect(res.status).toBe(422);
      expect(res.body.errors).toBeDefined();
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('should return 200 with a success message', async () => {
      const product = await Product.create(validProductData);

      const res = await request(app).delete(`/api/products/${product._id}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Product deleted successfully');
    });

    it('should return 404 for a non-existent ID', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const res = await request(app).delete(`/api/products/${fakeId}`);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Product not found');
    });
  });
});