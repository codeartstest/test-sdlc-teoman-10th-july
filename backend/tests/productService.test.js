const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const Product = require('../src/models/Product');
const productService = require('../src/services/productService');
const AppError = require('../src/utils/AppError');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Product.deleteMany({});
});

describe('productService', () => {
  const validProductData = {
    name: 'Test Product',
    description: 'A test product description',
    price: 29.99,
    category: 'Electronics',
  };

  describe('getAllProducts', () => {
    it('should return an array of products', async () => {
      await Product.create(validProductData);

      const products = await productService.getAllProducts();

      expect(Array.isArray(products)).toBe(true);
      expect(products).toHaveLength(1);
      expect(products[0].name).toBe('Test Product');
    });

    it('should return an empty array when no products exist', async () => {
      const products = await productService.getAllProducts();

      expect(Array.isArray(products)).toBe(true);
      expect(products).toHaveLength(0);
    });
  });

  describe('getProductById', () => {
    it('should return a product when given a valid ID', async () => {
      const created = await Product.create(validProductData);

      const product = await productService.getProductById(created._id);

      expect(product).not.toBeNull();
      expect(product.name).toBe('Test Product');
      expect(product.description).toBe('A test product description');
      expect(product.price).toBe(29.99);
    });

    it('should throw AppError with 404 for a non-existent ID', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      await expect(productService.getProductById(fakeId)).rejects.toThrow(AppError);

      try {
        await productService.getProductById(fakeId);
      } catch (error) {
        expect(error.statusCode).toBe(404);
        expect(error.message).toBe('Product not found');
        expect(error.isOperational).toBe(true);
      }
    });
  });

  describe('createProduct', () => {
    it('should create and return a new product', async () => {
      const product = await productService.createProduct(validProductData);

      expect(product._id).toBeDefined();
      expect(product.name).toBe('Test Product');
      expect(product.description).toBe('A test product description');
      expect(product.price).toBe(29.99);
      expect(product.category).toBe('Electronics');
      expect(product.stock).toBe(0);
      expect(product.createdAt).toBeDefined();
    });

    it('should prevent mass assignment of createdAt', async () => {
      const maliciousDate = new Date('2020-01-01T00:00:00Z');
      const data = {
        ...validProductData,
        createdAt: maliciousDate,
      };

      const product = await productService.createProduct(data);

      expect(product.createdAt).not.toEqual(maliciousDate);
    });

    it('should prevent mass assignment of _id', async () => {
      const maliciousId = new mongoose.Types.ObjectId();
      const data = {
        ...validProductData,
        _id: maliciousId,
      };

      const product = await productService.createProduct(data);

      expect(product._id.toString()).not.toBe(maliciousId.toString());
    });
  });

  describe('updateProduct', () => {
    it('should update and return the product', async () => {
      const created = await Product.create(validProductData);

      const updated = await productService.updateProduct(created._id, {
        name: 'Updated Name',
        description: 'Updated Description',
        price: 49.99,
        category: 'Books',
      });

      expect(updated.name).toBe('Updated Name');
      expect(updated.description).toBe('Updated Description');
      expect(updated.price).toBe(49.99);
      expect(updated.category).toBe('Books');
    });

    it('should throw AppError with 404 for a non-existent ID', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      await expect(
        productService.updateProduct(fakeId, { name: 'Updated' })
      ).rejects.toThrow(AppError);

      try {
        await productService.updateProduct(fakeId, { name: 'Updated' });
      } catch (error) {
        expect(error.statusCode).toBe(404);
        expect(error.message).toBe('Product not found');
      }
    });

    it('should prevent mass assignment of createdAt during update', async () => {
      const created = await Product.create(validProductData);
      const originalCreatedAt = created.createdAt;
      const maliciousDate = new Date('2020-01-01T00:00:00Z');

      const updated = await productService.updateProduct(created._id, {
        name: 'Updated',
        createdAt: maliciousDate,
      });

      expect(updated.name).toBe('Updated');
      expect(updated.createdAt).toEqual(originalCreatedAt);
      expect(updated.createdAt).not.toEqual(maliciousDate);
    });
  });

  describe('deleteProduct', () => {
    it('should delete the product and return it', async () => {
      const created = await Product.create(validProductData);

      const deleted = await productService.deleteProduct(created._id);

      expect(deleted).not.toBeNull();
      expect(deleted.name).toBe('Test Product');

      const found = await Product.findById(created._id);
      expect(found).toBeNull();
    });

    it('should throw AppError with 404 for a non-existent ID', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      await expect(productService.deleteProduct(fakeId)).rejects.toThrow(AppError);

      try {
        await productService.deleteProduct(fakeId);
      } catch (error) {
        expect(error.statusCode).toBe(404);
        expect(error.message).toBe('Product not found');
      }
    });
  });
});