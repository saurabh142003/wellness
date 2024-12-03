
# Project: Wellness Management System

This project is a Wellness Management System backend built with Node.js, Express, and MongoDB. It provides role-based access for admins, coaches, and clients, enabling features like user management, client progress tracking, session scheduling, and an admin dashboard.

## Setup and Installation

### Prerequisites
- Node.js (version 14 or higher)
- MongoDB (local or Atlas)
- npm (comes with Node.js)

### Steps
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd wellness-management
2. Install dependencies:
    ```bash
    npm Install
3. Configure environment variables: Create a .env file in the project root:
- Contact me for .env file details 
4. Start the server:
    ```bash
    nodemon index.js //or
    node index.js
5. Usage
 ## API Endpoints
 ### Use this details for verifying admin's accessibilities
 - Admin Email - "saurabhmishra142003@gmail.com"
 - Admin password - "saurabh"

### Authentication Routes

| Endpoint               | Method | Role    | Description                                        | Data to Send                                         |
|------------------------|--------|---------|----------------------------------------------------|-----------------------------------------------------|
| `/api/auth/admin/login` | POST   | Admin   | Admin login with email and password.               | `{ "email": "admin@example.com", "password": "12345" }` |
| `/api/auth/coaches`     | POST   | Admin   | Create a new coach (admin-only).                   | `{ "name": "Coach Name", "email": "coach@example.com", "password": "12345", "specialization":"cricketer" }` |
| `/api/auth/login`       | POST   | All Users | User login (coach or client).                      | `{ "email": "user@example.com", "password": "12345" }` |

### Client Routes

| Endpoint                     | Method | Role      | Description                                             | Data to Send                                             |
|------------------------------|--------|-----------|---------------------------------------------------------|---------------------------------------------------------|
| `/api/clients`                | POST   | Admin/Coach| Create a new client.                                    | `{ "name": "Client Name", "email": "client@example.com", "phone": "1234567890", "age": 30, "goal": "Weight Loss" }` |
| `/api/clients/:id/progress`  | PATCH  | Coach     | Update a client's progress (coach-only).               | `{ "progressNotes": "Improved significantly.", "weight": 70, "bmi": 24.5 }` |
| `/api/clients/:id`           | DELETE | Admin     | Delete a client (admin-only).                          | `No body required`                                      |
| `/api/clients/:id/schedule`  | POST   | Coach     | Schedule a follow-up session for a client.             | `{ "date": "2024-12-05", "time": "10:00", "sessionType": "Follow-up" }` |

### Admin Routes

| Endpoint                     | Method | Role     | Description                                            | Data to Send                                           |
|------------------------------|--------|----------|--------------------------------------------------------|-------------------------------------------------------|
| `/api/admin/dashboard`       | GET    | Admin    | Fetch analytics for the admin dashboard.              | `No body required`                                    |

## 6. Key Features
- Role-based Access Control: Ensures only authorized users can perform specific actions.
- Secure Authentication: Uses JWT for secure route protection.
- Scheduling: Allows coaches to schedule and manage client sessions.
- Admin Dashboard: Provides insights like total clients, active clients, and coach statistics.

## 7. Role-Based Access Control
This project uses JWT tokens and middleware to implement role-based access. Each user is assigned a role (`admin`, `coach`, or `client`) and their permissions are managed via middleware.

### Middleware Functions
- `verifyToken`: Validates the JWT token and attaches user data to the request.
- `isAdmin`: Restricts access to admin-only routes.
- `isCoach`: Restricts access to coach-only routes.
- `verifyClientReq`: Validates required fields for client-related operations.

## 8. Testing the API
### 1. Admin Login
- **Endpoint**: `/api/auth/admin/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "admin@example.com",
    "password": "adminpassword"
  }

## 9. Project Structure
```bash
wellness-management/
├── controllers/         # Controller files for each feature
├── middleware/          # Middleware for authentication and role validation
├── models/              # Mongoose models for Users, Clients, Sessions
├── routes/              # API route definitions
├── app.js               # Main server file
├── .env                 # Environment variables
├── package.json         # Project configuration
└── README.md            # Project documentation








    