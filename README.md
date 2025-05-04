# Frontend - Healthcare Project

## Overview

This is the frontend for a healthcare appointment management system. It's built using React and Material-UI (MUI), providing a user-friendly interface for managing patients and appointments.

## Technologies

- React
- Material-UI (MUI)
- React Router
- Axios for API calls
- Yarn for package management

## Key Features

- User authentication (login system with JWT)
- Patient management (view, create, edit, delete)
- Appointment management (view, create, edit, delete)
- Responsive design
- Error handling and notifications
- Protected routes
- Persistent routing state

## Setup and Installation

1. Ensure you have Node.js and Yarn installed.
2. Clone the repository.
3. Navigate to the project directory.
4. Run `yarn install` to install initial dependencies.
5. Install Material-UI and related packages:

   ```console
   yarn add @mui/material @emotion/react @emotion/styled
   ```

6. Run `yarn start` to start the development server.

## Running the Application

1. Start the development server with `yarn start`.
2. The application will open in your default browser at `http://localhost:3000`.

## Usage

1. Login using your credentials.
2. Navigate between the Patient and Appointment pages using the navbar.
3. View, create, edit, and delete patients and appointments as needed.

## Key Components

- `App.jsx`: The main component that handles routing and authentication.
- `AppContent.jsx`: Manages the overall content structure and routing.
- `Patient.jsx`: Manages the display and operations for patient data.
- `Appointment.jsx`: Manages the display and operations for appointment data.
- `Login.jsx`: Handles user authentication.
- `Navbar.jsx`: Provides navigation between different pages.
- `ProtectedRoute.jsx`: Ensures routes are only accessible to authenticated users.
- `useCurrentRoute.js`: Custom hook for managing and persisting the current route.

## Authentication

- The app uses JWT tokens for authentication.
- Tokens are stored in localStorage and validated on app startup and route changes.
- `checkTokenValidity` function in `auth.js` verifies the token with the backend.
- Protected routes ensure only authenticated users can access certain pages.

## Routing

- React Router is used for navigation throughout the application.
- `AppContent.jsx` handles the main routing logic and layout.
- The `ProtectedRoute` component ensures that routes requiring authentication are only accessible to authenticated users.
- The `useCurrentRoute` hook helps manage and persist the user's current route across sessions.
- Unauthenticated users are redirected to the login page, while authenticated users are redirected to their last visited route upon successful login.

## Error Handling

- Error boundaries catch and display errors gracefully.
- Network errors and other issues are communicated to the user via Material-UI Snackbar notifications.
- Token validation errors result in logout and redirection to the login page.

## Styling

- Material-UI (MUI) is used for consistent and responsive design.
- A custom theme is applied using `ThemeProvider`.
- Custom styling is done using `@emotion/styled` and the MUI `sx` prop.

## API Integration

- The backend API is expected to be running on `http://localhost:8080`.
- Ensure the backend server is running before starting the frontend application.
