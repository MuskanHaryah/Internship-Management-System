<div align="center">

# 🎓 Internship Management System

### A Modern Full-Stack Solution for Managing Internship Programs

[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Usage](#-usage) • [API Documentation](#-api-documentation) • [Contributing](#-contributing)

---

</div>

## 📋 Overview

The **Internship Management System** is a comprehensive, production-ready platform designed to streamline the management of internship programs. Built with modern technologies and best practices, it provides an intuitive interface for administrators to manage interns, assign tasks, track progress, and provide feedback—all in one centralized location.

### 🎯 Key Highlights

- **Role-Based Access Control**: Separate dashboards and permissions for Admins and Interns
- **Real-Time Notifications**: Stay updated with instant notifications for task assignments, submissions, and feedback
- **Progress Tracking**: Visual analytics and progress reports for comprehensive oversight
- **Dark Mode Support**: Enhanced user experience with theme customization
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices
- **Secure Authentication**: JWT-based authentication with encrypted password storage

---

## ✨ Features

### 👨‍💼 For Administrators

- **User Management**
  - Create, update, and delete intern accounts
  - View detailed intern profiles and progress
  - Filter and search functionality for easy navigation

- **Task Management**
  - Create and assign tasks with deadlines and priorities
  - Set task status (Pending, In Progress, Completed, Reviewed)
  - Track submission URLs and review completed work

- **Feedback System**
  - Provide structured feedback with ratings (1-5 stars)
  - Categorize feedback (Quality, Timeliness, Communication, Overall)
  - Track feedback history for each intern

- **Analytics Dashboard**
  - Overview of active interns and tasks
  - Task completion statistics
  - Performance metrics and trends

### 👨‍🎓 For Interns

- **Personal Dashboard**
  - View assigned tasks with deadlines and priorities
  - Track task completion progress
  - Access feedback and ratings from supervisors

- **Task Submission**
  - Submit completed tasks with URLs
  - Update task status in real-time
  - View task descriptions and requirements

- **Notifications**
  - Receive alerts for new task assignments
  - Get notified when feedback is provided
  - Stay informed about deadline reminders

- **Profile Management**
  - Update personal information
  - Change password securely
  - View performance history

### 🎨 Design Features

- **Modern UI/UX**: Clean, intuitive interface with smooth animations
- **Dark Mode**: Eye-friendly theme option for extended usage
- **Responsive Layout**: Optimized for all screen sizes
- **Interactive Components**: Dynamic forms, modals, and notifications
- **Accessibility**: ARIA-compliant components for inclusive design

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | UI Framework | 19.2.0 |
| **Vite** | Build Tool | 6.0+ |
| **Tailwind CSS** | Styling | 3.4+ |
| **Framer Motion** | Animations | 12.23+ |
| **React Router** | Navigation | 7.1+ |
| **Axios** | HTTP Client | 1.13+ |
| **React Query** | Data Fetching | 5.90+ |
| **React Hook Form** | Form Management | 7.69+ |
| **React Hot Toast** | Notifications | 2.6+ |
| **Lucide React** | Icons | 0.562+ |

### Backend

| Technology | Purpose | Version |
|------------|---------|---------|
| **Node.js** | Runtime Environment | 18+ |
| **Express** | Web Framework | 4.21+ |
| **MongoDB** | Database | 6.0+ |
| **Mongoose** | ODM | 8.10+ |
| **JWT** | Authentication | 9.0+ |
| **Bcrypt** | Password Hashing | 5.1+ |
| **Dotenv** | Environment Config | 17.2+ |
| **CORS** | Cross-Origin Support | 2.8+ |

### Development & Testing

- **Jest** - Backend testing framework
- **Vitest** - Frontend testing framework
- **Supertest** - API integration testing
- **React Testing Library** - Component testing
- **ESLint** - Code linting
- **Prettier** - Code formatting

---

## 📦 Installation

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v6.0 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/)

### Clone the Repository

```bash
git clone https://github.com/yourusername/Internship-Management-System.git
cd Internship-Management-System
```

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env file with your configuration
# Required variables:
# - MONGODB_URI=mongodb://localhost:27017/internship-management
# - JWT_SECRET=your_secret_key_here
# - PORT=5000
```

**Environment Variables (.env)**:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/internship-management
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
```

### Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd ../frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env file
# Required variable:
# - VITE_API_URL=http://localhost:5000
```

**Environment Variables (.env)**:
```env
VITE_API_URL=http://localhost:5000
```

---

## 🚀 Usage

### Running the Application

#### Start Backend Server

```bash
# From backend directory
npm start

