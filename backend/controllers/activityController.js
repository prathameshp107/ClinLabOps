const Activity = require('../models/Activity');

// Get all activities
exports.getActivities = async (req, res) => {
  try {
    const activities = await Activity.find({}).populate('user').populate('project').sort({ createdAt: 'desc' });
    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
};

// Get activity by ID
exports.getActivityById = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id).populate('user').populate('project');
    if (!activity) return res.status(404).json({ error: 'Activity not found' });
    res.json(activity);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch activity' });
  }
};

// Create a new activity
exports.createActivity = async (req, res) => {
  try {
    const { type, description, user, project, meta } = req.body;
    const activity = new Activity({ type, description, user, project, meta });
    await activity.save();
    res.status(201).json(activity);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create activity' });
  }
};

// Delete an activity
exports.deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findByIdAndDelete(req.params.id);
    if (!activity) return res.status(404).json({ error: 'Activity not found' });
    res.json({ message: 'Activity deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete activity' });
  }
}; 