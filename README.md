# 📚 BookStore

A full-stack MERN (MongoDB, Express.js, React, Node.js) BookStore web application. Browse books, read/write reviews, add to cart, place orders, and manage the catalog through an admin dashboard.

## Features
- Browse & search books by title/author, paginated listing
- Book detail pages with ratings and reviews
- User registration & login (JWT-based auth)
- Shopping cart with persistent storage (localStorage)
- Order placement with stock deduction
- Admin dashboard: create, edit, delete books; view all books
- Responsive, book-themed UI

## Tech Stack
- **Frontend:** React, React Router, Axios, Context API
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Auth:** JSON Web Tokens (JWT), bcrypt password hashing

## Project Structure
```
bookstore/
├── backend/
│   ├── config/db.js
│   ├── models/ (User, Book, Order)
│   ├── routes/ (auth, books, orders)
│   ├── middleware/ (auth, error handling)
│   ├── seed.js
│   └── server.js
└── frontend/
    ├── public/
    └── src/
        ├── api/axios.js
        ├── context/ (Auth, Cart)
        ├── components/ (Navbar, Footer, BookCard, ProtectedRoute)
        ├── pages/ (Home, Books, BookDetail, Cart, Login, Register, Admin)
        └── styles/App.css
```

## Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (local install or a MongoDB Atlas connection string)

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# edit .env with your MongoDB URI and a JWT secret
npm run dev       # starts on http://localhost:5000
```

Optional: seed sample data (3 books + an admin user `admin@bookstore.com` / `admin123`):
```bash
node seed.js
```

### 2. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# edit .env if your backend runs on a different URL
npm start          # starts on http://localhost:3000
```

## API Endpoints

| Method | Endpoint                  | Description                  | Auth        |
|--------|---------------------------|-------------------------------|-------------|
| POST   | /api/auth/register        | Register new user             | Public      |
| POST   | /api/auth/login           | Login                         | Public      |
| GET    | /api/auth/profile         | Get logged-in user profile    | User        |
| GET    | /api/books                | List/search books (paginated) | Public      |
| GET    | /api/books/:id            | Get single book                | Public      |
| POST   | /api/books                | Create book                    | Admin       |
| PUT    | /api/books/:id            | Update book                    | Admin       |
| DELETE | /api/books/:id            | Delete book                    | Admin       |
| POST   | /api/books/:id/reviews    | Add a review                   | User        |
| POST   | /api/orders                | Place an order                | User        |
| GET    | /api/orders/my             | Get my orders                 | User        |
| GET    | /api/orders/:id            | Get single order               | User/Admin  |
| GET    | /api/orders                | Get all orders                 | Admin       |
| PUT    | /api/orders/:id/status     | Update order status            | Admin       |

## Notes
- This project is a scaffold intended to be run locally with your own MongoDB instance — no external services or API keys beyond MongoDB/JWT are required.
- Update the demo/GitHub links in your project workspace once deployed so your mentor can review it.
