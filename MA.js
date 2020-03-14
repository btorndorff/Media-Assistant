//import dependencies 
const Discord = require('discord.js');
const client = new Discord.Client();
const {
   prefix,
   token,
} = require('./config.json');

//setup array for watchlist and watching (need to convert to somethings so it becomes permanent)
var watchlist = [];
var watching = [];

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
   if (command === 'wl') {
      if (args[0] != null) {
         if (args[0] == "add") {
            addWatchlist(message, args);
         } else if (args[0] == "remove") {
            removeWatchlist(message, args);
         } else {
            message.channel.send("Invalid Command");
         }
      }
      listArr(message, watchlist);
   }

   //watching command
   if (command === 'w') {
      if (args[0] != null) { 
         if (args[0] == "add") {
            //addWatching();
         } else if (args[0] == "remove") {
            //removeWatching();
         } else if (args[0] == "update") {
            //updateWatching();
         } else {
            message.channel.send("Invalid Command")
         }
      }
      //listArr(message, watching);
   } 
});

//help function to display commands
function help(message) {
   message.channel.send('Commands \n!help : displays the directions for commands \n\n!watchlist : lists the users watchlist\n-add \"title" : adds title to users watchlist\n-remove "title" : removes title from users watchlist\n\n!watching : lists what the users is currently watching along with links to the media\n-add "title" : adds the title to the watching\n-remove "title" : removes the title from the watchlist\n-update : checks for any updates in what the user is watching');
};

//adds specified title to users watchlist
function addWatchlist(message, args) {
   if (args[1] != null) {
      //get the title 
      let title = "";
      for (let i = 1; i < args.length ; i++) {
         title += args[i] + " ";
      }
      //adds title to watchlist
      addTitle(message, title.toLowerCase(), watchlist);
   } else {
      message.channel.send("No title specified");
   }
}

//removes specified title from users watchlist
function removeWatchlist(message, args) {
   if (args[1] != null) {
      //get the title 
      let title = "";
      for (let i = 1; i < args.length ; i++) {
         title += args[i] + " ";
      }
      //removes title from arr
      removeTitle(message, title.toLowerCase(), watchlist);
   } else {
      message.channel.send("No title specified");
   }
}

//helper method for both watching and watchlist to check if title is in list and then add it
function addTitle(message, title, arr) {
   if(arr.indexOf(title) === -1) {
      arr.push(title)
      message.channel.send("Added " + title);
   } else {
      message.channel.send(title + " was not found in your watchlist");
   }
}

//helper function for watching and watchlist to delete title
function removeTitle(message, title, arr) {
   if(arr.indexOf(title) != -1) {
      arr.splice(arr.indexOf(title),1);
      message.channel.send("Removed " + title);
   } else {
      message.channel.send(title + " was not found in your watchlist");
   }
}

//prints the watchlist
function listArr(message, arr) {
   let print = message.author.tag + " Watchlist: \n";
   for (let i = 0; i < arr.length; i++) {
      print += "- " + arr[i] + "\n";
   }
   message.channel.send(print);
}
 client.login(token);