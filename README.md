# Expense Tracker API

A professional RESTful backend API for securely managing personal expenses. Built with **Node.js**, **Express**, and **MongoDB**, this project provides JWT-based authentication, full expense CRUD operations, advanced filtering, and summary analytics.

## Features

- User registration and login with JWT authentication
- Protected expense routes per authenticated user
- Expense CRUD (create, read, update, delete)
- Filtering expenses by:
  - date range (`startDate`, `endDate`)
  - category (`category`)
  - amount range (`minAmount`, `maxAmount`)
- Summary analytics endpoint:
  - total expenses by month
  - total expenses by category
  - overall total
- Validation middleware for auth and expense requests
- Centralized error handling middleware
- Environment-based configuration via `.env`
- Clean project architecture (controllers, models, routes, middleware, utils)

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Authentication:** JSON Web Token (JWT)
- **Logging:** Morgan
- **Security:** Bcrypt for password hashing

## Project Structure

```text
Expense-Tracker-API/
├── .env.example
├── package.json
├── README.md
└── src/
    ├── app.js
    ├── server.js
    ├── config/
    │   └── db.js
    ├── controllers/
    │   ├── authController.js
    │   └── expenseController.js
    ├── middleware/
    │   ├── asyncHandler.js
    │   ├── authMiddleware.js
    │   ├── errorMiddleware.js
    │   └── validateRequest.js
    ├── models/
    │   ├── Expense.js
    │   └── User.js
    ├── routes/
    │   ├── authRoutes.js
    │   └── expenseRoutes.js
    └── utils/
        ├── buildExpenseFilter.js
        └── generateToken.js
```

## Setup & Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd Expense-Tracker-API
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your values (especially `MONGO_URI` and `JWT_SECRET`).

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=1d
NODE_ENV=development
```

## How to Run the Server

- Development:
  ```bash
  npm run dev
  ```
- Production:
  ```bash
  npm start
  ```

Server base URL: `http://localhost:5000`

## API Endpoints

### Auth

#### Register User
- **POST** `/api/auth/register`
- **Body:**
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "password123"
  }
  ```

#### Login User
- **POST** `/api/auth/login`
- **Body:**
  ```json
  {
    "email": "jane@example.com",
    "password": "password123"
  }
  ```

### Expenses (Protected: `Authorization: Bearer <token>`)

#### Create Expense
- **POST** `/api/expenses`
- **Body:**
  ```json
  {
    "title": "Grocery Shopping",
    "amount": 64.5,
    "category": "Food",
    "date": "2026-01-15",
    "notes": "Weekly groceries"
  }
  ```

#### Get Expenses (with optional filters)
- **GET** `/api/expenses`
- Query params (optional):
  - `startDate=2026-01-01`
  - `endDate=2026-01-31`
  - `category=Food`
  - `minAmount=10`
  - `maxAmount=200`

Example:
```http
GET /api/expenses?startDate=2026-01-01&endDate=2026-01-31&category=Food&minAmount=10&maxAmount=200
```

#### Get Expense by ID
- **GET** `/api/expenses/:id`

#### Update Expense
- **PUT** `/api/expenses/:id`
- **Body (partial or full):**
  ```json
  {
    "title": "Grocery Shopping - Updated",
    "amount": 70
  }
  ```

#### Delete Expense
- **DELETE** `/api/expenses/:id`

### Summary

#### Get Expense Summary
- **GET** `/api/expenses/summary`
- Supports same optional filters as list endpoint.
- **Response:**
  ```json
  {
    "monthlyTotals": [
      { "year": 2026, "month": 1, "total": 450.75 },
      { "year": 2026, "month": 2, "total": 389.4 }
    ],
    "categoryTotals": [
      { "category": "Food", "total": 300.5 },
      { "category": "Transport", "total": 120.0 }
    ],
    "overallTotal": 840.15
  }
  ```

## License

This project is licensed under the **MIT License**.
