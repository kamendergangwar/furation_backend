const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const Item = require('../models/item');

describe('Item Routes', () => {
  beforeEach(async () => {
    // Clear the items collection before each test
    await Item.deleteMany();
  });

  afterAll(async () => {
    // Close the MongoDB connection after all tests
    await mongoose.connection.close();
  });

  it('should get all items', async () => {
    // Add sample items to the database
    await Item.create({ name: 'Item 1', description: 'Description 1' });
    await Item.create({ name: 'Item 2', description: 'Description 2' });

    const response = await request(app).get('/api/items');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
  });

  it('should get a specific item by ID', async () => {
    const newItem = await Item.create({ name: 'Item', description: 'Description' });

    const response = await request(app).get(`/api/items/${newItem._id}`);
    expect(response.status).toBe(200);
    expect(response.body._id).toBe(newItem._id.toString());
    expect(response.body.name).toBe(newItem.name);
    expect(response.body.description).toBe(newItem.description);
  });

  it('should return 404 if item not found', async () => {
    const nonExistentItemId = mongoose.Types.ObjectId();

    const response = await request(app).get(`/api/items/${nonExistentItemId}`);
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Item not found');
  });

  it('should create a new item', async () => {
    const newItemData = { name: 'New Item', description: 'New Description' };

    const response = await request(app).post('/api/items').send(newItemData);
    expect(response.status).toBe(201);
    expect(response.body.name).toBe(newItemData.name);
    expect(response.body.description).toBe(newItemData.description);

    // Check if the item is saved in the database
    const createdItem = await Item.findById(response.body._id);
    expect(createdItem).not.toBeNull();
    expect(createdItem.name).toBe(newItemData.name);
    expect(createdItem.description).toBe(newItemData.description);
  });

  it('should update an existing item', async () => {
    const existingItem = await Item.create({ name: 'Item', description: 'Description' });
    const updatedItemData = { name: 'Updated Item', description: 'Updated Description' };

    const response = await request(app)
      .put(`/api/items/${existingItem._id}`)
      .send(updatedItemData);
    expect(response.status).toBe(200);
    expect(response.body._id).toBe(existingItem._id.toString());
    expect(response.body.name).toBe(updatedItemData.name);
    expect(response.body.description).toBe(updatedItemData.description);

    // Check if the item is updated in the database
    const updatedItem = await Item.findById(existingItem._id);
    expect(updatedItem.name).toBe(updatedItemData.name);
    expect(updatedItem.description).toBe(updatedItemData.description);
  });

  it('should return 404 if item to update is not found', async () => {
    const nonExistentItemId = mongoose.Types.ObjectId();
    const updatedItemData = { name: 'Updated Item', description: 'Updated Description' };

    const response = await request(app)
      .put(`/api/items/${nonExistentItemId}`)
      .send(updatedItemData);
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Item not found');
  });

  it('should delete an existing item', async () => {
    const existingItem = await Item.create({ name: 'Item', description: 'Description' });

    const response = await request(app).delete(`/api/items/${existingItem._id}`);
    expect(response.status).toBe(204);

    // Check if the item is deleted from the database
    const deletedItem = await Item.findById(existingItem._id);
    expect(deletedItem).toBeNull();
  });

  it('should return 404 if item to delete is not found', async () => {
    const nonExistentItemId = mongoose.Types.ObjectId();

    const response = await request(app).delete(`/api/items/${nonExistentItemId}`);
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Item not found');
  });
});
