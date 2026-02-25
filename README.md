# Employee Vacation Tracking System

## Features

### User Roles
- Two user roles: ROLE_USER (default) and ROLE_ADMIN
- All new users are assigned the USER role by default
- Admin role can be assigned manually in the database
- Role-based access control for different endpoints

### User Positions
- Added position field to user profiles
- Position can be set during registration
- Position can be updated in the profile settings

### Authentication & Authorization
- User registration with username, password, first name, last name, and position
- User login with JWT token generation
- Protected routes requiring authentication
- Admin-specific routes requiring ADMIN role

## API Endpoints

### Public Endpoints (No Authentication Required)
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Authenticate user and get JWT token

### User Endpoints (Authentication Required)
- `GET /user/profile` - Get current user's profile
- `PUT /user/profile` - Update current user's profile (first name, last name, position, password)
- `GET /user/profile/roles` - Get current user's roles

### Admin Endpoints (ADMIN Role Required)
- `GET /admin/users` - Get all users (admin only)
- `PUT /admin/users/{id}/role/admin` - Promote user to admin (admin only)

## Frontend Pages
- Registration page with fields for username, password, first name, last name, and position
- Login page
- Dashboard page (accessible after login)
- Profile page to update first name, last name, position, and password
- Logout functionality

## Database Schema
- `users` table with fields: id, username, password, firstName, lastName, position
- `roles` table with fields: id, name
- `user_roles` junction table linking users to roles

## Setup Instructions

1. Clone the repository
2. Make sure Docker and Docker Compose are installed
3. Run `docker-compose up --build` to start the application
4. The frontend will be available at http://localhost:3000
5. The backend API will be available at http://localhost:8080

## Setting Admin Rights

To grant admin rights to a user:
1. Access the database directly
2. Find the user in the `users` table
3. Find the admin role in the `roles` table (should be ROLE_ADMIN)
4. Add a record to the `user_roles` table linking the user ID to the admin role ID