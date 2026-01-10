<div align="center">

# 🎓 Internship Management System

### A Modern Full-Stack Solution for Managing Internship Programs

[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

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
