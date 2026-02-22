import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { notificationAPI } from '../services/api';
import { MdLogout, MdPersonAdd, MdDelete, MdPerson, MdAdminPanelSettings, MdSchool, MdNotifications, MdAdd, MdSend, MdHistory, MdDashboard, MdPeopleAlt, MdSettings, MdShield } from 'react-icons/md';

function SuperAdminDashboard({ user, onLogout }) {
  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showForm, setShowForm] = useState(false);
  const [showNotificationForm, setShowNotificationForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
  const [notificationData, setNotificationData] = useState({ title: '', message: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchNotifications();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/users', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSuccess('User created successfully!');
      setFormData({ name: '', email: '', password: '', role: 'student' });
      setShowForm(false);
      fetchUsers();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user');
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

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSuccess('User deleted successfully!');
      fetchUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const getRoleBadgeColor = (role) => {
    switch(role) {
      case 'superadmin': return 'bg-purple-100 text-purple-700 border border-purple-200';
      case 'admin': return 'bg-blue-100 text-blue-700 border border-blue-200';
      case 'student': return 'bg-green-100 text-green-700 border border-green-200';
      default: return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  const stats = {
    total: users.length,
    students: users.filter(u => u.role === 'student').length,
    admins: users.filter(u => u.role === 'admin').length,
    superadmins: users.filter(u => u.role === 'superadmin').length,
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <MdShield className="text-white text-xl" />
            </div>
            <span className="font-bold text-lg text-gray-800">CMS Super Admin</span>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
            <MdDashboard className="text-xl" />
            <span className="font-medium">Dashboard</span>
          </button>
          <button onClick={() => setActiveTab('users')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition ${activeTab === 'users' ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
            <MdPeopleAlt className="text-xl" />
            <span className="font-medium">User Management</span>
          </button>
          <button onClick={() => setActiveTab('notifications')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition ${activeTab === 'notifications' ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
            <MdNotifications className="text-xl" />
            <span className="font-medium">Notifications</span>
          </button>
          <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition ${activeTab === 'settings' ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
            <MdSettings className="text-xl" />
            <span className="font-medium">Settings</span>
          </button>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition">
            <MdLogout className="text-xl" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {activeTab === 'dashboard' && 'Overview'}
                {activeTab === 'users' && 'User Management'}
                {activeTab === 'notifications' && 'Notifications'}
                {activeTab === 'settings' && 'Settings'}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800">Super Admin</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">SA</span>
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
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <MdPerson className="text-blue-600 text-2xl" />
                  </div>
                  <h3 className="text-gray-500 text-sm font-medium mb-1">TOTAL USERS</h3>
                  <p className="text-3xl font-bold text-gray-800">{String(stats.total).padStart(2, '0')}</p>
                  <p className="text-xs text-green-600 mt-2">↑ 12% from last month</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <MdSchool className="text-green-600 text-2xl" />
                  </div>
                  <h3 className="text-gray-500 text-sm font-medium mb-1">STUDENTS</h3>
                  <p className="text-3xl font-bold text-gray-800">{String(stats.students).padStart(2, '0')}</p>
                  <p className="text-xs text-gray-500 mt-2">Active enrollments</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <MdAdminPanelSettings className="text-purple-600 text-2xl" />
                  </div>
                  <h3 className="text-gray-500 text-sm font-medium mb-1">ADMINS</h3>
                  <p className="text-3xl font-bold text-gray-800">{String(stats.admins).padStart(2, '0')}</p>
                  <p className="text-xs text-gray-500 mt-2">System moderators</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                    <MdShield className="text-yellow-600 text-2xl" />
                  </div>
                  <h3 className="text-gray-500 text-sm font-medium mb-1">SUPER ADMINS</h3>
                  <p className="text-3xl font-bold text-gray-800">{String(stats.superadmins).padStart(2, '0')}</p>
                  <p className="text-xs text-gray-500 mt-2">Root access</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center gap-3 mb-4">
                    <MdNotifications className="text-indigo-600 text-2xl" />
                    <h3 className="text-lg font-bold text-gray-800">Notifications Management</h3>
                  </div>
                  <p className="text-gray-600 mb-4">Broadcast updates and alerts to your student community.</p>
                  <button onClick={() => setActiveTab('notifications')} className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition">
                    Manage Notifications
                  </button>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center gap-3 mb-4">
                    <MdPeopleAlt className="text-indigo-600 text-2xl" />
                    <h3 className="text-lg font-bold text-gray-800">User Management</h3>
                  </div>
                  <p className="text-gray-600 mb-4">A detailed list of all registered system users.</p>
                  <button onClick={() => setActiveTab('users')} className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition">
                    View Users
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">User Management</h2>
                    <p className="text-sm text-gray-600">A detailed list of all registered system users.</p>
                  </div>
                  <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition">
                    <MdAdd />
                    Create User
                  </button>
                </div>
              </div>
              {showForm && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Create New User</h3>
                  <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="John Doe" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="user@example.com" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                      <input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="••••••••" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                      <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white">
                        <option value="student">Student</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div className="md:col-span-2 flex gap-3">
                      <button type="submit" className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">Create User</button>
                      <button type="button" onClick={() => setShowForm(false)} className="px-6 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition">Cancel</button>
                    </div>
                  </form>
                </div>
              )}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">User Details</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email Address</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Created Date</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((u) => (
                      <tr key={u._id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-gray-600 font-semibold text-sm">{u.name.charAt(0).toUpperCase()}</span>
                            </div>
                            <span className="font-medium text-gray-800">{u.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{u.email}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold uppercase ${getRoleBadgeColor(u.role)}`}>{u.role}</span>
                        </td>
                        <td className="px-6 py-4 text-gray-600 text-sm">{new Date(u.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                        <td className="px-6 py-4">
                          {u.role !== 'superadmin' && (
                            <button onClick={() => handleDelete(u._id)} className="text-red-600 hover:text-red-800 transition">
                              <MdDelete className="text-xl" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <MdNotifications className="text-indigo-600" />
                      Notifications Management
                    </h2>
                    <p className="text-sm text-gray-600">Broadcast updates and alerts to your student community.</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setShowNotificationForm(false)} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${!showNotificationForm ? 'bg-gray-200 text-gray-700' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'}`}>
                      <MdHistory />
                      View History ({notifications.length})
                    </button>
                    <button onClick={() => setShowNotificationForm(true)} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${showNotificationForm ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'}`}>
                      <MdAdd />
                      New Notification
                    </button>
                  </div>
                </div>
              </div>
              {showNotificationForm && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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

          {activeTab === 'settings' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Settings</h2>
              <p className="text-gray-600">Settings panel coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SuperAdminDashboard;
