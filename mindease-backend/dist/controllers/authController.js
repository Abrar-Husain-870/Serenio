"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
// Register user
const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        // Check if user already exists
        const existingUser = await User_1.User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: 'User already exists',
            });
        }
        // Create new user
        const user = await User_1.User.create({
            name,
            email,
            password,
        });
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, JWT_SECRET, {
            expiresIn: '30d',
        });
        res.status(201).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
                token,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
// Login user
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // Check if user exists
        const user = await User_1.User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials',
            });
        }
        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials',
            });
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, JWT_SECRET, {
            expiresIn: '30d',
        });
        res.json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
                token,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
