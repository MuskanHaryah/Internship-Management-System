<div align="center">

# 🎓 Internship Management System

### A Modern Full-Stack Solution for Managing Internship Programs

[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

[✨ Features](#-features) • [🛠️ Tech Stack](#️-tech-stack) • [📦 Installation](#-installation) • [🚀 Quick Start](#-quick-start) • [� Deployment](#-deployment)

---

</div>

## 📋 Overview

A comprehensive, production-ready platform designed to streamline internship program management. Built with the MERN stack and modern best practices, featuring role-based access control, real-time notifications, task management, and performance tracking.

> 💡 **Perfect for**: Educational institutions, tech companies, startups, and organizations running internship programs

### 🎯 Key Features

<table>
<tr>
<td width="50%">

**🔐 Secure & Reliable**
- JWT-based authentication
- Encrypted password storage
- Role-based access control
- Production-ready architecture

</td>
<td width="50%">

**⚡ Fast & Modern**
- Lightning-fast Vite build
- React 19 with latest features
- Optimized API responses
- Real-time notifications

</td>
</tr>
<tr>
<td width="50%">

**🎨 Beautiful UI/UX**
- Dark mode support
- Smooth animations
- Responsive design
- Intuitive navigation

</td>
<td width="50%">

**📊 Comprehensive**
- Task management
- Progress tracking
- Feedback system
- Analytics dashboard

</td>
</tr>
</table>

---

## ✨ Features

### 👨‍💼 Admin Dashboard
- Complete user management (Create, Update, Delete)
- Task assignment with priorities and deadlines
- Structured feedback system with ratings
- Real-time analytics and progress tracking
- Notification management

### 👨‍🎓 Intern Dashboard
- Personal task board with status tracking
- Feedback history and performance ratings
- Real-time notifications for assignments
- Profile management and password updates
- Task submission with URLs

### 🎨 Design & UX
- Modern, clean interface with smooth animations
- Dark mode for comfortable viewing
- Fully responsive across all devices
- Accessible components (ARIA-compliant)
- Interactive forms and modals

---

## 🛠️ Tech Stack

**Frontend:** React 19, Vite, Tailwind CSS, Framer Motion, React Router, React Query, Axios  
**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Bcrypt  
**Testing:** Jest, Vitest, Supertest, React Testing Library

<details>
<summary><b>📚 View Detailed Tech Stack</b></summary>

### Frontend
- **React 19.2.0** - UI Framework
- **Vite 6.0+** - Build Tool
- **Tailwind CSS 3.4+** - Styling
- **Framer Motion 12.23+** - Animations
- **React Router 7.1+** - Navigation
- **React Query 5.90+** - Data Fetching
- **Axios 1.13+** - HTTP Client
- **React Hook Form 7.69+** - Form Management
- **Lucide React 0.562+** - Icons

### Backend
- **Node.js 18+** - Runtime
- **Express 4.21+** - Web Framework
- **MongoDB 6.0+** - Database
- **Mongoose 8.10+** - ODM
- **JWT 9.0+** - Authentication
- **Bcrypt 5.1+** - Password Hashing

</details>

---

## 📦 Installation

### Prerequisites
- Node.js (v18+)
- MongoDB (v6.0+)
- Git

### Quick Setup

```bash
# Clone repository
git clone https://github.com/MuskanHaryah/Internship-Management-System.git
cd Internship-Management-System

# Backend setup
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Frontend setup
cd ../frontend
npm install
# Create .env with: VITE_API_URL=http://localhost:5000
```

---

## 🚀 Quick Start

<details open>
<summary><b>🎬 Running Locally</b></summary>

<br>

**Start Backend** (Terminal 1)
```bash
cd backend
npm run dev
```
✅ Running at `http://localhost:5000`

**Start Frontend** (Terminal 2)
```bash
cd frontend
npm run dev
```
✅ Running at `http://localhost:5173`

</details>

<details>
<summary><b>👤 Admin Setup</b></summary>

<br>

```bash
cd backend
npm run seed
```

**Login Credentials:**
- 📧 Email: `admin@internship.com`
- 🔑 Password: `Admin@123`

⚠️ Change these after first login!

</details>

<details>
<summary><b>🧪 Running Tests</b></summary>

<br>

```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test
```

</details>

---

## 📖 API Documentation

### Overview
Base URL: `http://localhost:5000/api`

All endpoints require JWT authentication (except auth routes)

<details>
<summary><b>📡 View API Endpoints</b></summary>

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user
- `PUT /auth/updateprofile` - Update profile
- `PUT /auth/updatepassword` - Change password

### Users (Admin only)
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Tasks
- `GET /tasks` - Get all tasks
- `POST /tasks` - Create task (Admin)
- `GET /tasks/:id` - Get task by ID
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task (Admin)
- `PUT /tasks/:id/submit` - Submit task (Intern)

### Feedback (Admin only)
- `GET /feedback` - Get all feedback
- `POST /feedback` - Create feedback
- `GET /feedback/:id` - Get feedback by ID
- `PUT /feedback/:id` - Update feedback
- `DELETE /feedback/:id` - Delete feedback

### Notifications
- `GET /notifications` - Get user notifications
- `PUT /notifications/:id/read` - Mark as read
- `PUT /notifications/mark-all-read` - Mark all as read

</details>

---

## 🗂️ Project Structure

```
├── backend/
│   ├── controllers/       # Request handlers
│   ├── models/           # Database schemas
│   ├── routes/           # API routes
│   ├── middleware/       # Auth & validation
│   └── server.js         # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   └── App.jsx       # Root component
│   └── vite.config.js
│
├── DEPLOYMENT.md         # Deployment guide
└── TESTING.md           # Testing docs
```

---

## 🚢 Deployment

**Recommended Stack:**
- Frontend: Vercel
- Backend: Railway
- Database: MongoDB Atlas


### 🌐 Live Demo

> 🚀 Deployment in progress - Link will be added soon!

---

## 🧪 Testing

Comprehensive test coverage for both frontend and backend components.

> 📝 See [TESTING.md](TESTING.md) for detailed testing documentation

---

## 👨‍💻 Author

**Muskan Haryah** - Full Stack Developer

<div align="center">

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/MuskanHaryah)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/muskan-haryah-b4794b2ba)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:muskanharyah36@gmail.com)

