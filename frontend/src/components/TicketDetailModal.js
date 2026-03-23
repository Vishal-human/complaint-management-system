import React, { useState, useEffect } from 'react';
import { commentAPI, complaintAPI } from '../services/api';
import { MdClose, MdSend, MdPerson, MdAccessTime, MdLabel, MdAssignment } from 'react-icons/md';

function TicketDetailModal({ ticket, onClose, currentUser, onUpdate }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (ticket) {
      fetchComments();
    }
  }, [ticket]);

  const fetchComments = async () => {
    try {
      const { data } = await commentAPI.getByComplaint(ticket._id);
      setComments(data);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    setError('');

    try {
      await commentAPI.create({
        complaintId: ticket._id,
        message: newComment,
        isInternal: isInternal
      });

      setNewComment('');
      setIsInternal(false);
      fetchComments();

      if (onUpdate) {
        const { data } = await complaintAPI.getById(ticket._id);
        onUpdate(data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post comment');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'in progress': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority?.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (!ticket) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase border ${getStatusColor(ticket.status)}`}>
                {ticket.status}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase border ${getPriorityColor(ticket.priority)}`}>
                {ticket.priority} Priority
              </span>
            </div>
            <h2 className="text-2xl font-bold mb-1">Ticket #{ticket.ticketNumber}</h2>
            <p className="text-blue-100 text-sm">{ticket.category}</p>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition">
            <MdClose className="text-2xl" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6 bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <MdPerson className="text-gray-400" />
                <strong>From:</strong> {ticket.studentId?.name} ({ticket.studentId?.email})
              </span>
              <span className="flex items-center gap-1">
                <MdAccessTime className="text-gray-400" />
                {new Date(ticket.createdAt).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            {ticket.assignedTo && (
              <div className="flex items-center gap-2 mb-3 text-sm">
                <MdAssignment className="text-blue-600" />
                <span className="text-gray-700">
                  <strong>Assigned to:</strong> {ticket.assignedTo.name} ({ticket.assignedTo.email})
                </span>
              </div>
            )}
            <div className="text-gray-800">
              <strong className="block mb-2">Description:</strong>
              <p className="whitespace-pre-wrap">{ticket.description}</p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <MdLabel />
              Conversation
            </h3>

            <div className="space-y-4 mb-6">
              {comments.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No replies yet. Be the first to respond!</p>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment._id}
                    className={`rounded-lg p-4 ${
                      comment.isInternal
                        ? 'bg-yellow-50 border-l-4 border-yellow-400'
                        : comment.userId.role === 'student'
                          ? 'bg-blue-50 border-l-4 border-blue-400'
                          : 'bg-green-50 border-l-4 border-green-400'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${
                          comment.userId.role === 'student' ? 'bg-blue-500' : 'bg-green-600'
                        }`}>
                          {comment.userId.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">
                            {comment.userId.name}
                            {comment.isInternal && <span className="ml-2 text-xs bg-yellow-200 px-2 py-1 rounded">Internal Note</span>}
                            }
                          </p>
                          <p className="text-xs text-gray-500">
                            {comment.userId.role.charAt(0).toUpperCase() + comment.userId.role.slice(1)} • {new Date(comment.createdAt).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap ml-10">{comment.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="mx-6 mb-4 bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded">
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <form onSubmit={handleSubmitComment}>
            <div className="mb-3">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows="3"
                placeholder="Type your reply here..."
                disabled={loading}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                {currentUser.role !== 'student' && (
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isInternal}
                      onChange={(e) => setIsInternal(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Internal note (not visible to student)</span>
                  </label>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  disabled={loading}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                  disabled={loading || !newComment.trim()}
                >
                  <MdSend />
                  {loading ? 'Sending...' : 'Send Reply'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TicketDetailModal;
