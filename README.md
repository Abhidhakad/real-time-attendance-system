# Real-Time Attendance Management System

A production-ready attendance management system built with the MERN stack (MongoDB, Express, React, Node.js) featuring real-time attendance tracking, geolocation verification, selfie capture, overtime management, and comprehensive reporting.

## 🚀 Features

### Core Features
- **JWT-based Authentication** - Secure login/signup with role-based access control
- **Punch In/Out System** - Live webcam selfie capture with geolocation verification
- **Working Hours Tracking** - Automatic calculation of work hours with status (completed/incomplete)
- **Overtime Management** - Request, approve, and reject overtime requests
- **Role-Based Access Control** - Three roles: Employee, Manager, Admin

### Employee Features
- View personal attendance history
- Request overtime
- View own statistics and working hours
- Update profile information

### Manager Features
- View team attendance
- Approve/reject overtime requests
- Team statistics dashboard

### Admin Features
- Manage all users (create, update, delete)
- View all attendance records
- Generate comprehensive reports
- System overview dashboard

### Reports & Export
- Filter attendance by date range and user
- Export reports to PDF and Excel formats
- Include photos, locations, and timestamps

### Bonus Features
- **Dark Mode** - System preference detection with manual toggle
- **Geofencing** - Restrict attendance to designated work areas
- **Responsive Design** - Mobile-friendly interface
- **Real-time Updates** - RTK Query for efficient data fetching

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.x
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **File Storage**: Cloudinary
- **Logging**: Winston
- **Validation**: Zod
- **Security**: Helmet, CORS, Rate Limiting

### Frontend
- **Framework**: React 18 with Vite
- **State Management**: Redux Toolkit + RTK Query
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Export**: jsPDF, xlsx

## 📁 Project Structure

### Backend Structure
```
backend/
├── src/
│   ├── controllers/      # HTTP request handlers
│   ├── services/         # Business logic
│   ├── repositories/     # Database operations
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API route definitions
│   ├── middlewares/      # Auth, validation, error handling
│   ├── utils/            # Helper functions
│   ├── config/           # Configuration files
│   ├── jobs/             # Cron jobs
│   ├── validations/      # Zod schemas
│   └── app.js            # Express app setup
├── .env.example
├── package.json
└── server.js
```

### Frontend Structure
```
frontend/
├── src/
│   ├── app/              # Redux store setup
│   ├── features/         # RTK slices and APIs
│   ├── pages/            # Page components
│   ├── components/      # Reusable components
│   ├── hooks/            # Custom hooks
│   ├── utils/            # Utility functions
│   ├── layouts/          # Layout components
│   └── routes/          # Route definitions
├── .env.example
├── package.json
└── vite.config.js
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account (for image storage)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update `.env` with your credentials:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/attendance_system
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CORS_ORIGIN=http://localhost:5173
```

5. Start the development server:
```bash
npm run dev
```

6. (Optional) Seed the database with sample data:
```bash
npm run seed
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update `.env`:
```env
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=Attendance System
```

5. Start the development server:
```bash
npm run dev
```

## 👤 Demo Accounts

After seeding the database, you can use these accounts:

| Role    | Email                  | Password    |
|---------|------------------------|-------------|
| Admin   | admin@company.com      | admin123    |
| Manager | manager@company.com    | manager123  |
| Employee| alice@company.com      | employee123 |
| Employee| bob@company.com        | employee123 |

## 📋 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/profile` - Get current user
- `PUT /api/v1/auth/profile` - Update profile

### Attendance
- `POST /api/v1/attendance/punch-in` - Punch in with selfie & location
- `POST /api/v1/attendance/punch-out` - Punch out
- `GET /api/v1/attendance/today` - Get today's attendance
- `GET /api/v1/attendance/my` - Get my attendance history
- `GET /api/v1/attendance/team` - Get team attendance (manager)
- `GET /api/v1/attendance/all` - Get all attendance (admin)

### Overtime
- `POST /api/v1/overtime/request` - Request OT
- `GET /api/v1/overtime/my` - Get my OT requests
- `GET /api/v1/overtime/pending` - Get pending OT requests (manager)
- `PUT /api/v1/overtime/:id/approve` - Approve OT
- `PUT /api/v1/overtime/:id/reject` - Reject OT

### Users (Admin)
- `GET /api/v1/users` - List all users
- `GET /api/v1/users/:id` - Get user by ID
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

### Dashboard
- `GET /api/v1/dashboard/stats` - Get dashboard statistics

## 🔐 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Rate limiting (100 requests per 15 minutes)
- Helmet security headers
- CORS configuration
- Input validation with Zod
- SQL/NoSQL injection prevention
- XSS protection

## 📊 Database Schema

### Users
- name, email, password (hashed)
- role (employee/manager/admin)
- department, managerId
- avatar, isActive

### Attendance
- userId, date
- punchIn: { time, selfie, location, address }
- punchOut: { time, selfie, location, address }
- workingHours, status

### Overtime
- userId, date, reason
- requestedHours
- status (pending/approved/rejected)
- approvedBy, approvedAt, remarks

### Geofence
- name, center (Point coordinates)
- radius (in meters)
- isActive

## 🎯 Assumptions

1. Single organization (no multi-tenancy)
2. Users have consistent timezone
3. Geolocation API available in browser
4. Webcam access available for attendance
5. MongoDB Atlas for cloud database
6. Cloudinary for image storage

## 🚀 Deployment

### Backend (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables from `.env`

### Frontend (Vercel)

1. Create a new project on Vercel
2. Import your GitHub repository
3. Set root directory: `frontend`
4. Set build command: `npm run build`
5. Set output directory: `dist`
6. Add environment variables:
   - `VITE_API_URL`: Your backend URL
   - `VITE_APP_NAME`: Attendance System

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
