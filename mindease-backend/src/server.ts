import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import initializePassport from './config/passport';
import authRoutes from './routes/auth';
import dashboardRoutes from './routes/dashboard';
import journalRoutes from './routes/journal';
import moodRoutes from './routes/moods';
import activityRoutes from './routes/activities';
import progressRoutes from './routes/progress';
import reviewRoutes from './routes/review';
import aiRoutes from './routes/ai';
import apiRoutes from './routes/api';

// Load environment variables
dotenv.config();

const app = express();

// Trust reverse proxy (needed on Render/Heroku to get correct HTTPS protocol)
app.set('trust proxy', 1);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mindease')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'https://mind-ease-olive.vercel.app'
];
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control']
}));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());
initializePassport();

// Routes - Order matters! More specific routes first
app.use('/auth', authRoutes);
// Alias to support clients calling /api/auth/*
// app.use('/api/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/journal', journalRoutes);
app.use('/mood', moodRoutes);
app.use('/activities', activityRoutes);
app.use('/progress', progressRoutes);
app.use('/review', reviewRoutes);
app.use('/ai', aiRoutes);
// Mount apiRoutes at a different path to avoid conflicts
app.use('/v1', apiRoutes);

// Explicit redirect in case some upstream strips segments and alias mounting is bypassed
// app.get('/api/auth/*', (req, res) => {
//   const target = req.originalUrl.replace(/^\/api\/auth/, '/auth');
//   return res.redirect(302, target);
// });

// Temporary route to fix chatbot endpoint issue
app.use('/chatbot', apiRoutes);

// Debug: Log all registered routes
console.log('Registered routes:');
app._router.stack.forEach((middleware: any) => {
  if (middleware.route) {
    console.log(`${Object.keys(middleware.route.methods)} ${middleware.route.path}`);
  } else if (middleware.name === 'router') {
    console.log(`Router mounted at: ${middleware.regexp}`);
  }
});

// Root route handler
app.get('/', (req, res) => {
  console.log('Root route accessed');
  res.json({ message: 'MindEase API is running' });
});

// Test route to verify routing is working
app.get('/test', (req, res) => {
  console.log('Test route accessed');
  res.json({ message: 'Test route working', timestamp: new Date().toISOString() });
});

// Debug route to see what's happening
app.get('/debug', (req, res) => {
  res.json({
    message: 'Debug route',
    url: req.url,
    path: req.path,
    originalUrl: req.originalUrl,
    headers: req.headers,
    method: req.method
  });
});

// Catch-all route for debugging
app.use('*', (req, res) => {
  console.log('Catch-all route hit:');
  console.log('URL:', req.url);
  console.log('Path:', req.path);
  console.log('Original URL:', req.originalUrl);
  console.log('Method:', req.method);
  console.log('Headers:', req.headers);
  
  res.status(404).json({ 
    error: 'Route not found',
    url: req.url,
    path: req.path,
    originalUrl: req.originalUrl,
    method: req.method
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 