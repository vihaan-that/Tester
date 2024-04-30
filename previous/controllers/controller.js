const Survey = require('../models/swiggy');

exports.renderSurveyForm = (req, res) => {
  res.render('index');
};

exports.submitSurvey = async (req, res) => {
  const surveyData = req.body;
  try {
    await Survey.create(surveyData);
    res.redirect('/results');
  } catch (err) {
    console.error(err);
    res.send('Error submitting survey');
  }
};

exports.getSurveyResults = async (req, res) => {
  try {
    const surveyResults = await Survey.find();
    res.render('result', { surveyResults });
  } catch (err) {
    console.error(err);
    res.send('Error fetching survey results');
  }
};
