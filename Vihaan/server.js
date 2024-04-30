const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();
const port = 2000224;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/signupDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define user schema
const userSchema = new mongoose.Schema({
  userID: String,
  password: String,
});
const User = mongoose.model('User', userSchema);

// Session middleware
app.use(cookieParser());
app.use(session({
  secret: 'your-secret-key', // Change this to a secret key for session encryption
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }, // Set to true if using HTTPS
}));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
  const { userID, password } = req.body;
  
  try {
    // Find user by userID
    const user = await User.findOne({ userID });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Set session cookie with user ID
    req.session.userID = user.userID;

    // Successful login
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/profile', async (req, res) => {
  try {
    // Retrieve user from database based on session
    const userID = req.session.userID;
    const user = await User.findOne({ userID });
    if (!user) {
      return res.status(401).send('Unauthorized');
    }
    res.render('profile', { user });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.put('/updatePassword', async (req, res) => {
  const { newPassword } = req.body;
  
  try {
    // Update user's password in the database
    const userID = req.session.userID;
    await User.updateOne({ userID }, { password: newPassword });

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.delete('/deleteAccount', async (req, res) => {
  try {
    // Delete user's account from the database
    const userID = req.session.userID;
    await User.deleteOne({ userID });

    // Destroy session
    req.session.destroy();

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Logout route
app.get('/logout', (req, res) => {
    try {
      // Calculate total session time in seconds
      const sessionTimeInSeconds = Math.floor((new Date() - req.session.cookie._expires) / 1000);
  
      // Check if sessionTimeInSeconds is not NaN (could happen if user didn't have a session)
      const sessionTimeMessage = isNaN(sessionTimeInSeconds) ? "You weren't logged in" : `Total session time: ${sessionTimeInSeconds} seconds`;
  
      // Destroy session
      req.session.destroy();
  
      res.send(sessionTimeMessage);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  app.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!");
  });
  
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