</div>

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

Special thanks to the amazing open-source community and the teams behind React, Node.js, MongoDB, Tailwind CSS, and all the other technologies that made this project possible.

---

## 📞 Support

<div align="center">

| 🐛 Bug Reports | 💡 Feature Requests | 💬 Questions |
|:---:|:---:|:---:|
| [Create Issue](https://github.com/MuskanHaryah/Internship-Management-System/issues) | [Suggest Feature](https://github.com/MuskanHaryah/Internship-Management-System/issues) | [Start Discussion](https://github.com/MuskanHaryah/Internship-Management-System/discussions) |

**📧 Email:** [muskanharyah36@gmail.com](mailto:muskanharyah36@gmail.com)

</div>

---

<div align="center">

### ⭐ Show Your Support

If this project helped you, please give it a ⭐ star!

![GitHub stars](https://img.shields.io/github/stars/MuskanHaryah/Internship-Management-System?style=social)
![GitHub forks](https://img.shields.io/github/forks/MuskanHaryah/Internship-Management-System?style=social)

---

Made with ❤️ and ☕ by **Muskan Haryah**

**© 2026 Muskan Haryah. All rights reserved.**

</div>

---

</div>

## 📋 Overview

The **Internship Management System** is a comprehensive, production-ready platform designed to streamline the management of internship programs. Built with modern technologies and best practices, it provides an intuitive interface for administrators to manage interns, assign tasks, track progress, and provide feedback—all in one centralized location.

> 💡 **Perfect for**: Educational institutions, tech companies, startups, and organizations running internship programs

### 🎯 Why Choose This System?

<table>
<tr>
<td width="50%">

**🔐 Secure & Reliable**
- JWT-based authentication
- Encrypted password storage
- Role-based access control
- Production-ready architecture

</td>
<td width="50%">

**⚡ Fast & Modern**
- Lightning-fast Vite build
- React 19 with latest features
- Optimized API responses
- Real-time updates

</td>
</tr>
<tr>
<td width="50%">

**🎨 Beautiful UI/UX**
- Dark mode support
- Smooth animations
- Responsive design
- Intuitive navigation

</td>
<td width="50%">

**📊 Comprehensive Features**
- Task management
- Progress tracking
- Feedback system
- Analytics dashboard

</td>
</tr>
</table>

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
# - MOQuick Start

<details open>
<summary><b>🎬 Running the Application</b></summary>

<br>

**Step 1: Start Backend Server**

```bash
cd backend
npm run dev
```
✅ Backend running at `http://localhost:5000`

**Step 2: Start Frontend Server** (in new terminal)

```bash
cd frontend
npm run dev
```
✅ Frontend running at `http://localhost:5173`

**Step 3: Open in Browser**

Navigate to `http://localhost:5173` and you're ready to go! 🎉

</details>

<details>
<summary><b>👤 Default Admin Access</b></summary>

<br>

Create an admin account using the seed script:

```bash
cd backend
npm run seed
```

**Default Credentials:**
```
📧 Email: admin@internship.com
🔑 Password: Admin@123
```

> ⚠️ **Security Alert**: Change these credentials immediately after first login!

</details>

<details>
<summary><b>🧪 Running Tests</b></summary>

<br>

**Backend Tests**
```bash
cd backend
npm test                    # Run all tests
npm run test:watch         # Watch mode
```

**Frontend Tests**
```bash
cd frontend
npm test                    # Run all tests
npm run test:watch         # Watch mode
```

</details>

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
🌐 Live Demo

> 🚀 **Status**: Ready for deployment!  
> 📝 **Note**: Add your live URL here after deploying to Vercel + Railway

```bash
# After deployment, update this section with:
🔗 Live Demo: https://your-app.vercel.app
📡 Backend API: https://your-backend.railway.app
```
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


### Live Demo

🔗 **Coming Soon!** - Deployment in progress

---

## 👨‍💻 Author

**Muskan Haryah** - *Full Stack Developer*

<div align="center">

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/MuskanHaryah)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/muskan-haryah-b4794b2ba)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:muskanharyah36@gmail.com)

