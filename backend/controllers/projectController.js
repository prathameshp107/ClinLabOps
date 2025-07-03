const Project = require('../models/Project');
const mongoose = require('mongoose');

// Get all projects
exports.getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get project by ID

exports.getProjectById = async (req, res) => {
    try {
        
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ error: 'Project not found' });
        res.json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create new project
exports.createProject = async (req, res) => {
    try {
        // Get the current count of projects
        const count = await Project.countDocuments();
        const projectCode = `PRJ-${String(count + 1).padStart(5, '0')}`;

        // Create the project with the generated code
        const project = new Project({
            ...req.body,
            projectCode,
        });
        await project.save();
        res.status(201).json(project);
    } catch (err) {
        res.status(500).json({ message: 'Failed to create project', error: err.message });
    }
};

// Update project
exports.updateProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!project) return res.status(404).json({ error: 'Project not found' });
        res.json(project);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete project
exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) return res.status(404).json({ error: 'Project not found' });
        res.json({ message: 'Project deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}; 