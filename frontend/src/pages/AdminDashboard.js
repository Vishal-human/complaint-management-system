import React, { useState, useEffect } from 'react';
import { complaintAPI, notificationAPI } from '../services/api';
import { MdLogout, MdDashboard, MdDescription, MdNotifications, MdAssessment, MdShield, MdPerson, MdEmail, MdAccessTime, MdCheckCircle, MdPending, MdAutorenew, MdAdd, MdSend, MdDelete, MdHistory, MdFilterList } from 'react-icons/md';

function AdminDashboard({ user, onLogout }) {
  const [complaints, setComplaints] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNotificationForm, setShowNotificationForm] = useState(false);
  const [notificationData, setNotificationData] = useState({ title: '', message: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchComplaints();
    fetchNotifications();
  }, []);

  const fetchComplaints = async () => {
    try {
      const { data } = await complaintAPI.getAll();
      setComplaints(data);
    } catch (err) {
      console.error('Error fetching complaints:', err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const { data } = await notificationAPI.getAll();
      setNotifications(data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await complaintAPI.updateStatus(id, status);
      setSuccess('Status updated successfully!');
      fetchComplaints();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update status');
      console.error('Error updating status:', err);
    }
  };

  const handleNotificationSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      await notificationAPI.create(notificationData);
      setSuccess('Notification sent to all students successfully!');
      setNotificationData({ title: '', message: '' });
      setShowNotificationForm(false);
      fetchNotifications();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send notification');
    }
  };

  const handleDeleteNotification = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notification?')) return;
    
    try {
      await notificationAPI.delete(id);
      setSuccess('Notification deleted successfully!');
      fetchNotifications();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete notification');
    }
  };

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'in progress': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'Pending').length,
    inProgress: complaints.filter(c => c.status === 'In Progress').length,
    resolved: complaints.filter(c => c.status === 'Resolved').length,
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <MdShield className="text-white text-xl" />
            </div>
            <span className="font-bold text-lg text-gray-800">CMS Admin</span>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
            <MdDashboard className="text-xl" />
            <span className="font-medium">Dashboard</span>
          </button>
          <button onClick={() => setActiveTab('complaints')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition ${activeTab === 'complaints' ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
            <MdDescription className="text-xl" />
            <span className="font-medium">All Complaints</span>
          </button>
          <button onClick={() => setActiveTab('notifications')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition ${activeTab === 'notifications' ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
            <MdNotifications className="text-xl" />
            <span className="font-medium">Notifications</span>
          </button>
          <button onClick={() => setActiveTab('reports')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition ${activeTab === 'reports' ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
            <MdAssessment className="text-xl" />
            <span className="font-medium">Reports</span>
          </button>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition">
            <MdLogout className="text-xl" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {activeTab === 'dashboard' && 'Complaint Overview'}
                {activeTab === 'complaints' && 'All Complaints'}
                {activeTab === 'notifications' && 'Notifications'}
                {activeTab === 'reports' && 'Reports'}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800">Department Admin</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">AD</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
              <p className="font-medium">{success}</p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
              <p className="font-medium">{error}</p>
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-gray-400">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-gray-500 text-sm font-medium">TOTAL</h3>
                    <MdDescription className="text-gray-400 text-2xl" />
                  </div>
                  <p className="text-4xl font-bold text-gray-800">{String(stats.total).padStart(2, '0')}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-400">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-gray-500 text-sm font-medium">PENDING</h3>
                    <MdPending className="text-yellow-500 text-2xl" />
                  </div>
                  <p className="text-4xl font-bold text-gray-800">{String(stats.pending).padStart(2, '0')}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-400">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-gray-500 text-sm font-medium">IN PROGRESS</h3>
                    <MdAutorenew className="text-blue-500 text-2xl" />
                  </div>
                  <p className="text-4xl font-bold text-gray-800">{String(stats.inProgress).padStart(2, '0')}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-400">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-gray-500 text-sm font-medium">RESOLVED</h3>
                    <MdCheckCircle className="text-green-500 text-2xl" />
                  </div>
                  <p className="text-4xl font-bold text-gray-800">{String(stats.resolved).padStart(2, '0')}</p>
                </div>
              </div>

              <div className="bg-indigo-600 rounded-xl shadow-sm p-6 mb-8">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                      <MdNotifications className="text-white text-2xl" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">Notification Management</h3>
                      <p className="text-indigo-100 text-sm">Update students about resolution times or campus news.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setActiveTab('notifications')} className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition text-sm">
                      History ({notifications.length})
                    </button>
                    <button onClick={() => { setActiveTab('notifications'); setShowNotificationForm(true); }} className="bg-white text-indigo-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition font-semibold text-sm">
                      + New Notification
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">All Complaints</h2>
                    <p className="text-sm text-gray-600">Track and update the status of student grievances.</p>
                  </div>
                  <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition">
                    <MdFilterList />
                    Filter
                  </button>
                </div>
                {complaints.slice(0, 3).map((complaint) => (
                  <div key={complaint._id} className="border border-gray-200 rounded-lg p-4 mb-4 hover:bg-gray-50 transition">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase border ${getStatusColor(complaint.status)}`}>
                            {complaint.status}
                          </span>
                          <h3 className="font-bold text-gray-800">{complaint.category}</h3>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <span className="flex items-center gap-1">
                            <MdPerson className="text-gray-400" />
                            Student: {complaint.studentId?.name || 'Unknown'}
                          </span>
                          <span className="flex items-center gap-1">
                            <MdEmail className="text-gray-400" />
                            Email: {complaint.studentId?.email || 'N/A'}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-2">{complaint.description}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <MdAccessTime />
                          Submitted: {new Date(complaint.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className="ml-4">
                        <p className="text-xs text-gray-600 mb-2 font-medium">UPDATE STATUS</p>
                        <select value={complaint.status} onChange={(e) => handleStatusUpdate(complaint._id, e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white">
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
                {complaints.length > 3 && (
                  <button onClick={() => setActiveTab('complaints')} className="w-full text-center text-indigo-600 hover:text-indigo-700 font-medium py-2">
                    View All Complaints →
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTab === 'complaints' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">All Complaints</h2>
                  <p className="text-sm text-gray-600">Track and update the status of student grievances.</p>
                </div>
                <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition">
                  <MdFilterList />
                  Filter
                </button>
              </div>
              {complaints.length === 0 ? (
                <div className="text-center py-12">
                  <MdDescription className="text-gray-300 text-6xl mx-auto mb-4" />
                  <p className="text-gray-500">No complaints submitted yet</p>
                </div>
              ) : (
                complaints.map((complaint) => (
                  <div key={complaint._id} className="border border-gray-200 rounded-lg p-4 mb-4 hover:bg-gray-50 transition">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase border ${getStatusColor(complaint.status)}`}>
                            {complaint.status}
                          </span>
                          <h3 className="font-bold text-gray-800">{complaint.category}</h3>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <span className="flex items-center gap-1">
                            <MdPerson className="text-gray-400" />
                            Student: {complaint.studentId?.name || 'Unknown'}
                          </span>
                          <span className="flex items-center gap-1">
                            <MdEmail className="text-gray-400" />
                            Email: {complaint.studentId?.email || 'N/A'}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-2">{complaint.description}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <MdAccessTime />
                          Submitted: {new Date(complaint.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className="ml-4">
                        <p className="text-xs text-gray-600 mb-2 font-medium">UPDATE STATUS</p>
                        <select value={complaint.status} onChange={(e) => handleStatusUpdate(complaint._id, e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white">
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                        <button className="mt-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <MdNotifications className="text-indigo-600" />
                      Notification Management
                    </h2>
                    <p className="text-sm text-gray-600">Update students about resolution times or campus news.</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setShowNotificationForm(false)} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${!showNotificationForm ? 'bg-gray-200 text-gray-700' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'}`}>
                      <MdHistory />
                      History ({notifications.length})
                    </button>
                    <button onClick={() => setShowNotificationForm(true)} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${showNotificationForm ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'}`}>
                      <MdAdd />
                      New Notification
                    </button>
                  </div>
                </div>
              </div>
              {showNotificationForm && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Create New Notification</h3>
                  <form onSubmit={handleNotificationSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Notification Title</label>
                      <input type="text" value={notificationData.title} onChange={(e) => setNotificationData({...notificationData, title: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="e.g., Important Announcement" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                      <textarea value={notificationData.message} onChange={(e) => setNotificationData({...notificationData, message: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none" rows="4" placeholder="Type your message here..." required />
                    </div>
                    <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2">
                      <MdSend />
                      Send to All Students
                    </button>
                  </form>
                </div>
              )}
              {!showNotificationForm && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Notification History</h3>
                  {notifications.length === 0 ? (
                    <div className="text-center py-12">
                      <MdNotifications className="text-gray-300 text-6xl mx-auto mb-4" />
                      <p className="text-gray-500">No notifications sent yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {notifications.map((notification) => (
                        <div key={notification._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-800 mb-2">{notification.title}</h4>
                              <p className="text-gray-600 mb-3">{notification.message}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span>Sent by: {notification.createdBy?.name || 'Admin'}</span>
                                <span>•</span>
                                <span>{new Date(notification.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                            </div>
                            <button onClick={() => handleDeleteNotification(notification._id)} className="ml-4 text-red-600 hover:text-red-800 transition">
                              <MdDelete className="text-xl" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Reports</h2>
              <p className="text-gray-600">Reports and analytics coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
