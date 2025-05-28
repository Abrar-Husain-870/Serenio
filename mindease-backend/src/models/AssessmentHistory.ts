import mongoose from 'mongoose';

const assessmentSchema = new mongoose.Schema({
  id: String,
  date: Date,
  score: String,
  scoreLevel: String,
  analysis: String,
  recommendations: [String]
});

const assessmentHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  assessments: [assessmentSchema]
});

const AssessmentHistory = mongoose.model('AssessmentHistory', assessmentHistorySchema);

export default AssessmentHistory; 