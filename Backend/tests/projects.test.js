const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // Import the Express app
const Project = require('../models/Project');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Test user data
const testAdmin = {
  _id: new mongoose.Types.ObjectId(),
  fullName: 'Admin User',
  email: 'admin@test.com',
  password: 'password123',
  role: 'admin'
};

const testUser = {
  _id: new mongoose.Types.ObjectId(),
  fullName: 'Test User',
  email: 'user@test.com',
  password: 'password123',
  role: 'user'
};

const testUser2 = {
  _id: new mongoose.Types.ObjectId(),
  fullName: 'Another User',
  email: 'another@test.com',
  password: 'password123',
  role: 'user'
};

// Generate tokens
const adminToken = jwt.sign({ id: testAdmin._id }, process.env.JWT_SECRET, {
  expiresIn: '30d'
});

const userToken = jwt.sign({ id: testUser._id }, process.env.JWT_SECRET, {
  expiresIn: '30d'
});

const user2Token = jwt.sign({ id: testUser2._id }, process.env.JWT_SECRET, {
  expiresIn: '30d'
});

// Test project data
const testProject = {
  title: 'Test Project',
  description: 'This is a test project',
  status: 'active',
  priority: 'high',
  startDate: new Date(),
  endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
  department: 'toxicology',
  tags: ['test', 'api'],
  budget: 5000
};

// Setup and teardown
beforeAll(async () => {
  // Clear test collections
  await User.deleteMany({});
  await Project.deleteMany({});
  
  // Create test users
  await User.create([
    { ...testAdmin, _id: testAdmin._id },
    { ...testUser, _id: testUser._id },
    { ...testUser2, _id: testUser2._id }
  ]);
});

afterAll(async () => {
  // Clean up test data
  await User.deleteMany({});
  await Project.deleteMany({});
  
  // Close MongoDB connection
  await mongoose.connection.close();
});

