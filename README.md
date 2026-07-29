# Backend Ledger

A secure RESTful backend application for managing users, accounts, and financial transactions. Built with Node.js, Express.js, and MongoDB, featuring JWT authentication and role-based authorization.

## Features

- User Authentication (JWT)
- Role-Based Authorization
- Account Management
- Credit & Debit Transactions
- Ledger Management
- Email Service Integration
- MongoDB Database
- REST APIs
- Secure Password Hashing
- Environment Variable Configuration

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Bcrypt
- Nodemailer

## Prerequisites

- Node.js
- MongoDB
- npm

## Installation

1. Clone the repository:

```bash
git clone https://github.com/mohitsingh-91/BACKEND_LEDGER.git
```

2. Navigate to the project directory:

```bash
cd BACKEND_LEDGER
```

3. Install dependencies:

```bash
npm install
```

## Project Structure

```
BACKEND_LEDGER/
├── node_modules/
├── src/
│   ├── config/
│   │   └── dataBase.js
│   ├── controlers/
│   │   ├── account.controller.js
│   │   ├── auth.controller.js
│   │   └── transaction.controller.js
│   ├── middlewares/
│   │   └── auth.middleware.js
│   ├── models/
│   │   ├── account.model.js
│   │   ├── blankList.model.js
│   │   ├── ledger.model.js
│   │   ├── transaction.model.js
│   │   └── user.model.js
│   ├── routes/
│   │   ├── account.route.js
│   │   ├── auth.route.js
│   │   └── transaction.route.js
│   ├── services/
│   │   └── email.service.js
│   ├── app.js
│   ├── seedScript.js
│   └── server.js
├── .env
├── .gitignore
├── package-lock.json
├── package.json
└── README.md
```

## API Endpoints

| Method | Endpoint                               | Description                           | Access          |
|--------|----------------------------------------|---------------------------------------|-----------------|
| POST   | `/api/auth/register`                   | Register a new user                   | Public          |
| POST   | `/api/auth/login`                      | Login and get JWT                     | Registered User |
| GET    | `/api/accounts/`                       | Get all own accounts                  | User/Admin      |
| GET    | `/api/accounts/get/:accountId`         | Get account by ID                     | Admin           |
| POST   | `/api/account/user`                    | Create a new account for User         | Admin           |
| POST   | `/api/account/admin`                   | Create a new account for Admin        | Admin           |
| GET    | `/api/accounts/balance/:accountId`     | Fetch balance                         | User            |
| POST   | `/api/transactions/`                   | Create a transaction from user to user| User            |
| POST   | `/api/transactions/admin/initial-funds`| Initial fund from Admin to User       | Admin           |
| POST   | `/api/auth/logout`                     | User logout                           | Login User/Admin|

## Environment Variables

Create a `.env` file in the project root and configure the required environment variables.

```env
DATABASE_URL=
PORT=
JWT_SECRET_KEY=
CLIENT_ID=
CLIENT_SECRET=
REFRESH_TOKEN=
USER_MAIL=
ADMIN_EMAIL=
ADMIN_NAME=
ADMIN_PASSWORD=
ADMIN_ROLE=
```

## Run

For development:

```bash
npm run dev
```

For production:

```bash
npm start
```

## Author

Mohit Singh
