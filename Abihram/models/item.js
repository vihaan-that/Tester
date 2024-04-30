const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    bookname : {
        type : String,
        required: true
    },
    authorname : {
        type : String,
        required : true
    }
})

const Item = mongoose.model('Item' , itemSchema);

module.exports = Item;