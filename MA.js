//import dependencies 
const Discord = require('discord.js');
const client = new Discord.Client();
const {
   prefix,
   token,
} = require('./config.json');

//notify terminal of bot logging in
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

//reads chat messages
client.on('message', (message) => {
   //messages to ignore
   if (!message.content.startsWith(prefix) || message.author.bot) return;

   //splits message into command and arguments
   const args = message.content.slice(prefix.length).split(' ');
   const command = args.shift().toLowerCase(); 

   //help command
   if (command === 'help') {
      help(message);
   }

   //watchlist command
   if (command === 'watchlist') {
      if (args[0] != null) {
         if (args[0] == "-add") {
            //addWatchlist();
         } else if (args[0] == "-remove") {
            //removeWatchlist();
         } else {
            message.channel.send("Invalid Command");
         }
      }
      //listWatchlist();
   }

   //watching command
   if (command === 'watching') {
      if (args[0] != null) { 
         if (args[0] == "-add") {
            //addWatching();
         } else if (args[0] == "-remove") {
            //removeWatching();
         } else if (args[0] == "-update") {
            //updateWatching();
         } else {
            message.channel.send("Invalid Command")
         }
      }
      //listWatching();
   } 
});

//help function to display commands
function help(message) {
   message.channel.send('Commands \n!help : displays the directions for commands \n\n!watchlist : lists the users watchlist\n-add \"title" : adds title to users watchlist\n-remove "title" : removes title from users watchlist\n\n!watching : lists what the users is currently watching along with links to the media\n-add "title" : adds the title to the watching\n-remove "title" : removes the title from the watchlist\n-update : checks for any updates in what the user is watching');
};

 client.login(token);