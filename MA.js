//import dependencies 
const Discord = require('discord.js');
const malScraper = require('mal-scraper');
var Anime = require('anime-scraper').Anime;
const client = new Discord.Client();
const {
   prefix,
   token,
} = require('./config.json');

//database
const Enmap = require("enmap");
client.media = new Enmap({name: "media"});

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

   const key = `${message.author.id}`;
   client.media.ensure(key, {
     user: message.author.id,
     watchlist: [],
     watching: []
   });

   //help command
   if (command === 'help') {
      help(message);
   }

   //watchlist command
   if (command === 'wl') {
      watchlist = client.media.get(key, "watchlist");
      if (args[0] != null) {
         if (args[0] === "add") {
            addWatchlist(message, args, key);
         } else if (args[0] === "remove") {
            removeWatchlist(message, args, key);
         } else if (args[0] === "clear") {
            watchlist = [];
            message.channel.send("Cleared!");
            client.media.set(key, watchlist, "watchlist")
         } else {
            message.channel.send("Invalid Command");
         }
      }
      listArg(message, watchlist, "WatchList");
   }

   //watching command
   if (command === 'w') {
      watching = client.media.get(key, "watching");
      if (args[0] != null) { 
         if (args[0] == "add") {
            addWatching(message, args, key);
         } else if (args[0] == "remove") {
            removeWatching(message, args, key);
         } else if (args[0] == "update") {
            //updateWatching();
         } else {
            message.channel.send("Invalid Command")
         }
      }
      listArr(message, watching, "Watching");
   }
});

//help function to display commands
function help(message) {
   message.channel.send('Commands \n!help : displays the directions for commands \n\n!watchlist : lists the users watchlist\n-add \"title" : adds title to users watchlist\n-remove "title" : removes title from users watchlist\n\n!watching : lists what the users is currently watching along with links to the media\n-add "title" : adds the title to the watching\n-remove "title" : removes the title from the watchlist\n-update : checks for any updates in what the user is watching');
};

//adds specified title to users watchlist
function addWatchlist(message, args, key) {

   if (args[1] != null) {
      //get the title 
      let title = "";
      for (let i = 1; i < args.length ; i++) {
         title += args[i] + " ";
      }
      //adds title to watchlist
      addTitle(message, title.toLowerCase(), watchlist);
      client.media.set(key, watchlist, "watchlist");
   } else {
      message.channel.send("No title specified");
   }
}

function addWatching(message, args, key) {
   if (args[1] != null) {
      //get the title 
      let title = "";
      for (let i = 1; i < args.length ; i++) {
         title += args[i] + " ";
      }
      //adds title to watchlist
      addTitle(message, title.toLowerCase(), watching);
      removeTitle(message, title.toLowerCase(), watchlist)
      client.media.set(key, watching, "watching");
   } else {
      message.channel.send("No title specified");
   }
}

//removes specified title from users watchlist
function removeWatchlist(message, args, key) {
   if (args[1] != null) {
      //get the title 
      let title = "";
      for (let i = 1; i < args.length ; i++) {
         title += args[i] + " ";
      }
      //removes title from arr
      removeTitle(message, title.toLowerCase(), watchlist);
      client.media.set(key, watchlist, "watchlist");
   } else {
      message.channel.send("No title specified");
   }
}

function removeWatching(message, args, key) {
   if (args[1] != null) {
      //get the title 
      let title = "";
      for (let i = 1; i < args.length ; i++) {
         title += args[i] + " ";
      }
      //removes title from arr
      removeTitle(message, title.toLowerCase(), watching);
      client.media.set(key, watching, "watching");
   } else {
      message.channel.send("No title specified");
   }
}

//helper method for both watching and watchlist to check if title is in list and then add it
function addTitle(message, title, arr) {
   if(arr.indexOf(title) === -1) {
      arr.push(title)
   } else {
      message.channel.send(title + " is already in your watchlist");
   }
}

//helper function for watching and watchlist to delete title
function removeTitle(message, title, arr) {
   if(arr.indexOf(title) != -1) {
      arr.splice(arr.indexOf(title),1);
   }
}

//prints the watchlist
function listArg(message, arr, arrName) {
   let print = message.author.tag + " " + arrName + ": \n";
   message.channel.send(print);
   for (let i = 0; i < arr.length; i++) {
      malScraper.getInfoFromName(arr[i])
      .then((data) =>{
         message.channel.send(data.title + " - " + data.url);
      }
      )
   }
}
//prints the watching
function listArr(message, arr, arrName) {
   let print = message.author.tag + " " + arrName + ": \n";
   message.channel.send(print);
   for (let i = 0; i < arr.length; i++) {
      Anime.fromName(arr[i]).then(function (anime) {
         anime.episodes[anime.episodes.length - 1].fetch().then(function (episode) {
            console.log(episode)
           message.channel.send("Latest Episode: " + episode.url)
         })
       })
   }
}

client.login(token);