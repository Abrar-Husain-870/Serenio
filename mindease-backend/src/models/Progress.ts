import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
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

const Progress = mongoose.model('Progress', progressSchema);

export default Progress; 