describe('Project API Tests', () => {
  let projectId;
  
  // Test creating a project
  describe('POST /api/projects', () => {
    it('should create a new project when authenticated', async () => {
      const res = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${userToken}`)
        .send(testProject);
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.title).toEqual(testProject.title);
      expect(res.body.createdBy).toHaveProperty('fullName', testUser.fullName);
      
      // Save project ID for later tests
      projectId = res.body._id;
    });
    
    it('should return 401 if not authenticated', async () => {
      const res = await request(app)
        .post('/api/projects')
        .send(testProject);
      
      expect(res.statusCode).toEqual(401);
    });
    
    it('should return 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ title: 'Incomplete Project' });
      
      expect(res.statusCode).toEqual(400);
    });
  });
  
  // Test getting all projects
  describe('GET /api/projects', () => {
    it('should get all projects for admin', async () => {
      const res = await request(app)
        .get('/api/projects')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThan(0);
    });
    
    it('should get only user projects for non-admin', async () => {
      const res = await request(app)
        .get('/api/projects')
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      
      // All returned projects should be created by or include the user
      res.body.forEach(project => {
        const isCreator = project.createdBy._id === testUser._id.toString();
        const isTeamMember = project.teamMembers.some(
          member => member._id === testUser._id.toString()
        );
        expect(isCreator || isTeamMember).toBeTruthy();
      });
    });
    
    it('should filter projects by status', async () => {
      const res = await request(app)
        .get('/api/projects?status=active')
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      
      // All returned projects should have active status
      res.body.forEach(project => {
        expect(project.status).toEqual('active');
      });
    });
    
    it('should filter projects by search term', async () => {
      const res = await request(app)
        .get('/api/projects?search=test')
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      
      // All returned projects should contain the search term
      res.body.forEach(project => {
        const matchesTitle = project.title.toLowerCase().includes('test');
        const matchesDescription = project.description.toLowerCase().includes('test');
        expect(matchesTitle || matchesDescription).toBeTruthy();
      });
    });
  });
  
  // Test getting a project by ID
  describe('GET /api/projects/:id', () => {
    it('should get a project by ID when authenticated and authorized', async () => {
      const res = await request(app)
        .get(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('_id', projectId);
      expect(res.body.title).toEqual(testProject.title);
    });
    
    it('should return 401 if not authenticated', async () => {
      const res = await request(app)
        .get(`/api/projects/${projectId}`);
      
      expect(res.statusCode).toEqual(401);
    });
    
    it('should return 403 if not authorized to access the project', async () => {
      const res = await request(app)
        .get(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${user2Token}`);
      
      expect(res.statusCode).toEqual(403);
    });
    
    it('should return 404 if project not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/projects/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.statusCode).toEqual(404);
    });
  });
  
  // Test updating a project
  describe('PUT /api/projects/:id', () => {
    it('should update a project when authenticated and authorized', async () => {
      const updateData = {
        title: 'Updated Project Title',
        status: 'on-hold',
        priority: 'medium'
      };
      
      const res = await request(app)
        .put(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('_id', projectId);
      expect(res.body.title).toEqual(updateData.title);
      expect(res.body.status).toEqual(updateData.status);
      expect(res.body.priority).toEqual(updateData.priority);
    });
    
    it('should return 401 if not authenticated', async () => {
      const res = await request(app)
        .put(`/api/projects/${projectId}`)
        .send({ title: 'Unauthorized Update' });
      
      expect(res.statusCode).toEqual(401);
    });
    
    it('should return 403 if not authorized to update the project', async () => {
      const res = await request(app)
        .put(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${user2Token}`)
        .send({ title: 'Forbidden Update' });
      
      expect(res.statusCode).toEqual(403);
    });
  });
  
  // Test adding team members
  describe('POST /api/projects/:id/team', () => {
    it('should add a team member when authenticated and authorized', async () => {
      const res = await request(app)
        .post(`/api/projects/${projectId}/team`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ userId: testUser2._id });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.teamMembers).toContainEqual(
        expect.objectContaining({
          _id: testUser2._id.toString()
        })
      );
    });
    
    it('should return 400 if user is already a team member', async () => {
      const res = await request(app)
        .post(`/api/projects/${projectId}/team`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ userId: testUser2._id });
      
      expect(res.statusCode).toEqual(400);
    });
    
    it('should return 404 if user not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .post(`/api/projects/${projectId}/team`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ userId: fakeId });
      
      expect(res.statusCode).toEqual(404);
    });
  });
  
  // Test removing team members
  describe('DELETE /api/projects/:id/team/:userId', () => {
    it('should remove a team member when authenticated and authorized', async () => {
      const res = await request(app)
        .delete(`/api/projects/${projectId}/team/${testUser2._id}`)
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.teamMembers).not.toContainEqual(
        expect.objectContaining({
          _id: testUser2._id.toString()
        })
      );
    });
  });
  
  // Test adding notes
  describe('POST /api/projects/:id/notes', () => {
    it('should add a note when authenticated and authorized', async () => {
      const noteContent = 'This is a test note';
      const res = await request(app)
        .post(`/api/projects/${projectId}/notes`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ content: noteContent });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('content', noteContent);
      expect(res.body.createdBy).toHaveProperty('fullName', testUser.fullName);
    });
    
    it('should return 400 if note content is missing', async () => {
      const res = await request(app)
        .post(`/api/projects/${projectId}/notes`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({});
      
      expect(res.statusCode).toEqual(400);
    });
  });
  
  // Test project statistics
  describe('GET /api/projects/stats', () => {
    it('should get project statistics when authenticated', async () => {
      const res = await request(app)
        .get('/api/projects/stats')
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('totalProjects');
      expect(res.body).toHaveProperty('statusCounts');
      expect(res.body).toHaveProperty('priorityCounts');
      expect(res.body).toHaveProperty('departmentCounts');
      expect(res.body).toHaveProperty('recentProjects');
    });
  });
  
  // Test deleting a project
  describe('DELETE /api/projects/:id', () => {
    it('should delete a project when authenticated and authorized', async () => {
      const res = await request(app)
        .delete(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Project removed');
      
      // Verify project is deleted
      const checkRes = await request(app)
        .get(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(checkRes.statusCode).toEqual(404);
    });
  });
});