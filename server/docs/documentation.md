# 🌐 Backend Server Documentation

This document provides setup and deployment instructions for the **To-Do List App Backend Server**.

---

## 📂 Project Structure

```
backend-server/
├── dist/             # Compiled TypeScript code
├── prisma/           # Prisma schema and migrations
├── src/              # Main server logic
│   ├── middleware/   # Custom middleware (e.g., auth)
│   ├── routes/       # API route handlers
│   ├── services/  # Business logic
│   ├── utils/        # Utility functions
|   |   |── validators/ # Request validators
│   ├── app.ts        # Express app setup
│   ├── server.ts     # Server entry point
├── package.json      # Dependencies and scripts
```

---

## 🚀 Features

- **Authentication**: User registration and login with secure JWT-based authentication.
- **To-Do Management**: Endpoints to create, read, update, and delete tasks.
- **Database Integration**: MongoDB for scalable data storage.

---

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Create a `.env` File

Add a `.env` file in the root directory:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/todo
JWT_SECRET=your-jwt-secret
```

### 3. Build and Start the Server

```bash
npm run build
npm start
```

---

## API Documentation

For detailed API documentation, please refer to the [API Documentation](https://documenter.getpostman.com/view/12567532/2sAYHwH3yT).

## 🧪 API Endpoints

### Authentication

- **POST** `/auth/register` - Register a new user.
- **POST** `/auth/login` - Authenticate and receive a JWT.

### To-Do Management

- **GET** `/tasks` - Fetch all tasks.
- **POST** `/tasks` - Add a new task.
- **DELETE** `/tasks` - Delete all tasks.
- **PUT** `/tasks/:id` - Update a task.
- **DELETE** `/tasks/:id` - Delete a task.

## 🗂️ Data Models

### User

```json
{
   "id": "string",
   "name": "string",
   "email": "string",
   "password": "string",
   "createdAt": "date"
}
```

### Task

```json
{
   "id": "string",
   "title": "string",
   "completed": "boolean",
   "userId": "string",
   "createdAt": "date",
}
```

<!-- --- -->

<!-- ## 🛠️ Deployment Instructions

### Using Docker
1. Build the Docker image:
   ```bash
   docker build -t todo-backend .
   ```
2. Run the container:
   ```bash
   docker run -p 3000:3000 todo-backend
   ```

### Using Heroku
1. Log in to Heroku:
   ```bash
   heroku login
   ```
2. Deploy:
   ```bash
   git push heroku main
   ```

--- -->

<!-- ## 📄 License

This project is licensed under the [MIT License](../LICENSE). -->
