const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const ejs = require('ejs');
const jwt = require('jsonwebtoken');

const User = require('./models/user');
const Item = require('./models/item')

const AuthController = require('./controllers/authController');
const UserController = require('./controllers/userController');
const ItemController = require('./controllers/itemContoller')

const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const cookieParser = require('cookie-parser');
app.use(cookieParser());



mongoose.connect('mongodb://localhost:27017/EndLab', {
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

app.get('/crudOperations',async (req , res) =>{

    const token = req.cookies.userjwt;

    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const decodedToken = jwt.verify(token, 'my_secret_code');
    const loginDuration = Date.now() - decodedToken.loginTime;


    const item = await Item.find();
    res.render('crudOperations', {item , time: loginDuration});
});

app.get('/todo',async (req, res) => {
    const token = req.cookies.userjwt;

    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const decodedToken = jwt.verify(token, 'my_secret_code');
    const nameEx = decodedToken.name;

    const user = await User.findOne({ name : nameEx });
    res.render('todo', { username : user.name , todolist : user.todolist});
});


app.post('/sign_up', AuthController.signup);
app.post('/sign_in', AuthController.signin);
app.post('/addtask', UserController.addtask);
app.post('/removetask', UserController.removetask);
app.post('/add_book' , ItemController.addbook);


app.post('/update_book/:id', async (req, res) => {
    const { newBookName, newAuthorName } = req.body;
    await Item.updateOne({ _id: req.params.id }, { bookname: newBookName, authorname: newAuthorName });
    res.redirect('/crudOperations');
});

app.post('/patch_book/:id', async (req, res) => {
    const { newBookName, newAuthorName } = req.body;
    const updateObj = {};
    if (newBookName) updateObj.bookname = newBookName;
    if (newAuthorName) updateObj.authorname = newAuthorName;
    await Item.updateOne({ _id: req.params.id }, updateObj);
    res.redirect('/crudOperations');
});

app.post('/delete_book/:id', async (req, res) => {
    await Item.deleteOne({ _id: req.params.id });
    res.redirect('/crudOperations');
});




app.get('/logout', AuthController.logout);

//hello
app.get('/allsubmitions', async (req, res) => {
    const users = await User.find();
    res.render('allsubmitions', { users });
});


const port = process.env.PORT || 2069;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});



