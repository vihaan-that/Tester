const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const ejs = require('ejs');
const jwt = require('jsonwebtoken');

const User = require('./models/user');
const AuthController = require('./controllers/authController');
const UserController = require('./controllers/userController');

const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const port = process.env.PORT || 2070;

mongoose.connect('mongodb://0.0.0.0:27017/EndLab', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('signup');
});

app.get('/signin', (req, res) => {
    res.render('signin');
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.post('/sign_up', AuthController.signup);
app.post('/sign_in', AuthController.signin);
app.get('/logout', AuthController.logout);

// Routes for CRUD operations
app.post('/user', UserController.createUser);
app.get('/user/:id', UserController.getUserById);
app.put('/user/:id', UserController.updateUser);
app.delete('/user/:id', UserController.deleteUser);

app.get('/allsubmitions', AuthController.verifyToken, UserController.getAllSubmissions);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
