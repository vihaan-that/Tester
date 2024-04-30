const User = require('../models/user');
const Item = require('../models/item');
const jwt = require('jsonwebtoken');


exports.addbook = async (req, res) => {  
    const { bookName , authorName } = req.body;

    
    const newItem = new Item ({ bookname : bookName , authorname : authorName});
    await newItem.save();


    res.redirect('/crudOperations');
}

