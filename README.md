
# 📦 Inventory Tracker App - Replit Deployment 🚀
Version 3.0

## 🔍 Overview

This project is a modern full-stack inventory management system built with TypeScript and deployed on Replit. It features a **React frontend** with Shadcn/UI components and a **Node.js/Express backend** with PostgreSQL database integration.

## ✨ Features

- 🏗 **Full TypeScript Stack**: End-to-end type safety
- 💅 **Modern UI Components**: Built with Shadcn/UI and Tailwind
- 📊 **Advanced Analytics**: Real-time charts using Recharts
- 🏢 **Multi-Facility Support**: Manage inventory across locations
- 📝 **Activity Logging**: Track all inventory changes
- 🔄 **Transaction History**: Complete audit trail
- 📱 **Responsive Design**: Mobile-first approach

## 🚀 **Project Structure**

```
project/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── charts/      # Data visualization
│   │   │   ├── inventory/   # Inventory management
│   │   │   ├── layout/      # App structure
│   │   │   ├── stats/       # Statistics components
│   │   │   └── ui/          # Shadcn/UI components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utility functions
│   │   └── pages/           # Route components
├── server/
│   ├── db.ts                # Database configuration
│   ├── routes.ts            # API endpoints
│   ├── storage.ts           # Data access layer
│   └── index.ts             # Server entry point
└── shared/
    └── schema.ts            # Shared type definitions
```

## 💻 **Technology Stack**

- **Frontend**:
  - React 18 with TypeScript
  - TanStack Query for data fetching
  - Shadcn/UI components
  - Tailwind CSS for styling
  - Recharts for data visualization
  - React Hook Form for form handling
  - Zod for validation

- **Backend**:
  - Node.js with Express
  - TypeScript
  - PostgreSQL with Drizzle ORM
  - Express Session for auth
  - WebSocket for real-time updates

## 🌐 **Key Features**

- **Inventory Management**
  - CRUD operations for inventory items
  - Real-time stock tracking
  - Barcode/SKU support
  - Bulk operations

- **Facility Management**
  - Multi-location support
  - Transfer tracking
  - Location-based analytics

- **Analytics & Reporting**
  - Financial overview
  - Stock level tracking
  - Category distribution
  - Transaction history

- **User Experience**
  - Responsive design
  - Dark mode support
  - Real-time updates
  - Advanced filtering

## 🔧 **Development**

The application runs on port 5000 by default. To start development:

```sh
npm install
npm run dev
```

This will start both the frontend development server and the backend API.

## 👥 **Contributors**

- **Justin Ortiz** - Lead Developer
- **ChatGPT** - AI Assistant 🤖
