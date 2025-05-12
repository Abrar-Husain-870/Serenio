"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const passport_2 = __importDefault(require("./config/passport"));
const auth_1 = __importDefault(require("./routes/auth"));
const dashboard_1 = __importDefault(require("./routes/dashboard"));
const activities_1 = __importDefault(require("./routes/activities"));
const moods_1 = __importDefault(require("./routes/moods"));
const journal_1 = __importDefault(require("./routes/journal"));
const review_1 = __importDefault(require("./routes/review"));
const progress_1 = __importDefault(require("./routes/progress"));
const api_1 = __importDefault(require("./routes/api"));
// Load environment variables more explicitly
const envPath = path_1.default.resolve(process.cwd(), '.env');
console.log(`Loading .env file from: ${envPath}`);
if (fs_1.default.existsSync(envPath)) {
    console.log('.env file exists');
    const result = dotenv_1.default.config({ path: envPath });
    if (result.error) {
        console.error('Error loading .env file:', result.error);
    }
    else {
        console.log('Environment variables loaded successfully');
    }
}
else {
    console.error('.env file not found at path:', envPath);
}
// Log important environment variables (don't log secrets in production)
console.log('Environment variables loaded:');
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('GOOGLE_CLIENT_ID exists:', !!process.env.GOOGLE_CLIENT_ID);
console.log('GOOGLE_CLIENT_SECRET exists:', !!process.env.GOOGLE_CLIENT_SECRET);
// Create Express app
const app = (0, express_1.default)();
// Connect to MongoDB
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mindease';
        await mongoose_1.default.connect(mongoURI);
        console.log('MongoDB connected successfully');
    }
    catch (error) {
        console.error('MongoDB connection error:', error);
        // Exit process with failure if we can't connect to MongoDB
        process.exit(1);
    }
};
// Call connectDB function
connectDB();
// Enable CORS - must be before other middleware
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Pragma', 'Expires'],
    credentials: true
}));
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Debug route
app.get('/', (req, res) => {
    res.status(200).json({ message: 'MindEase API is running!' });
});
// Session middleware (required for passport)
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || 'your-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set to true if using HTTPS
}));
// Initialize Passport before using it
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// Initialize Passport strategies
(0, passport_2.default)();
// Routes
app.use('/api/auth', auth_1.default);
app.use('/api/dashboard', dashboard_1.default);
app.use('/api/activities', activities_1.default);
app.use('/api/moods', moods_1.default);
app.use('/api/journal', journal_1.default);
app.use('/api/review', review_1.default);
app.use('/api/progress', progress_1.default);
app.use('/api/ai', api_1.default);
// Start the server directly without MongoDB connection
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;
app.listen(PORT, '127.0.0.1', () => {
    console.log(`Server running on port ${PORT}`);
});
