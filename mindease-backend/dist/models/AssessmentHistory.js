"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const assessmentSchema = new mongoose_1.default.Schema({
    id: String,
    date: Date,
    score: String,
    scoreLevel: String,
    analysis: String,
    recommendations: [String]
});
const assessmentHistorySchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    assessments: [assessmentSchema]
});
const AssessmentHistory = mongoose_1.default.model('AssessmentHistory', assessmentHistorySchema);
exports.default = AssessmentHistory;
