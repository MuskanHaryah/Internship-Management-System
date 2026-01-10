const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Task = require('../models/Task');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

describe('Task API', () => {
  let authToken;
  let userId;
  let taskId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/internship_test');
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Task.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Create test user and get auth token
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
      role: 'admin'
    });
    userId = user._id;

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });
    
    authToken = loginRes.body.token;
  });

  afterEach(async () => {
    await User.deleteMany({});
    await Task.deleteMany({});
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Task',
          description: 'Test Description',
          assignedTo: userId,
          deadline: new Date(Date.now() + 86400000),
          priority: 'high'
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Test Task');
      taskId = res.body.data._id;
    });

    it('should fail without authentication', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({
          title: 'Test Task',
          description: 'Test Description'
        });

      expect(res.statusCode).toEqual(401);
    });

    it('should fail with missing required fields', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          description: 'Test Description'
        });

      expect(res.statusCode).toEqual(400);
    });
  });

  describe('GET /api/tasks', () => {
    beforeEach(async () => {
      await Task.create({
        title: 'Task 1',
        description: 'Description 1',
        assignedBy: userId,
        assignedTo: userId,
        deadline: new Date(Date.now() + 86400000),
        priority: 'high'
      });
    });

    it('should get all tasks', async () => {
      const res = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should fail without authentication', async () => {
      const res = await request(app).get('/api/tasks');
      expect(res.statusCode).toEqual(401);
    });
  });

  describe('GET /api/tasks/:id', () => {
    beforeEach(async () => {
      const task = await Task.create({
        title: 'Task 1',
        description: 'Description 1',
        assignedBy: userId,
        assignedTo: userId,
        deadline: new Date(Date.now() + 86400000),
        priority: 'high'
      });
      taskId = task._id;
    });

    it('should get a task by id', async () => {
      const res = await request(app)
        .get(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Task 1');
    });

    it('should return 404 for non-existent task', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/tasks/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toEqual(404);
    });
  });

  describe('PUT /api/tasks/:id', () => {
    beforeEach(async () => {
      const task = await Task.create({
        title: 'Task 1',
        description: 'Description 1',
        assignedBy: userId,
        assignedTo: userId,
        deadline: new Date(Date.now() + 86400000),
        priority: 'high'
      });
      taskId = task._id;
    });

    it('should update a task', async () => {
      const res = await request(app)
        .put(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Task',
          priority: 'medium'
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Updated Task');
      expect(res.body.data.priority).toBe('medium');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    beforeEach(async () => {
      const task = await Task.create({
        title: 'Task 1',
        description: 'Description 1',
        assignedBy: userId,
        assignedTo: userId,
        deadline: new Date(Date.now() + 86400000),
        priority: 'high'
      });
      taskId = task._id;
    });

    it('should delete a task', async () => {
      const res = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);

      const deletedTask = await Task.findById(taskId);
      expect(deletedTask).toBeNull();
    });
  });
});
