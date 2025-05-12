# MindEase

MindEase is a MERN stack application focused on mental health and wellness tracking, featuring mood tracking, journaling, mindfulness activities, and progress visualization.

## Features

- **User Authentication**: JWT-based authentication with Google OAuth support
- **Journal**: Track thoughts and experiences
- **Mood Tracker**: Log and visualize emotional states
- **Activities**: Guided mental wellness exercises
- **Progress Tracking**: Visualize improvement over time
- **Mental Health Assessment**: AI-powered assessment tools
- **Responsive Design**: Full mobile and desktop support

## Tech Stack

- **Frontend**: React with TypeScript, Redux Toolkit, TailwindCSS
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: Passport.js with JWT and Google OAuth strategies
- **Styling**: TailwindCSS with responsive design

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB
- Google OAuth credentials (for Google login functionality)

### Backend Setup
1. Navigate to the backend directory: `cd mindease-backend`
2. Install dependencies: `npm install`
3. Create a `.env` file with the following variables:
   ```
   PORT=3001
   MONGODB_URI=mongodb://localhost:27017/mindease
   JWT_SECRET=your_jwt_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   FRONTEND_URL=http://localhost:3000
   ```
4. Start the backend server: `npm start`

### Frontend Setup
1. Navigate to the frontend directory: `cd mindease-frontend`
2. Install dependencies: `npm install`
3. Start the frontend development server: `npm start`

The application will be available at `http://localhost:3000`

## License

MIT 