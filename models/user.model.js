const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    userID: String,
    watchlist: [String]
});

const User = mongoose.model('User', userSchema);

module.exports = User;