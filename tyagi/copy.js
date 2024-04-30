// app.js : 
// const express = require('express');
// const mongoose = require('mongoose');
// const path = require('path');
// const ejs = require('ejs');
// const jwt = require('jsonwebtoken');

// const User = require('./models/user');
// const AuthController = require('./controllers/authController');
// const UserController = require('./controllers/userController');

// const bodyParser = require('body-parser');

// const app = express();

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// const cookieParser = require('cookie-parser');
// app.use(cookieParser());

// const port = process.env.PORT || 2070;


// mongoose.connect('mongodb://0.0.0.0:27017/EndLab', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
// .then(() => {
//     console.log('Connected to MongoDB');
// })
// .catch((error) => {
//     console.error('Error connecting to MongoDB:', error);
// });


// app.set('view engine', 'ejs');

// app.get('/', (req, res) => {
//     res.render('signup');
// });

// app.get('/signin', (req, res) => {
//     res.render('signin');
// });

// app.get('/signup', (req, res) => {
//     res.render('signup');
// });


// app.post('/sign_up', AuthController.signup);
// app.post('/sign_in', AuthController.signin);
// app.get('/logout', AuthController.logout);


// app.get('/allsubmitions', async (req, res) => {
//     const users = await User.find();
//     res.render('allsubmitions', { users });
// });



// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });



// signup.ejs :
// <!DOCTYPE html>
// <html>

// <head>
//     <title>User Form</title>
// </head>

// <body>
//     <h1>Sign Up</h1>
//     <form action="/sign_up" method="POST">
//         <label for="name">Name:</label>
//         <input type="text" id="name" name="name" required><br><br>
        
//         <label for="password">Password:</label>
//         <input type="password" id="password" name="password" required><br><br>

//         <input type="submit" value="Submit">
//     </form>

//     <a href="/signin">Sign In</a>
// </body>

// </html>

// signin.ejs :
// <!DOCTYPE html>
// <html>
// <head>
//     <title>User Form</title>
// </head>
// <body>
//     <h1>Sign In</h1>
//     <form action="/sign_in" method="POST">
//         <label for="name">Name:</label>
//         <input type="text" id="name" name="name" required><br><br>
        
//         <label for="password">Password:</label>
//         <input type="password" id="password" name="password" required><br><br>
        
//         <input type="submit" value="Submit">
//     </form>

//     <a href="/signup">Sign Up</a>
// </body>
// </html>

// allsubmitions.ejs :
// <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>All Submissions</title>
//     <style>
//         /* Add some basic styling */
//         body {
//             font-family: Arial, sans-serif;
//             margin: 0;
//             padding: 20px;
//         }
//         h1 {
//             color: #333;
//         }
//         p {
//             margin-bottom: 10px;
//         }
//     </style>
// </head>
// <body>
//     <h1>All Submissions</h1>
//     <% for (let i = 0; i < users.length; i++) { %>
//         <div>
//             <h2>User <%= i + 1 %></h2>
//             <p>Name: <%= users[i].name %></p>
//             <p>Email: <%= users[i].email %></p>
//             <p>Password: <%= users[i].password %></p>
//         </div>
//     <% } %>

// </body>
// </html>
// authCotroller.js : 
// const User = require('../models/user');
// const bcrypt = require("bcrypt");
// const jwt = require('jsonwebtoken');


// exports.signup = async (req, res) => {
//     const { name, password, email } = req.body;

//     try {
//         // Create a new User document
//         const newUser = new User({ name, password });
//         await newUser.save();


//         console.log("User records inserted successfully");
//         res.redirect('/signin');
//     } catch (error) {
//         console.error('Error:', error.message);
//         if (error.name === 'ValidationError') {
//             res.status(400).json({ error: error.message });
//         } else if (error.code === 11000) {
//             res.status(400).json({ error: 'Email must be unique' });
//         } else {
//             res.status(500).json({ error: 'Internal server error' });
//         }
  
//     }
// };


// exports.signin = async (req, res) => {
//     const { name, password } = req.body;

//     try {
//         const user = await User.findOne({ name });

//         if (!user) {
//             return res.status(401).json({ error: 'Invalid username or password' });
//         }

//         const isPasswordValid = await bcrypt.compare(password, user.password);

//         if (!isPasswordValid) {
//             return res.status(401).json({ error: 'Invalid username or password' });
//         }

//         // Generate JWT token
//         const token = jwt.sign({ name: user.name, role : user.role }, 'my_secret_code');



//         // Check if the user is an moderator
//         if (user.role === 'moderator') {

//             res.cookie('superjwt', token, { httpOnly: true });
//             // Send an alert for moderator
//             return res.send(`
//         <script>
//           window.location.href = '/moderator_panel?moderator=true';
//           alert("Welcome, moderator!");
//         </script>
//       `);
//         }
//         // Check if the user is a superuser
//         else if (user.role === 'superuser') {

//             res.cookie('superjwt', token, { httpOnly: true });
//             // Send an alert for superuser
//             return res.send(`
//         <script>
//           window.location.href = '/superuser_panel?superuser=true';
//           alert("Welcome, superuser!");
//         </script>
//       `);
//         }


//         else {
//             console.log("User signed in successfully");
//             res.cookie('userjwt', token, { httpOnly: true }); // Set JWT token in a cookie named 'userjwt'
//             res.redirect('/allsubmitions');
//         }

//     } catch (error) {
//         console.error('Error:', error.message);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };


// exports.logout = async (req, res) => {
//     try {
//         res.clearCookie('userjwt');
//         res.redirect('/signin');
//     } catch (error) {
//         console.error('Error:', error.message);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

// user.js : 
// const mongoose = require('mongoose');
// const { todo } = require('node:test');
// const bcrypt = require('bcrypt');

// const userSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true
//     },
   
//     password: {
//         type: String,
//         required: true
//     },
// });


// userSchema.pre('save', async function (next) {
//     const user = this;
//     if (!user.isModified('password')) return next();
//     try {
//         const hashedPassword = await bcrypt.hash(user.password, 10);
//         user.password = hashedPassword;
//         next();
//     } catch (error) {
//         return next(error);
//     }
// });

// const User = mongoose.model('User', userSchema);

// module.exports = User;

// after login in all submitions page.. i want you to implement all the curd operations on his data..and also in the same page there should be 
// time ..which is time upto which the user is logged in 