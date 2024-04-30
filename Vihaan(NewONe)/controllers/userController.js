const User = require('../models/user');
const jwt = require('jsonwebtoken');


exports.addtask = async (req, res) => {  
    const { task } = req.body;
    console.log(task);
    const token = req.cookies.userjwt;

    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const decodedToken = jwt.verify(token, 'my_secret_code');
    const nameEx = decodedToken.name;

    const user = await User.findOne({ name : nameEx });
    user.todolist.push(task);
    await user.save();
    res.redirect('/todo');
}

exports.removetask = async (req, res) => {
    try {
        const { task } = req.body;

        const token = req.cookies.userjwt;
        if (!token) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const decodedToken = jwt.verify(token, 'my_secret_code');
        const username = decodedToken.name;

        const user = await User.findOne({ name: username });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const index = user.todolist.indexOf(task);

        if (index === -1) {
            return res.status(404).json({ success: false, message: 'Task not found in user\'s todolist' });
        }

        user.todolist.splice(index, 1);

        await user.save();

        res.redirect('/todo');
    } catch (error) {
        console.error('Error removing task:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};