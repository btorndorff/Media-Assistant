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
client.on('message', async message => {
   //messages to ignore
   if (!message.content.startsWith(prefix) || message.author.bot) return;

   //splits message into command and arguments
   const args = message.content.slice(prefix.length).split(' ');
   const command = args.shift().toLowerCase(); 

   //help command
   if (command === 'help') {
      message.channel.send("help");
      //help();
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

 client.login(token);