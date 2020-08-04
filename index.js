require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const malScraper = require('mal-scraper')
const mongoose = require("mongoose");
client.mongoose = require('./mongoose');
const User = require("./models/user.model.js");
const {
    watch
} = require('./models/user.model.js');
const prefix = process.env.PREFIX;
const token = process.env.DISCORD_TOKEN;


client.on('ready', () => {
    client.user.setActivity('>help')
    console.log(`Logged in as ${client.user.tag}!`);
});

//setup array for watchlist 
var watchlist = [];

client.on('message', (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();

    if (command === 'help') {
        help(message);
    }

    if (command === 'wl') {
        User.findOne({
            userID: message.author.id
        }, (err, user) => {
            if (err) console.log(err);

            if (!user) {
                watchlist = [];
            } else {
                watchlist = user.watchlist;
            }
        });

        if (args[0] != null) {
            if (args[0] === "add") {
                addWatchlist(message, args);
            } else if (args[0] === "remove") {
                removeWatchlist(message, args);
            } else if (args[0] === "clear") {
                watchlist = [];
                User.findOne({
                    userID: message.author.id
                }, (err, user) => {
                    if (err) console.log(err);
                    if (user) {
                        user.watchlist = [];
                        user.save().catch(err => console.log(err));
                        message.channel.send("Cleared!");
                    }
                });
            } else {
                message.channel.send("Invalid Command");
            }
        } else {
            listArr(message);
        }
    }
});

//help function to display commands
function help(message) {
    message.channel.send('Commands \n>help : displays the directions for commands \n\n>wl : lists the users watchlist \n>wl add <title> : adds title to users watchlist\n>wl remove <title> : removes title from users watchlist');
};

//adds specified title to users watchlist
function addWatchlist(message, args) {
    if (args[1] != null) {
        //get the title 
        let title = "";
        for (let i = 1; i < args.length; i++) {
            title += args[i] + " ";
        }
        //adds title to watchlist
        addTitle(message, title, watchlist);

    } else {
        message.channel.send("No title specified");
    }
}

//helper method for both watching and watchlist to check if title is in list and then add it
async function addTitle(message, title, arr) {
    let update = await User.findOne({
        userID: message.author.id
    }, (err, user) => {
        if (err) {
            console.log(err);
        }

        if (!user) {
            const animeInfo = malScraper.getResultsFromSearch(title)
                .then((data) => {
                    let anime = data[0].name;
                    arr = [];
                    arr.push(anime);
                    const newUser = {
                        userID: message.author.id,
                        watchlist: arr
                    }
                    User.create(newUser, function (err, small) {
                        if (err) return handleError(err);
                        // saved!
                    });
                    message.channel.send(anime + " added!");
                });
        } else {
            const animeInfo = malScraper.getResultsFromSearch(title)
                .then((data) => {
                    let anime = data[0].name;
                    if (user.watchlist.indexOf(anime) === -1) {
                        arr.push(anime);
                        user.watchlist = arr;
                        user.save().catch(err => console.log(err));
                        message.channel.send(anime + " added!");
                    } else {
                        message.channel.send("That title is already in your watchlist");

                    }
                });
        }
    });
}

//removes specified title from users watchlist
function removeWatchlist(message, args, key) {
    if (args[1] != null) {
        //get the title 
        let title = "";
        for (let i = 1; i < args.length; i++) {
            title += args[i] + " ";
        }
        //removes title from arr
        removeTitle(message, title, watchlist);
    } else {
        message.channel.send("No title specified");
    }
}

//helper function for watching and watchlist to delete title
async function removeTitle(message, title, arr) {
    let update = await User.findOne({
        userID: message.author.id
    }, (err, user) => {
        if (err) {
            console.log(err);
        }

        if (user) {
            const animeInfo = malScraper.getResultsFromSearch(title)
                .then((data) => {
                    let anime = data[0].name;
                    if (user.watchlist.indexOf(anime) === -1) {
                        message.channel.send("That title is not in your watchlist");
                    } else {
                        arr.splice(arr.indexOf(anime), 1);
                        user.watchlist = arr;
                        user.save().catch(err => console.log(err));
                        message.channel.send(anime + " removed!");
                    }
                });
        }
    });
}

//prints the watchlist
async function listArr(message) {
    let print = message.author.tag + " watchlist" + ": \n";
    message.channel.send(print);

    User.findOne({
        userID: message.author.id
    }, (err, user) => {
        if (err) console.log(err);

        if (user) {
            watchlist = user.watchlist;
            console.log(watchlist);
            for (let i = 0; i < watchlist.length; i++) {
                malScraper.getResultsFromSearch(watchlist[i])
                    .then((data) => {
                        const exampleEmbed = new Discord.MessageEmbed()
                            .setColor('#0099ff')
                            .setTitle(data[0].name)
                            .setURL(data[0].url)
                            .setThumbnail(data[0].thumbnail_url)
                        message.channel.send(exampleEmbed);
                    })
                    .catch((err) => console.log(err));
            }
        }
    });
}

client.mongoose.init();
client.login(process.env.DISCORD_TOKEN);