const mongoose = require('mongoose');

const surveySchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now
  },
  district: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    enum: ['Female', 'Male', 'Transgender'],
    required: true
  },
  ageGroup: {
    type: String,
    enum: ['0-14', '15-29', '30-44', '45-59', '60+'],
    required: true
  },
  educationStatus: {
    type: String,
    enum: ['No education', 'Middle', 'Secondary', 'Hr. Secondary', 'Diploma', 'Graduate', 'Post Graduate and above'],
    required: true
  },
  professionalProfile: {
    type: String,
    enum: ['Student', 'Unemployed', 'Service (Private)', 'Service (PSU)', 'Service (Government)', 'Self-employed', 'Housewife', 'Retired'],
    required: true
  },
  causes: {
    type: [String],
    required: true
  },
  numberOfSuicideCases: {
    type: Number,
    required: true
  }
});

const Survey = mongoose.model('Survey', surveySchema);

module.exports = Survey;
