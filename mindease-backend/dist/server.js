"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_2 = __importDefault(require("./config/passport"));
const auth_1 = __importDefault(require("./routes/auth"));
const dashboard_1 = __importDefault(require("./routes/dashboard"));
const journal_1 = __importDefault(require("./routes/journal"));
const moods_1 = __importDefault(require("./routes/moods"));
const activities_1 = __importDefault(require("./routes/activities"));
const progress_1 = __importDefault(require("./routes/progress"));
const review_1 = __importDefault(require("./routes/review"));
const ai_1 = __importDefault(require("./routes/ai"));
const api_1 = __importDefault(require("./routes/api"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
// Connect to MongoDB
mongoose_1.default.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mindease')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// CORS configuration
const allowedOrigins = [
    'http://localhost:3000',
    'https://mind-ease-olive.vercel.app'
];
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control']
}));
// Session configuration
app.use((0, express_session_1.default)({
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
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
(0, passport_2.default)();
// Routes - Order matters! More specific routes first
app.use('/auth', auth_1.default);
app.use('/dashboard', dashboard_1.default);
app.use('/journal', journal_1.default);
app.use('/mood', moods_1.default);
app.use('/activities', activities_1.default);
app.use('/progress', progress_1.default);
app.use('/review', review_1.default);
app.use('/ai', ai_1.default);
// Mount apiRoutes at a different path to avoid conflicts
app.use('/v1', api_1.default);
// Temporary route to fix chatbot endpoint issue
app.use('/chatbot', api_1.default);
// Debug: Log all registered routes
console.log('Registered routes:');
app._router.stack.forEach((middleware) => {
    if (middleware.route) {
        console.log(`${Object.keys(middleware.route.methods)} ${middleware.route.path}`);
    }
    else if (middleware.name === 'router') {
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
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
