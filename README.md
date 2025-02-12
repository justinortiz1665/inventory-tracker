# Inventory Tracker App

## 📌 Overview
The **Inventory Tracker App** is a full-stack application designed to track and manage inventory in real-time. It allows multiple users (1-15) within an organization to update inventory as items are restocked or used. The backend is powered by **Node.js with Express.js**, while the frontend is built using **React.js**.

---

## 🎯 Features
✅ **Inventory Management** (Add, Update, Delete Items)

✅ **Real-Time Updates** using SQLite

✅ **RESTful API** for seamless frontend-backend communication

---

## 🛠 Tech Stack
### **Backend**
- **Framework:** Express.js
- **Database:** SQLite
- **ORM:** `sqlite3` package for database queries
- **Authentication:** bcrypt.js for password hashing
- **Middleware:** CORS, dotenv, nodemon

### **Frontend**
- **Framework:** React.js
- **State Management:** useState, useEffect
- **HTTP Client:** Axios for API requests
- **UI Styling:** Basic CSS with component-based architecture

---

## ⚙️ Backend Setup (Local Server)

### 1️⃣ **Clone Repository**
```sh
git clone https://github.com/yourusername/inventory-tracker.git
cd inventory-tracker-backend
```

### 2️⃣ **Install Dependencies**
```sh
npm install
```

### 3️⃣ **Set Up Environment Variables**
Create a `.env` file in the backend directory and configure the database connection:
```sh
DATABASE_FILE="./inventory.db"
PORT=5001
```

### 4️⃣ **Run Database Migrations (If Needed)**
If using SQLite, initialize the tables:
```sh
sqlite3 inventory.db < database/schema.sql
```

### 5️⃣ **Start the Backend Server**
```sh
npm run dev
```
✅ **Server Running on:** `http://localhost:5001`

---

## 🖥️ Frontend Setup

### 1️⃣ **Navigate to Frontend Directory**
```sh
cd inventory-tracker-frontend
```

### 2️⃣ **Install Dependencies**
```sh
npm install
```

### 3️⃣ **Configure API Endpoint**
Modify `src/api.js` (or equivalent file) to point to the backend server:
```javascript
export const API_BASE_URL = "http://localhost:5001/api";
```

### 4️⃣ **Run the Frontend**
```sh
npm start
```
✅ **App Running on:** `http://localhost:3000`

---

## 📡 API Routes
### **Authentication** (`/api/auth`)
| Method | Endpoint         | Description          |
|--------|----------------|----------------------|
| POST   | `/register`    | Register new user   |
| POST   | `/login`       | User login          |

### **Inventory Management** (`/api/inventory`)
| Method | Endpoint        | Description                |
|--------|----------------|----------------------------|
| GET    | `/`            | Get all inventory items   |
| GET    | `/:id`         | Get single item by ID     |
| POST   | `/`            | Add new item              |
| PUT    | `/:id`         | Update item details       |
| DELETE | `/:id`         | Delete item               |

---

## 🚀 Deployment Notes
This guide covers running the application **locally**. If deploying to a production environment, ensure:
- **Environment variables** are securely stored.
- **Database migrations** are properly executed.
- **Frontend API URLs** are updated to match production backend.

---

## 🎯 Next Steps
- 🔧 **Enhance Frontend UI** with better styling.
- 🚀 **Deploy to a Cloud Server** for public access.
- 📊 **Add Reporting Features** for inventory trends.
- 🙍 **User Authentication** (Admin & Regular Users)
- 🏢 **Facility Tracking** (Monitor where inventory is distributed)

---

## 📜 License
This project is licensed under the **MIT License**.