# For development with auto-reload
npm run dev
```

The backend server will start on `http://localhost:5000`

#### Start Frontend Development Server

```bash
# From frontend directory
npm run dev
```

The frontend will start on `http://localhost:5173`

### Default Admin Credentials

For initial setup, you can create an admin user via the registration page or use the seed script:

```bash
# From backend directory
npm run seed
```

This creates a default admin account:
- **Email**: admin@internship.com
- **Password**: Admin@123

⚠️ **Important**: Change these credentials immediately after first login!

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# Run tests in watch mode
npm run test:watch
```

---

## 📖 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| GET | `/auth/me` | Get current user | Yes |
| PUT | `/auth/updateprofile` | Update user profile | Yes |
| PUT | `/auth/updatepassword` | Change password | Yes |

### User Management Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/users` | Get all users | Yes | Admin |
| GET | `/users/:id` | Get user by ID | Yes | Admin |
| PUT | `/users/:id` | Update user | Yes | Admin |
| DELETE | `/users/:id` | Delete user | Yes | Admin |
| GET | `/users/interns/stats` | Get intern statistics | Yes | Admin |

### Task Management Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/tasks` | Get all tasks | Yes |
| POST | `/tasks` | Create new task | Yes (Admin) |
| GET | `/tasks/:id` | Get task by ID | Yes |
| PUT | `/tasks/:id` | Update task | Yes |
| DELETE | `/tasks/:id` | Delete task | Yes (Admin) |
| PUT | `/tasks/:id/submit` | Submit task | Yes (Intern) |

### Feedback Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/feedback` | Get all feedback | Yes |
| POST | `/feedback` | Create feedback | Yes (Admin) |
| GET | `/feedback/:id` | Get feedback by ID | Yes |
| PUT | `/feedback/:id` | Update feedback | Yes (Admin) |
| DELETE | `/feedback/:id` | Delete feedback | Yes (Admin) |

### Notification Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/notifications` | Get user notifications | Yes |
| PUT | `/notifications/:id/read` | Mark as read | Yes |
| PUT | `/notifications/mark-all-read` | Mark all as read | Yes |
| DELETE | `/notifications/:id` | Delete notification | Yes |

### Request/Response Examples

**Register User**
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "intern"
}

Response (201):
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "intern"
    }
  }
}
```

**Create Task**
```json
POST /api/tasks
Authorization: Bearer {token}
{
  "title": "Build Authentication System",
  "description": "Implement JWT-based authentication",
  "assignedTo": "intern_user_id",
  "deadline": "2026-02-01",
  "priority": "high"
}

Response (201):
{
  "success": true,
  "data": {
    "_id": "task_id",
    "title": "Build Authentication System",
    "status": "pending",
    "priority": "high",
    // ... other fields
  }
}
```

---

## 🗂️ Project Structure

```
Internship-Management-System/
├── backend/
│   ├── controllers/       # Request handlers
│   ├── models/           # Database schemas
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── utils/            # Helper functions
│   ├── tests/            # Test files
│   ├── .env.example      # Environment template
│   ├── server.js         # Entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom hooks
│   │   ├── utils/        # Utility functions
│   │   ├── services/     # API services
│   │   ├── context/      # React context
│   │   ├── tests/        # Test files
│   │   └── App.jsx       # Root component
│   ├── public/           # Static assets
│   ├── .env.example      # Environment template
│   ├── vite.config.js    # Vite configuration
│   └── package.json
│
├── DEPLOYMENT.md         # Deployment guide
├── TESTING.md           # Testing documentation
└── README.md            # This file
```

---

## 🧪 Testing

The project includes comprehensive test suites for both frontend and backend:

### Backend Tests
- Authentication API tests
- Task management tests
- Feedback system tests
- User management tests

### Frontend Tests
- Component unit tests
- Integration tests
- User interaction tests

For detailed testing information, see [TESTING.md](TESTING.md)

---

## 🚢 Deployment

This application is designed to be deployed on modern cloud platforms:

- **Frontend**: Vercel, Netlify, or similar
- **Backend**: Railway, Render, or Heroku
- **Database**: MongoDB Atlas

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)

### Live Demo

🔗 **Coming Soon!** - Deployment in progress

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Coding Guidelines

- Follow existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Your Name**

- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- Built with modern web technologies and best practices
- Inspired by real-world internship management needs
- Thanks to all open-source contributors

---

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/Internship-Management-System/issues) page
2. Create a new issue with detailed information
3. Reach out via email for urgent matters

---

<div align="center">

Made with ❤️ by [Your Name]

⭐ Star this repository if you find it helpful!

</div>