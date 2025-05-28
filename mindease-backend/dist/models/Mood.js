"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const moodSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mood: {
        type: String,
        required: true
    },
    note: {
        type: String,
        default: ''
    },
    date: {
        type: Date,
        default: Date.now
    }
});
const Mood = mongoose_1.default.model('Mood', moodSchema);
exports.default = Mood;
