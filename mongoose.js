const mongoose = require('mongoose');
const Discord = require('discord.js');
require('dotenv').config();


module.exports = {
    init: () => {
        const uri = process.env.ATLAS_URI;
        mongoose.connect(uri, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true
        });
        const connection = mongoose.connection;
        connection.once('open', () => {
            console.log("MongoDB database connection established successfully");
        });
    }
};