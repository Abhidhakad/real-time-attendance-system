# Real-Time Attendance Management System

A production-ready attendance management system built with the MERN stack, featuring real-time tracking, geolocation verification, selfie capture, overtime management, and role-based access control.

---

## 🚀 Features

### Core

* JWT-based authentication with role-based access (Admin, Manager, Employee)
* Punch In/Out with selfie + geolocation
* Automatic working hours calculation
* Overtime request and approval system
* Attendance history and reporting

### Additional

* Geofencing support
* Responsive UI (mobile-friendly)
* Real-time data handling using RTK Query

---

## 🛠️ Tech Stack

### Backend

* Node.js, Express.js
* MongoDB (Mongoose)
* JWT Authentication
* Cloudinary (image storage)
* Zod (validation)

### Frontend

* React (Vite)
* Redux Toolkit + RTK Query
* Tailwind CSS
* React Router

---

## 📁 Project Structure

```
backend/
  ├── src/
  ├── server.js

frontend/
  ├── src/
  ├── vite.config.js
```

---

## 🔧 Environment Variables

### Backend (.env)

```
PORT=5000
MONGODB_URI=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CORS_ORIGIN=
```

### Frontend (.env)

```
VITE_API_URL=
VITE_APP_NAME=Attendance System
```

---

## ⚙️ Setup

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 📡 API Overview

### Auth

* POST `/api/v1/auth/register`
* POST `/api/v1/auth/login`

### Attendance

* POST `/api/v1/attendance/punch-in`
* POST `/api/v1/attendance/punch-out`
* GET `/api/v1/attendance/my`

### Overtime

* POST `/api/v1/overtime/request`
* PUT `/api/v1/overtime/:id/approve`

---

## 🚀 Deployment

### Frontend (Netlify)

* Build: `npm run build`
* Publish directory: `dist`

Create a redirect file:

```
public/_redirects
```

```
/*  /index.html  200
```

### Backend (Render)

* Build: `npm install`
* Start: `npm start`


---

## 📝 License

MIT
