"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const progressSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    weeklyAverage: { type: Number, default: 0 },
    streak: { type: Number, default: 1 },
    activitiesCompleted: { type: Number, default: 0 },
    moodData: {
        labels: [String],
        data: [Number]
    },
    activityData: {
        labels: [String],
        data: [Number]
    },
    achievements: [
        {
            id: String,
            title: String,
            description: String
        }
    ]
});
const Progress = mongoose_1.default.model('Progress', progressSchema);
exports.default = Progress;
