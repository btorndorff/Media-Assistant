//import dependencies 
const Discord = require('discord.js');
const client = new Discord.Client();
var Anime = require('anime-scraper').Anime;
const malScraper = require('mal-scraper')
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
   client.user.setActivity('>help')
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
      listArr(message, watchlist, "WatchList");
   }

   //watching command
   if (command === 'w') {
      watching = client.media.get(key, "watching");
      if (args[0] != null) { 
         if (args[0] == "add") {
            addWatching(message, args, key);
         } else if (args[0] == "remove") {
            removeWatching(message, args, key);
         } else if (args[0] == "clear") {
            watching = [];
            message.channel.send("Cleared!");
            client.media.set(key, watching, "watching")
         } else if (args[0] == "update") {
            //updateWatching();
         } else {
            message.channel.send("Invalid Command");
         }
      }
      listArg(message, watching, "Watching");
   }
});

//help function to display commands
function help(message) {
   message.channel.send('Commands \n>help : displays the directions for commands \n\n>wl : lists the users watchlist (the animes you want to watch)\n >wl add <title> : adds title to users watchlist\n>wl remove <title> : removes title from users watchlist (copy the title from discord)\n\n>w : lists what the users is currently watching along with links to the most current episode\n>w add <title> : adds the title to the watching list\n>w remove <title> : removes the title from the watching\n>w update : checks for any updates in what the user is watching');
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
async function addTitle(message, title, arr) {
   if(arr.indexOf(title.trim()) === -1) {
      /*const info = await malScraper.getInfoFromName(title)
         .then((resolve) => {
            let anime ={
               title: resolve.title,
               url: resolve.url
            }
            arr.push(anime);
            //message.channel.send("a" + anime.title);
         })
         .catch((fail) => {
            message.channel.send(title + "was not found");
         });
         message.channel.send("aaa");*/
         arr.push(title);
   } else {
      message.channel.send(title + " is already in your watchlist");
   }
}


//helper function for watching and watchlist to delete title
function removeTitle(message, title, arr) {
   if(arr.indexOf(title.trim()) != -1) {
      arr.splice(arr.indexOf(title),1);
   }
}

//prints the watchlist
function listArr(message, arr, arrName) {
   let print = message.author.tag + " " + arrName + ": \n";
   message.channel.send(print);
   for (let i = 0; i < arr.length; i++) {
      malScraper.getInfoFromName(arr[i])
      .then((data) =>{
         arr[i] = data.title.toLowerCase().trim();
         message.channel.send(data.title + " - " + data.url);
         client.media.set(message.author.id, watchlist, "watchlist");
      })
      //message.channel.send(arr[i].title + "-" + arr[i].url);
   }
}

//prints the watching
function listArg(message, arr, arrName) {
   let print = message.author.tag + " " + arrName + ": \n";
   message.channel.send(print);
   for (let i = 0; i < arr.length; i++) {
      malScraper.getInfoFromName(arr[i])
      .then((data) =>{
         arr[i] = data.title.toLowerCase().trim();
         message.channel.send(data.title);
         client.media.set(message.author.id, watching, "watching");
      })
      Anime.fromName(arr[i]).then(function (anime) {
         anime.episodes[anime.episodes.length - 1].fetch().then(function (episode) {
            message.channel.send("Latest Episode: " + episode.url)
         })
       })
   }
}

client.login(token);