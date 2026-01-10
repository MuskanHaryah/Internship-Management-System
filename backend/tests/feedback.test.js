const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Feedback = require('../models/Feedback');
const User = require('../models/User');
const Task = require('../models/Task');
const bcrypt = require('bcryptjs');

describe('Feedback API', () => {
  let authToken;
  let userId;
  let internId;
  let taskId;
  let feedbackId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/internship_test');
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Task.deleteMany({});
    await Feedback.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Create admin user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin'
    });
    userId = admin._id;

    // Create intern user
    const intern = await User.create({
      name: 'Intern User',
      email: 'intern@example.com',
      password: hashedPassword,
      role: 'intern'
    });
    internId = intern._id;

    // Create task
    const task = await Task.create({
      title: 'Test Task',
      description: 'Test Description',
      assignedBy: userId,
      assignedTo: internId,
      deadline: new Date(Date.now() + 86400000),
      priority: 'high'
    });
    taskId = task._id;

    // Login as admin
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'password123' });
    
    authToken = loginRes.body.token;
  });

  afterEach(async () => {
    await User.deleteMany({});
    await Task.deleteMany({});
    await Feedback.deleteMany({});
  });

  describe('POST /api/feedback', () => {
    it('should create new feedback', async () => {
      const res = await request(app)
        .post('/api/feedback')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          taskId: taskId,
          internId: internId,
          rating: 4,
          comment: 'Good work!'
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.rating).toBe(4);
      expect(res.body.data.comment).toBe('Good work!');
      feedbackId = res.body.data._id;
    });

    it('should fail without authentication', async () => {
      const res = await request(app)
        .post('/api/feedback')
        .send({
          taskId: taskId,
          internId: internId,
          rating: 4,
          comment: 'Good work!'
        });

      expect(res.statusCode).toEqual(401);
    });

    it('should fail with invalid rating', async () => {
      const res = await request(app)
        .post('/api/feedback')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          taskId: taskId,
          internId: internId,
          rating: 6,
          comment: 'Good work!'
        });

      expect(res.statusCode).toEqual(400);
    });
  });

  describe('GET /api/feedback', () => {
    beforeEach(async () => {
      await Feedback.create({
        task: taskId,
        intern: internId,
        givenBy: userId,
        rating: 4,
        comment: 'Good work!'
      });
    });

    it('should get all feedback', async () => {
      const res = await request(app)
        .get('/api/feedback')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should filter feedback by intern', async () => {
      const res = await request(app)
        .get(`/api/feedback?internId=${internId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data[0].intern._id.toString()).toBe(internId.toString());
    });
  });

  describe('GET /api/feedback/:id', () => {
    beforeEach(async () => {
      const feedback = await Feedback.create({
        task: taskId,
        intern: internId,
        givenBy: userId,
        rating: 4,
        comment: 'Good work!'
      });
      feedbackId = feedback._id;
    });

    it('should get feedback by id', async () => {
      const res = await request(app)
        .get(`/api/feedback/${feedbackId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.rating).toBe(4);
    });

    it('should return 404 for non-existent feedback', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/feedback/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toEqual(404);
    });
  });

  describe('PUT /api/feedback/:id', () => {
    beforeEach(async () => {
      const feedback = await Feedback.create({
        task: taskId,
        intern: internId,
        givenBy: userId,
        rating: 4,
        comment: 'Good work!'
      });
      feedbackId = feedback._id;
    });

    it('should update feedback', async () => {
      const res = await request(app)
        .put(`/api/feedback/${feedbackId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          rating: 5,
          comment: 'Excellent work!'
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.rating).toBe(5);
      expect(res.body.data.comment).toBe('Excellent work!');
    });
  });

  describe('DELETE /api/feedback/:id', () => {
    beforeEach(async () => {
      const feedback = await Feedback.create({
        task: taskId,
        intern: internId,
        givenBy: userId,
        rating: 4,
        comment: 'Good work!'
      });
      feedbackId = feedback._id;
    });

    it('should delete feedback', async () => {
      const res = await request(app)
        .delete(`/api/feedback/${feedbackId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);

      const deletedFeedback = await Feedback.findById(feedbackId);
      expect(deletedFeedback).toBeNull();
    });
  });
});
