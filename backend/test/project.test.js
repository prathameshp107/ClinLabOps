require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Project = require('../models/Project');

// You may need to export your Express app instance from app.js for testing
// e.g., module.exports = app;

describe('Project API', () => {
  let server;
  let projectId;

  beforeAll((done) => {
    server = app.listen(4000, () => done());
  });

  afterAll(async () => {
    await Project.deleteMany({});
    await mongoose.connection.close();
    server.close();
  });

  it('should create a new project', async () => {
    const res = await request(server)
      .post('/api/projects')
      .send({
        name: 'Test Project',
        description: 'A project for testing',
        status: 'In Progress',
        priority: 'High',
        progress: 10
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Test Project');
    projectId = res.body._id;
  });

  it('should get all projects', async () => {
    const res = await request(server).get('/api/projects');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should get a project by id', async () => {
    const res = await request(server).get(`/api/projects/${projectId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(projectId);
  });

  it('should update a project', async () => {
    const res = await request(server)
      .put(`/api/projects/${projectId}`)
      .send({ progress: 50 });
    expect(res.statusCode).toBe(200);
    expect(res.body.progress).toBe(50);
  });

  it('should delete a project', async () => {
    const res = await request(server).delete(`/api/projects/${projectId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Project deleted');
  });
}); 