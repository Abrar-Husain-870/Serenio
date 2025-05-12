import express from 'express';
import session from 'express-session';
import passport from 'passport';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import mongoose from 'mongoose';
import initializePassport from './config/passport';
import authRoutes from './routes/auth';
import dashboardRoutes from './routes/dashboard';
import activitiesRoutes from './routes/activities';
import moodsRoutes from './routes/moods';
import journalRoutes from './routes/journal';
import reviewRoutes from './routes/review';
import progressRoutes from './routes/progress';
import aiRoutes from './routes/api';

// Load environment variables more explicitly
const envPath = path.resolve(process.cwd(), '.env');
console.log(`Loading .env file from: ${envPath}`);
if (fs.existsSync(envPath)) {
  console.log('.env file exists');
  const result = dotenv.config({ path: envPath });
  if (result.error) {
    console.error('Error loading .env file:', result.error);
  } else {
    console.log('Environment variables loaded successfully');
  }
} else {
  console.error('.env file not found at path:', envPath);
}

// Log important environment variables (don't log secrets in production)
console.log('Environment variables loaded:');
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('GOOGLE_CLIENT_ID exists:', !!process.env.GOOGLE_CLIENT_ID);
console.log('GOOGLE_CLIENT_SECRET exists:', !!process.env.GOOGLE_CLIENT_SECRET);

// Create Express app
const app = express();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mindease';
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Exit process with failure if we can't connect to MongoDB
    process.exit(1);
  }
};

// Call connectDB function
connectDB();

// Enable CORS - must be before other middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Pragma', 'Expires'],
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'MindEase API is running!' });
});

// Session middleware (required for passport)
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

// Initialize Passport before using it
app.use(passport.initialize());
app.use(passport.session());

// Initialize Passport strategies
initializePassport();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/activities', activitiesRoutes);
app.use('/api/moods', moodsRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/ai', aiRoutes);

// Start the server directly without MongoDB connection
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;
app.listen(PORT, '127.0.0.1', () => {
  console.log(`Server running on port ${PORT}`);
}); 