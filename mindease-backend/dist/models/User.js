"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// Create the schema
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        // Only required if not using OAuth
        required: function () {
            return !this.googleId;
        },
        minlength: 6,
    },
    googleId: {
        type: String,
    },
}, {
    timestamps: true,
});
// Hash password before saving
userSchema.pre('save', async function (next) {
    // Only hash the password if it's modified or new
    if (!this.isModified('password') || !this.password)
        return next();
    try {
        const salt = await bcryptjs_1.default.genSalt(10);
        this.password = await bcryptjs_1.default.hash(this.password, salt);
        next();
    }
    catch (error) {
        next(error);
    }
});
// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        if (!this.password)
            return false;
        return await bcryptjs_1.default.compare(candidatePassword, this.password);
    }
    catch (error) {
        return false;
    }
};
// Create and export the model
exports.User = mongoose_1.default.model('User', userSchema);
