const express = require('express');
const Comment = require('../models/Comment');
const Complaint = require('../models/Complaint');
const { auth } = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const { complaintId, message, isInternal } = req.body;

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (req.user.role === 'student' && complaint.studentId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to comment on this ticket' });
    }

    if (req.user.role === 'student' && isInternal) {
      return res.status(403).json({ message: 'Students cannot create internal notes' });
    }

    const comment = new Comment({
      complaintId,
      userId: req.user.id,
      message,
      isInternal: isInternal || false
    });

    await comment.save();

    await Complaint.findByIdAndUpdate(complaintId, { updatedAt: Date.now() });

    const populatedComment = await Comment.findById(comment._id)
      .populate('userId', 'name email role');

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/:complaintId', auth, async (req, res) => {
  try {
    const { complaintId } = req.params;

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (req.user.role === 'student' && complaint.studentId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this ticket' });
    }

    let query = { complaintId };

    if (req.user.role === 'student') {
      query.isInternal = false;
    }

    const comments = await Comment.find(query)
      .populate('userId', 'name email role')
      .sort({ createdAt: 1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.userId.toString() !== req.user.id && req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
