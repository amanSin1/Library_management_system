# 📚 Library Management System

A full-stack Library Management System built with **FastAPI** (backend) and **React** (frontend). Supports two roles — Admin and User — with complete book/movie issuing, returning, fine calculation, membership management, and reporting.

---

## 🗂️ Project Structure

```
LibraryMngSystem/
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── seed.py
│   ├── requirements.txt
│   ├── core/
│   │   ├── security.py
│   │   └── dependencies.py
│   ├── models/
│   │   └── models.py
│   ├── schemas/
│   │   ├── auth.py
│   │   ├── book.py
│   │   ├── issue.py
│   │   ├── membership.py
│   │   └── user.py
│   ├── routers/
│   │   ├── auth.py
│   │   ├── books.py
│   │   ├── transactions.py
│   │   ├── reports.py
│   │   └── maintenance.py
│   └── services/
│       ├── auth_service.py
│       ├── book_service.py
│       ├── transaction_service.py
│       ├── report_service.py
│       └── maintenance_service.py
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── index.css
        ├── api/
        │   └── axios.js
        ├── context/
        │   └── AuthContext.jsx
        ├── components/
        │   └── Navbar.jsx
        └── pages/
            ├── Login.jsx
            ├── AdminHome.jsx
            ├── UserHome.jsx
            ├── transactions/
            ├── reports/
            └── maintenance/
```

---

## ⚙️ Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Backend   | FastAPI, SQLAlchemy, SQLite, Pydantic v2 |
| Auth      | JWT (python-jose), bcrypt (passlib) |
| Frontend  | React 18, React Router v6, Axios    |
| Dev Tools | Vite, Uvicorn                       |

---

## 🚀 Getting Started

### Prerequisites

- Python 3.11
- Node.js 18+

---

### Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

# Install dependencies
pip install fastapi uvicorn sqlalchemy "python-jose[cryptography]" "passlib[bcrypt]" bcrypt==4.0.1 python-multipart pydantic

# Seed the database with initial data
python seed.py

# Start the server
uvicorn main:app --reload
```

Backend runs at: `http://localhost:8000`  
Swagger docs at: `http://localhost:8000/docs`

---

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 🔐 Default Credentials

| Role  | Username | Password |
|-------|----------|----------|
| Admin | `adm`    | `adm`    |
| User  | `user`   | `user`   |

---

## ✨ Features

### 🔑 Authentication
- JWT-based login with role detection (Admin / User)
- Passwords hidden on input
- Protected routes — User cannot access Maintenance

### 📦 Transactions (Both roles)
- **Check Book Availability** — search by name or author, see availability status
- **Issue Book** — select book, auto-fills author, issue date validation, return date auto-set to +15 days (editable, max 15 days)
- **Return Book** — enter serial number, picks up issue date automatically
- **Pay Fine** — always shown after return (even if fine is ₹0). Fine = ₹1/day overdue. Book not returned until fine is paid

### 📊 Reports (Both roles)
- Master List of Books
- Master List of Movies
- Master List of Memberships
- Active Issues
- Overdue Returns (with fine calculation)
- Pending Issue Requests

### 🛠️ Maintenance (Admin only)
- **Add / Update Membership** — 6 months / 1 year / 2 years duration, extend or cancel
- **Add / Update Book or Movie** — auto-generates serial numbers by category (e.g. `SC(B)000001`)
- **User Management** — create users, toggle active/admin status

---

## 📋 Book Serial Number Format

Serial numbers are auto-generated based on category and type:

| Category             | Prefix |
|----------------------|--------|
| Science              | `SC`   |
| Economics            | `EC`   |
| Fiction              | `FC`   |
| Children             | `CH`   |
| Personal Development | `PD`   |

Format: `PREFIX(B/M)000001`  
Examples: `SC(B)000001` = Science Book, `FC(M)000001` = Fiction Movie

---

## 🧱 Architecture

The backend follows a clean layered architecture:

```
Request → Router → Service → Model/DB
                ↕
            Schema (Pydantic validation)
```

- **Routers** — only handle HTTP (request/response), no business logic
- **Services** — all business logic lives here
- **Schemas** — Pydantic v2 models for request validation and response shaping
- **Models** — SQLAlchemy ORM models
- **Core** — JWT security, reusable dependencies

---

## 📡 API Overview

| Method | Endpoint                          | Access | Description              |
|--------|-----------------------------------|--------|--------------------------|
| POST   | `/auth/login`                     | Public | Login, returns JWT       |
| GET    | `/books/search`                   | Auth   | Search books/movies      |
| POST   | `/transactions/issue`             | Auth   | Issue a book             |
| POST   | `/transactions/return`            | Auth   | Initiate return          |
| POST   | `/transactions/pay-fine`          | Auth   | Complete return + pay fine |
| GET    | `/reports/books`                  | Auth   | Master book list         |
| GET    | `/reports/overdue`                | Auth   | Overdue returns + fines  |
| POST   | `/maintenance/membership/add`     | Admin  | Add membership           |
| POST   | `/maintenance/item/add`           | Admin  | Add book or movie        |
| POST   | `/maintenance/user/add`           | Admin  | Add user                 |

Full API docs available at `http://localhost:8000/docs` after starting the server.

---

## 💡 Assumptions

- Fine rate: **₹1 per day** overdue (not specified in requirements)
- Return date can be edited to an earlier date but not beyond 15 days from issue date
- A book cannot be returned until any pending fine is marked as paid
- Membership numbers are auto-generated (`MEM000001`, `MEM000002`, ...)
- Book serial numbers are auto-generated per category and type

---

## 📸 Screenshots

> Add screenshots here after running the app locally:
<img width="548" height="505" alt="image" src="https://github.com/user-attachments/assets/34b78901-5da0-4536-8d78-95f59964075b" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/3faa74b1-e17a-4f42-82fe-fea0ec8b1bc8" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/ce96c849-34a8-448e-af0b-c9a55c1381db" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/46db2420-cc60-43cd-825f-f7b636696002" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/a22625f7-c91b-4a51-9497-75492ce679ad" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/3c35d1c7-fa0c-488b-bd2a-1d1074918f3c" />


---

## 🗃️ Database

Uses **SQLite** (`library.db`) — no setup required, file is auto-created on first run.

To reset the database:
```bash
# Delete the db file and re-seed
rm library.db
python seed.py
```
