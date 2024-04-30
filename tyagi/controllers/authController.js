const User = require('../models/user');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    const { name, password, email } = req.body;

    try {
        // Create a new User document
        const newUser = new User({ name, password });
        await newUser.save();
        console.log("User records inserted successfully");
        res.redirect('/signin');
    } catch (error) {
        console.error('Error:', error.message);
        if (error.name === 'ValidationError') {
            res.status(400).json({ error: error.message });
        } else if (error.code === 11000) {
            res.status(400).json({ error: 'Email must be unique' });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

exports.signin = async (req, res) => {
    const { name, password } = req.body;

    try {
        const user = await User.findOne({ name });

        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ name: user.name, role: user.role }, 'my_secret_code');

        res.cookie('jwt', token, { httpOnly: true });
        console.log("User signed in successfully");
        res.redirect('/allsubmitions');

    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.logout = async (req, res) => {
    try {
        res.clearCookie('jwt');
        res.redirect('/signin');
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.verifyToken = (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    jwt.verify(token, 'my_secret_code', (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        req.user = decoded;
        next();
    });
};
