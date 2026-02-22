import React, { useState, useEffect } from 'react';
import { complaintAPI, notificationAPI } from '../services/api';
import { MdLogout, MdDashboard, MdDescription, MdAdd, MdPerson, MdNotifications, MdShield, MdAccessTime, MdCheckCircle, MdPending, MdAutorenew, MdClose, MdCategory, MdNotificationsActive, MdChevronRight } from 'react-icons/md';

function StudentDashboard({ user, onLogout }) {
  const [complaints, setComplaints] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showForm, setShowForm] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [formData, setFormData] = useState({ category: '', description: '' });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      await complaintAPI.create(formData);
      setSuccess('Complaint submitted successfully! We will address it promptly.');
      setFormData({ category: '', description: '' });
      setShowForm(false);
      setActiveTab('dashboard');
      fetchComplaints();
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit complaint. Please try again.');
      console.error('Error creating complaint:', err);
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
            <span className="font-bold text-lg text-gray-800">CMS Student Portal</span>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
            <MdDashboard className="text-xl" />
            <span className="font-medium">My Dashboard</span>
          </button>
          <button onClick={() => setActiveTab('complaints')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition ${activeTab === 'complaints' ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
            <MdDescription className="text-xl" />
            <span className="font-medium">My Complaints</span>
          </button>
          <button onClick={() => setActiveTab('lodge')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition ${activeTab === 'lodge' ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
            <MdAdd className="text-xl" />
            <span className="font-medium">Lodge Complaint</span>
          </button>
          <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition ${activeTab === 'profile' ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
            <MdPerson className="text-xl" />
            <span className="font-medium">My Profile</span>
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
                {activeTab === 'dashboard' && 'Student Overview'}
                {activeTab === 'complaints' && 'My Complaints'}
                {activeTab === 'lodge' && 'Lodge Complaint'}
                {activeTab === 'profile' && 'My Profile'}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                <MdNotifications className="text-2xl" />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500">ID: STU-{user._id?.slice(-6) || '000000'}</p>
                </div>
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">{user.name.charAt(0).toUpperCase()}{user.name.split(' ')[1]?.charAt(0).toUpperCase() || 'S'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Panel */}
        {showNotifications && (
          <div className="absolute right-8 top-20 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <MdNotificationsActive className="text-indigo-600" />
                Notifications
              </h3>
              <button onClick={() => setShowNotifications(false)} className="text-gray-500 hover:text-gray-700">
                <MdClose className="text-xl" />
              </button>
            </div>
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <MdNotifications className="text-gray-300 text-5xl mx-auto mb-3" />
                <p className="text-gray-500">No notifications yet</p>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {notifications.map((notification) => (
                  <div key={notification._id} className="bg-indigo-50 rounded-lg p-3 border-l-4 border-indigo-500">
                    <h4 className="font-bold text-gray-800 text-sm mb-1">{notification.title}</h4>
                    <p className="text-gray-700 text-sm mb-2">{notification.message}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(notification.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="p-8">
          {/* Success/Error Messages */}
          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-lg flex items-center gap-3">
              <MdCheckCircle className="text-2xl" />
              <p className="font-medium">{success}</p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg flex items-center gap-3">
              <MdClose className="text-2xl" />
              <p className="font-medium">{error}</p>
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-gray-400">
                  <h3 className="text-gray-500 text-sm font-medium mb-2">TOTAL LODGED</h3>
                  <p className="text-4xl font-bold text-gray-800">{String(stats.total).padStart(2, '0')}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-400">
                  <h3 className="text-gray-500 text-sm font-medium mb-2">IN PROGRESS</h3>
                  <p className="text-4xl font-bold text-gray-800">{String(stats.inProgress).padStart(2, '0')}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-400">
                  <h3 className="text-gray-500 text-sm font-medium mb-2">RESOLVED</h3>
                  <p className="text-4xl font-bold text-gray-800">{String(stats.resolved).padStart(2, '0')}</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">My Complaints</h2>
                    <p className="text-sm text-gray-600">Track the real-time status of your submitted grievances.</p>
                  </div>
                  <button onClick={() => setActiveTab('lodge')} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition font-semibold flex items-center gap-2">
                    <MdAdd />
                    New Complaint
                  </button>
                </div>

                {complaints.length === 0 ? (
                  <div className="text-center py-12">
                    <MdDescription className="text-gray-300 text-6xl mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No complaints submitted yet</p>
                    <button onClick={() => setActiveTab('lodge')} className="text-indigo-600 hover:text-indigo-700 font-medium">
                      Submit your first complaint →
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {complaints.map((complaint) => (
                      <div key={complaint._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition cursor-pointer group">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase border ${getStatusColor(complaint.status)}`}>
                                {complaint.status}
                              </span>
                              <h3 className="font-bold text-gray-800">{complaint.category}</h3>
                            </div>
                            <p className="text-gray-700 mb-2">{complaint.description}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <MdAccessTime />
                                {new Date(complaint.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                              <span>REF: {complaint._id?.slice(-6) || '000000'}</span>
                            </div>
                          </div>
                          <MdChevronRight className="text-gray-400 text-2xl group-hover:text-gray-600 transition" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'complaints' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">My Complaints</h2>
                  <p className="text-sm text-gray-600">Track the real-time status of your submitted grievances.</p>
                </div>
                <button onClick={() => setActiveTab('lodge')} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition font-semibold flex items-center gap-2">
                  <MdAdd />
                  New Complaint
                </button>
              </div>

              {complaints.length === 0 ? (
                <div className="text-center py-12">
                  <MdDescription className="text-gray-300 text-6xl mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No complaints submitted yet</p>
                  <button onClick={() => setActiveTab('lodge')} className="text-indigo-600 hover:text-indigo-700 font-medium">
                    Submit your first complaint →
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {complaints.map((complaint) => (
                    <div key={complaint._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition cursor-pointer group">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase border ${getStatusColor(complaint.status)}`}>
                              {complaint.status}
                            </span>
                            <h3 className="font-bold text-gray-800">{complaint.category}</h3>
                          </div>
                          <p className="text-gray-700 mb-2">{complaint.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <MdAccessTime />
                              {new Date(complaint.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                            <span>REF: {complaint._id?.slice(-6) || '000000'}</span>
                          </div>
                        </div>
                        <MdChevronRight className="text-gray-400 text-2xl group-hover:text-gray-600 transition" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'lodge' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800">Lodge New Complaint</h2>
                <p className="text-sm text-gray-600">Submit your grievance and we'll address it promptly.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <MdCategory />
                    Complaint Category
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    placeholder="e.g., Infrastructure, Faculty, Facilities"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <MdDescription />
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
                    rows="6"
                    placeholder="Describe your complaint in detail..."
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                  >
                    <MdAdd />
                    Submit Complaint
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('dashboard')}
                    className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">My Profile</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">{user.name.charAt(0).toUpperCase()}{user.name.split(' ')[1]?.charAt(0).toUpperCase() || 'S'}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{user.name}</h3>
                    <p className="text-gray-600">Student</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email</p>
                    <p className="font-medium text-gray-800">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Student ID</p>
                    <p className="font-medium text-gray-800">STU-{user._id?.slice(-6) || '000000'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Complaints</p>
                    <p className="font-medium text-gray-800">{complaints.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Resolved</p>
                    <p className="font-medium text-gray-800">{stats.resolved}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
