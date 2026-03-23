const express = require('express');
const Complaint = require('../models/Complaint');
const { auth, adminAuth } = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const { category, description } = req.body;
    const complaint = new Complaint({ studentId: req.user.id, category, description });
    await complaint.save();
    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const query = (req.user.role === 'admin' || req.user.role === 'superadmin') ? {} : { studentId: req.user.id };
    const complaints = await Complaint.find(query)
      .populate('studentId', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('studentId', 'name email')
      .populate('assignedTo', 'name email role');

    if (!complaint) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (req.user.role === 'student' && complaint.studentId._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this ticket' });
    }

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:id/status', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { status } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true }
    ).populate('studentId', 'name email').populate('assignedTo', 'name email');
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:id/assign', auth, async (req, res) => {
  try {
    const { assignedTo } = req.body;

    if (req.user.role === 'admin' && assignedTo && assignedTo !== req.user.id) {
      return res.status(403).json({ message: 'Admins can only assign tickets to themselves' });
    }

    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const updateData = {
      assignedTo: assignedTo || null,
      updatedAt: Date.now()
    };

    if (assignedTo && !updateData.status) {
      updateData.status = 'In Progress';
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('studentId', 'name email').populate('assignedTo', 'name email role');

    if (!complaint) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:id/priority', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { priority } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { priority, updatedAt: Date.now() },
      { new: true }
    ).populate('studentId', 'name email').populate('assignedTo', 'name email');

    if (!complaint) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
