Perfect 👍 Here’s the **single-file documentation** (`DOCUMENTATION.md`) with everything in one place:

```markdown
# 📘 Quiz Website Backend Documentation (MERN Stack)

## 🔹 Overview
This backend powers a **Quiz Website** built with the **MERN stack**.  
It supports:
- User Authentication (Signup, Login, Profile)
- Admin Role (Quiz Management, Analytics)
- Quiz Attempt & Results
- Analytics (per quiz & global)

---

## 📂 Project Structure
```

backend/
│── controllers/
│   ├── auth.controller.js
│   ├── quiz.controller.js
│   ├── attempt.controller.js
│   ├── analytics.controller.js
│
│── middleware/
│   └── auth.js
│
│── models/
│   ├── User.js
│   ├── Quiz.js
│   └── Attempt.js
│
│── routes/
│   ├── auth.routes.js
│   ├── quiz.routes.js
│   ├── attempt.routes.js
│   ├── analytics.routes.js
│
│── server.js
│── .env
│── package.json

````

---

## 🔐 Authentication & Authorization

### Middleware: `auth.js`
```js
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// Auth check
export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, username, role }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Role-based check
export const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};
````

---

## 👤 Auth Routes

| Method | Endpoint            | Body / Headers                    | Description                         |
| ------ | ------------------- | --------------------------------- | ----------------------------------- |
| POST   | `/api/auth/signup`  | `{ "name", "email", "password" }` | Register user (default role `user`) |
| POST   | `/api/auth/login`   | `{ "email", "password" }`         | Login, returns JWT                  |
| GET    | `/api/auth/profile` | `Authorization: Bearer <token>`   | Get logged-in user profile          |

---

## 📝 Quiz Routes (Admin only)

| Method | Endpoint           | Body / Headers                                                                                                                           | Description      |
| ------ | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| POST   | `/api/quizzes`     | `Authorization: Bearer <admin_token>`<br>`{ "title", "description", "questions": [{ "questionText", "options": [], "correctOption" }] }` | Create quiz      |
| GET    | `/api/quizzes`     | none                                                                                                                                     | List all quizzes |
| GET    | `/api/quizzes/:id` | none                                                                                                                                     | Get quiz by ID   |
| PUT    | `/api/quizzes/:id` | Admin token + body                                                                                                                       | Update quiz      |
| DELETE | `/api/quizzes/:id` | Admin token                                                                                                                              | Delete quiz      |

---

## 🎯 Attempt & Results Routes

| Method | Endpoint                       | Body / Headers                                                  | Description                        |
| ------ | ------------------------------ | --------------------------------------------------------------- | ---------------------------------- |
| POST   | `/api/attempts/:quizId`        | `Authorization: Bearer <token>`<br>`{ "answers": [0,2,1,...] }` | Submit attempt                     |
| GET    | `/api/attempts/my`             | User token                                                      | Get logged-in user’s past attempts |
| GET    | `/api/attempts/:quizId/result` | User token                                                      | Get result for a specific quiz     |

---

## 📊 Analytics Routes (Admin only)

| Method | Endpoint                      | Body / Headers | Description                                                   |
| ------ | ----------------------------- | -------------- | ------------------------------------------------------------- |
| GET    | `/api/analytics/quiz/:quizId` | Admin token    | Per quiz analytics (attempts, average score, top scorer)      |
| GET    | `/api/analytics/global`       | Admin token    | Global analytics (total users, total quizzes, total attempts) |

---

## 🛠 API Testing Flow

1. **Signup User**

   ```json
   POST /api/auth/signup
   {
     "name": "John Doe",
     "email": "john@example.com",
     "password": "123456"
   }
   ```

2. **Login User**

   ```json
   POST /api/auth/login
   {
     "email": "john@example.com",
     "password": "123456"
   }
   ```

   Response → `{ "token": "eyJ..." }`

3. **Access Profile**

   ```
   GET /api/auth/profile
   Authorization: Bearer <token>
   ```

4. **Signup Admin (manually assign role in DB or via seed script)**

   ```json
   {
     "name": "Admin",
     "email": "admin@example.com",
     "password": "123456",
     "role": "admin"
   }
   ```

5. **Create Quiz (Admin)**

   ```json
   POST /api/quizzes
   Authorization: Bearer <admin_token>
   {
     "title": "JavaScript Basics",
     "description": "Test your JS knowledge",
     "questions": [
       {
         "questionText": "What is closure?",
         "options": ["A function inside a function", "A loop", "An array method", "A variable"],
         "correctOption": 0
       }
     ]
   }
   ```

6. **User Attempts Quiz**

   ```json
   POST /api/attempts/:quizId
   Authorization: Bearer <user_token>
   {
     "answers": [0]
   }
   ```

7. **View Attempt Results**

   ```
   GET /api/attempts/my
   Authorization: Bearer <user_token>
   ```

8. **Admin Analytics**

   ```
   GET /api/analytics/quiz/:quizId
   GET /api/analytics/global
   Authorization: Bearer <admin_token>
   ```

---

## ✅ Next Steps

* Add **leaderboard** per quiz
* Add **quiz categories & tags**
* Add **time-limited quizzes**
* Connect with **React frontend**

---

📌 With this documentation, any AI or developer can continue building the backend or extend features smoothly.

```

Would you like me to also prepare a **Postman Collection JSON** with all these requests so you can test everything in one click?
```