</div>

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

Special thanks to:

- 🎨 **Tailwind CSS** team for the amazing utility-first CSS framework
- ⚛️ **React** team for the powerful UI library
- 🚀 **Vite** team for the blazing-fast build tool
- 💚 **Node.js** community for the robust backend ecosystem
- 🍃 **MongoD & Community

<div align="center">

### Need Help?

| Type | Link |
|------|------|
| 🐛 **Bug Reports** | [Create an Issue](https://github.com/MuskanHaryah/Internship-Management-System/issues/new?labels=bug) |
| 💡 **Feature Requests** | [Suggest a Feature](https://github.com/MuskanHaryah/Internship-Management-System/issues/new?labels=enhancement) |
| 💬 **Questions** | [Start a Discussion](https://github.com/MuskanHaryah/Internship-Management-System/discussions) |
| 📧 **Email** | [muskanharyah36@gmail.com](mailto:muskanharyah36@gmail.com) |

</div>

---

## ⭐ Show Your Support

<div align="center">

If this project helped you, please consider giving it a ⭐ star!

**Share it with others who might find it useful:**

[![Twitter](https://img.shields.io/badge/Share_on_Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/intent/tweet?text=Check%20out%20this%20amazing%20Internship%20Management%20System!&url=https://github.com/MuskanHaryah/Internship-Management-System)
[![LinkedIn](https://img.shields.io/badge/Share_on_LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/sharing/share-offsite/?url=https://github.com/MuskanHaryah/Internship-Management-System)
[![Facebook](https://img.shields.io/badge/Share_on_Facebook-1877F2?style=for-the-badge&logo=facebook&logoColor=white)](https://www.facebook.com/sharer/sharer.php?u=https://github.com/MuskanHaryah/Internship-Management-System)

---

### 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/MuskanHaryah/Internship-Management-System?style=social)
![GitHub forks](https://img.shields.io/github/forks/MuskanHaryah/Internship-Management-System?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/MuskanHaryah/Internship-Management-System?style=social)


---

### 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/MuskanHaryah/Internship-Management-System?style=social)
![GitHub forks](https://img.shields.io/github/forks/MuskanHaryah/Internship-Management-System?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/MuskanHaryah/Internship-Management-System?style=social)

---

Made with ❤️ and ☕ by **Muskan**

**© 2026 Muskan. All rights reserved.**
---



---

<div align="center">

Made with ❤️ by Muskan

⭐ Star this repository if you find it helpful!

</div>
