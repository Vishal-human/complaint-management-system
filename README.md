# Complaint Management System

A modern, full-stack web application designed for colleges and hostels to efficiently manage student complaints. Built with the MERN stack (MongoDB, Express.js, React, Node.js) and styled with Tailwind CSS, featuring a professional sidebar-based interface.

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [User Roles & Permissions](#user-roles--permissions)
- [Usage Guide](#usage-guide)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Security Features](#security-features)
- [Screenshots](#screenshots)
- [Contributing](#contributing)

## 🎯 Overview

The Complaint Management System streamlines the process of handling student grievances by providing a centralized platform where students can submit complaints online and track their status in real-time, while administrators can efficiently manage, prioritize, and resolve issues. The system features a modern sidebar-based interface consistent across all user roles.

## ✨ Features

### For Students
- **Self Registration** - Students can register their own accounts (automatically assigned student role)
- **Modern Dashboard** - Sidebar navigation with overview statistics
- **Submit Complaints** - Easy-to-use form with category and detailed description
- **Track Status** - Real-time tracking of complaint status (Pending, In Progress, Resolved)
- **View History** - Access all previously submitted complaints with reference numbers
- **Notifications** - Receive important updates from administrators
- **Profile Management** - View personal information and complaint statistics
- **Success Feedback** - Clear confirmation messages after actions

### For Administrators
- **Dashboard Overview** - Statistics cards showing total, pending, in-progress, and resolved complaints
- **Complaint Management** - View all student complaints with detailed information
- **Status Updates** - Change complaint status with dropdown selection
- **Student Information** - Access student details (name, email) for each complaint
- **Notification System** - Broadcast messages to all students
- **Notification History** - View and manage sent notifications
- **Filter Options** - Organize and filter complaints efficiently
- **Modern Sidebar** - Consistent navigation across Dashboard, Complaints, Notifications, and Reports

### For Super Admin
- **User Management Dashboard** - Complete control over system users
- **Create Users** - Create admin and student accounts with role assignment
- **Delete Users** - Remove users from the system (except super admin)
- **User Statistics** - View total users, students, admins, and super admins
- **Notification Management** - Send and manage notifications to students
- **Notification History** - Track all sent notifications with delete option
- **Role-Based Access** - Strict permission controls
- **Modern Interface** - Professional sidebar with Dashboard, User Management, Notifications, and Settings tabs

## 🛠 Technology Stack

### Frontend
- **React.js 18.2.0** - Component-based UI library
- **React Router DOM 6.20.0** - Client-side routing
- **Tailwind CSS 3.4.1** - Utility-first CSS framework for modern styling
- **React Icons** - Material Design icons library
- **Axios 1.6.0** - HTTP client for API requests
- **PostCSS & Autoprefixer** - CSS processing

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT (jsonwebtoken)** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing and encryption
- **dotenv** - Environment variable management
- **cors** - Cross-Origin Resource Sharing

## 📁 Project Structure

```
Complaint-Management-System/
├── backend/
│   ├── config/
│   │   └── db.js                      # MongoDB connection configuration
│   ├── middleware/
│   │   └── auth.js                    # JWT authentication middleware
│   ├── models/
│   │   ├── User.js                    # User schema (student/admin/superadmin)
│   │   ├── Complaint.js               # Complaint schema
│   │   └── Notification.js            # Notification schema
│   ├── routes/
│   │   ├── auth.js                    # Authentication routes (login/register)
│   │   ├── complaints.js              # Complaint CRUD operations
│   │   ├── users.js                   # User management (super admin)
│   │   └── notifications.js           # Notification management
│   ├── utils/
│   │   └── initSuperAdmin.js          # Auto-create super admin on first run
│   ├── .env                           # Environment variables
│   ├── .env.example                   # Environment variables template
│   ├── server.js                      # Server entry point
│   └── package.json                   # Backend dependencies
│
├── frontend/
│   ├── public/
│   │   └── index.html                 # HTML template
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.js               # Login page with modern design
│   │   │   ├── Register.js            # Student registration page
│   │   │   ├── StudentDashboard.js    # Student interface with sidebar
│   │   │   ├── AdminDashboard.js      # Admin interface with sidebar
│   │   │   └── SuperAdminDashboard.js # Super admin interface with sidebar
│   │   ├── services/
│   │   │   └── api.js                 # API service layer (axios instances)
│   │   ├── App.js                     # Main app component with routing
│   │   ├── index.js                   # React entry point
│   │   └── index.css                  # Tailwind CSS directives
│   ├── tailwind.config.js             # Tailwind configuration
│   ├── postcss.config.js              # PostCSS configuration
│   └── package.json                   # Frontend dependencies
│
├── README.md                          # Project documentation
documentation
└── .gitignore                         # Git ignore rules
```

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** - Local installation 
- **npm** package manager
- **Git** (optional) - For cloning the repository

### Backend Setup

1. **Navigate to the backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create a `.env` file** in the backend directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/complaint_management
JWT_SECRET=your_jwt_secret_key_here
```

4. **Start MongoDB service** (if using local MongoDB):
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

5. **Start the backend server:**
```bash

# Run this from the backend folter
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

The backend server will run on `http://localhost:5000`

**Console Output:**
```
Server running on port 5000
MongoDB Connected
✅ Super Admin created successfully!
📧 Email: superadmin@cms.com
🔑 Password: SuperAdmin@123
⚠️  Please change the password after first login!
```

### Frontend Setup

1. **Navigate to the frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npm start
```

The frontend will run on `http://localhost:3000`

4. **Build for production:**
```bash
npm run build
```

## 👥 User Roles & Permissions

### 🔴 Super Admin
**Access Level:** Full System Control

**Capabilities:**
- Create and delete admin and student accounts
- View all system users with detailed information
- Send notifications to all students
- View and delete notification history
- Access user management dashboard
- View system statistics (total users, students, admins, super admins)
- Cannot be deleted through the UI
- Only one super admin exists in the system

**Default Credentials:**
- Email: `superadmin@cms.com`
- Password: `SuperAdmin@123`

**Dashboard Sections:**
- Dashboard (Overview with statistics)
- User Management (Create/Delete users)
- Notifications (Send/View history)
- Settings (Coming soon)

### 🟣 Admin
**Access Level:** Complaint Management

**Capabilities:**
- View all student complaints
- Update complaint status (Pending → In Progress → Resolved)
- View student information for each complaint
- Send notifications to all students
- View and delete notification history
- Access complaint statistics
- Filter and organize complaints

**Account Creation:** Only super admin can create admin accounts

**Dashboard Sections:**
- Dashboard (Complaint overview with stats)
- All Complaints (Manage all complaints)
- Notifications (Send/View history)
- Reports (Coming soon)

### 🟢 Student
**Access Level:** Personal Complaints

**Capabilities:**
- Self-register for an account
- Submit new complaints with category and description
- View own complaints only
- Track complaint status in real-time
- Receive notifications from administrators
- View notification history
- Access personal profile information
- View complaint statistics (total, in progress, resolved)

**Account Creation:** Self-registration available

**Dashboard Sections:**
- My Dashboard (Overview with personal stats)
- My Complaints (View all submitted complaints)
- Lodge Complaint (Submit new complaint)
- My Profile (Personal information)

## 📖 Usage Guide

### First Time Setup - Super Admin

1. **Start the backend server** - Super admin account is automatically created
2. **Check console output** for credentials:
   ```
   ✅ Super Admin created successfully!
   📧 Email: superadmin@cms.com
   🔑 Password: SuperAdmin@123
   ```
3. **Login** at `http://localhost:3000/login`
4. **Navigate to User Management** to create admin and student accounts
5. **⚠️ Important:** Change the default password after first login

### Super Admin Workflow

1. **Login** with super admin credentials
2. **Dashboard Tab:**
   - View user statistics (Total, Students, Admins, Super Admins)
   - Quick access to Notifications and User Management
3. **User Management Tab:**
   - Click "Create User" button
   - Fill in: Name, Email, Password, Role (Student/Admin)
   - Click "Create User" to add
   - View all users in table format
   - Delete users (except super admin) using delete icon
4. **Notifications Tab:**
   - Toggle between "New Notification" and "History"
   - Create: Enter title and message, click "Send to All Students"
   - History: View all sent notifications, delete if needed
5. **Settings Tab:** Coming soon

### Admin Workflow

1. **Account Creation:**
   - Super admin creates your admin account
   - Receive credentials (email and password)
2. **Login** with provided credentials
3. **Dashboard Tab:**
   - View complaint statistics (Total, Pending, In Progress, Resolved)
   - See notification management banner
   - View recent complaints (first 3)
   - Click "View All Complaints" for complete list
4. **All Complaints Tab:**
   - View all student complaints
   - See student name and email for each complaint
   - Update status using dropdown (Pending/In Progress/Resolved)
   - Click "View Details" for more information
   - Use filter button to organize complaints
5. **Notifications Tab:**
   - Toggle between "New Notification" and "History"
   - Send notifications to all students
   - View and delete notification history
6. **Reports Tab:** Coming soon

### Student Workflow

1. **Registration:**
   - Go to `http://localhost:3000/register`
   - Fill in: Name, Email, Password
   - Click "Create Account"
   - Automatically assigned student role
2. **Login** with your credentials
3. **My Dashboard Tab:**
   - View personal statistics (Total Lodged, In Progress, Resolved)
   - See all your complaints with status badges
   - Click "New Complaint" to submit
   - Click on any complaint to view details
4. **My Complaints Tab:**
   - View complete list of all submitted complaints
   - See status, category, description, and reference number
   - Track submission date and time
5. **Lodge Complaint Tab:**
   - Enter complaint category (e.g., Infrastructure, Faculty, Facilities)
   - Write detailed description
   - Click "Submit Complaint"
   - See success message: "Complaint submitted successfully!"
   - Automatically redirected to dashboard
6. **My Profile Tab:**
   - View personal information
   - See Student ID
   - Check complaint statistics
7. **Notifications:**
   - Click bell icon in header to view notifications
   - See notification count badge
   - Read messages from administrators

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/register` | Register new student account | Public |
| POST | `/login` | Login user (all roles) | Public |

**Request Body (Register):**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Request Body (Login):**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

### Complaint Routes (`/api/complaints`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get all complaints (filtered by role) | Authenticated |
| POST | `/` | Create new complaint | Student |
| PUT | `/:id/status` | Update complaint status | Admin/Super Admin |

**Request Body (Create):**
```json
{
  "category": "Infrastructure",
  "description": "Broken AC in classroom 101"
}
```

**Request Body (Update Status):**
```json
{
  "status": "In Progress"
}
```

### User Management Routes (`/api/users`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get all users | Super Admin |
| POST | `/` | Create new user (admin/student) | Super Admin |
| DELETE | `/:id` | Delete user | Super Admin |

**Request Body (Create User):**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "password123",
  "role": "admin"
}
```

### Notification Routes (`/api/notifications`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get all notifications | Authenticated |
| POST | `/` | Create new notification | Admin/Super Admin |
| DELETE | `/:id` | Delete notification | Admin/Super Admin |

**Request Body (Create):**
```json
{
  "title": "Important Announcement",
  "message": "System maintenance scheduled for Saturday"
}
```

## 🗄 Database Schema

### User Model
```javascript
{
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true  // Hashed with bcrypt
  },
  role: {
    type: String,
    enum: ['student', 'admin', 'superadmin'],
    default: 'student'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

### Complaint Model
```javascript
{
  studentId: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

### Notification Model
```javascript
{
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  createdBy: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

## 🔒 Security Features

- **Password Hashing** - bcryptjs with salt rounds for secure password storage
- **JWT Authentication** - Secure token-based authentication with 7-day expiration
- **Protected Routes** - Middleware validates JWT tokens for all protected endpoints
- **Role-Based Access Control** - Strict permission checks for each user role
- **Super Admin Protection** - Cannot be deleted through UI, only one exists
- **Input Validation** - Required fields enforced on both client and server
- **CORS Configuration** - Cross-Origin Resource Sharing properly configured
- **Environment Variables** - Sensitive data stored in .env files
- **Auto Super Admin Creation** - Secure initialization on first run
- **HTTP Headers** - Secure headers configuration

## 📸 Screenshots

### Student Dashboard
- Modern sidebar navigation
- Statistics cards (Total Lodged, In Progress, Resolved)
- Complaint list with status badges
- Notification bell with count badge

### Admin Dashboard
- Sidebar with Dashboard, Complaints, Notifications, Reports
- Statistics cards (Total, Pending, In Progress, Resolved)
- Notification management banner
- Complaint cards with status update dropdown

### Super Admin Dashboard
- Sidebar with Dashboard, User Management, Notifications, Settings
- User statistics cards
- User management table
- Create user form
- Notification management

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 🆘 Support

For issues, questions, or contributions:
- Open an issue in the repository
- Contact the development team
- Check documentation files (SETUP.md, CHANGELOG.md, etc.)

## 🎯 Future Enhancements

- [ ] Email notifications for status updates
- [ ] File attachment support for complaints
- [ ] Advanced filtering and search functionality
- [ ] Analytics and reporting dashboard
- [ ] Mobile responsive improvements
- [ ] Multi-language support
- [ ] Export complaints to PDF/Excel
- [ ] Complaint priority levels
- [ ] Comment system for complaints
- [ ] Real-time updates with WebSockets
- [ ] Password reset functionality
- [ ] Two-factor authentication
- [ ] Activity logs and audit trails

---

**Built with ❤️ using MERN Stack + Tailwind CSS**
