# 📦 Inventory Tracker App - Replit Deployment 🚀
Version 2.0

## 🔍 Overview

This project is a full-stack inventory tracker application rebuilt and deployed on Replit. It consists of a **frontend (React)** and a **backend (Node.js with Express and Supabase as the database)**. The app allows users to manage inventory, perform CRUD operations, and track supplies in real time.

## ✨ Features

- 🏗 **Full-stack architecture**: React frontend and Node.js/Express backend
- 🗄 **Supabase database**: Replaced SQLite for scalability
- 🔄 **Real-time inventory updates**
- 🌐 **Replit deployment with environment variables and port configurations**

---

## 🚀 **Future Improvements**

- 🔐 Add authentication with JWT tokens.
- 📡 Implement real-time inventory tracking.
- 📊 Expand analytics & reporting features.
- 👥 User authentication and role-based access control

---

## 1️⃣ **Project Setup**

### 📥 **Clone Repository & Install Dependencies**

```sh
# Clone the repository
git clone https://github.com/yourusername/inventory-tracker.git
cd inventory-tracker

# Install dependencies for backend
cd backend
npm install

# Install dependencies for frontend
cd ../frontend
npm install
```

### 🔑 **Replit Environment Variables (.env file)**

```env
DATABASE_URL="postgresql://your_supabase_url"
JWT_SECRET="your_secret_key"
PORT=5001
```

---

## 2️⃣ **Backend Configuration**

### 📂 **Backend File Structure**

```
backend/
│── routes/
│   ├── authRoutes.js
│   ├── inventoryRoutes.js
│── models/
│   ├── inventoryModel.js
│── database.js
│── server.js
│── package.json
│── .env
```

### 🔑 **Key Backend Files**

- `server.js`: Main server file with Express configuration
- `database.js`: Configures PostgreSQL (Supabase)
- `inventoryModel.js`: Handles database operations
- `inventoryRoutes.js`: Defines API routes for inventory management

### ▶️ **Run the Backend on Replit**

```sh
cd backend
npm run dev
```

### 🛠 **Verify Backend API**

```sh
curl -X GET https://your-replit-url:3001/api/inventory
```

---

## 3️⃣ **Frontend Configuration**

### 📂 **Frontend File Structure**

```
frontend/
│── src/
│   ├── components/
│   │   ├── InventoryList.js
│   ├── App.js
│── package.json
│── .env
```

### 🔑 **Key Frontend Files**

- `InventoryList.js`: Fetches and displays inventory
- `App.js`: Main React component

### 🌐 **Update API URL in Frontend**

Modify `InventoryList.js` to match the correct backend URL:

```js
const API_BASE_URL = "https://your-replit-url:3001";
```

### ▶️ **Run the Frontend on Replit**

```sh
cd frontend
npm start
```

---

## 4️⃣ **Replit Networking Configuration**

### 🌍 **Expose Backend to the Web**

- Navigate to **Replit → Networking Tab**
- Ensure port `5001` is mapped to `3001`
- Enable **"Expose this port to the web"**

---

## 5️⃣ **Testing the Application**

- ✅ Open `https://your-replit-url` to test the frontend.
- 🔍 Check the **browser console** and **network tab** for API calls.
- 🛠 Test all CRUD operations (Create, Read, Update, Delete).

---

## 6️⃣ **Deployment Notes & Final Checks**

- 🛠 Ensure `.env` files are properly configured.
- 🔗 Make sure frontend API calls match the backend URL.
- ⚙️ Verify **Replit’s port settings** align with `server.js`.

---

### 👥 **Contributors**

- **Justin Ortiz** - Lead Developer
- **ChatGPT** - AI Assistant 🤖
