//import dependencies 
require('dotenv').config(); 
const Discord = require('discord.js');
const client = new Discord.Client();
const malScraper = require('mal-scraper')
const prefix = process.env.PREFIX;
const token = process.env.DISCORD_TOKEN;


//database
const Enmap = require("enmap");
client.media = new Enmap({
   name: "media"
});

//setup array for watchlist 
var watchlist = [];

//notify terminal of bot logging in
client.on('ready', () => {
   client.user.setActivity('>help')
   console.log(`Logged in as ${client.user.tag}!`);
});

//reads chat messages
client.on('message', (message) => {
   //messages to ignore
   if (!message.content.startsWith(prefix) || message.author.bot) return;
   console.log(message.content);

   //splits message into command and arguments
   const args = message.content.slice(prefix.length).split(' ');
   const command = args.shift().toLowerCase();

   const key = `${message.author.id}`;
   client.media.ensure(key, {
      user: message.author.id,
      watchlist: []
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
      } else {
         listArr(message, watchlist, "Watchlist");
      }
   }

});

//help function to display commands
function help(message) {
   message.channel.send('Commands \n>help : displays the directions for commands \n\n>wl : lists the users watchlist \n>wl add <title> : adds title to users watchlist\n>wl remove <title> : removes title from users watchlist');
};

//adds specified title to users watchlist
function addWatchlist(message, args, key) {
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

//helper method for both watching and watchlist to check if title is in list and then add it
async function addTitle(message, title, arr) {
   if (arr.indexOf(title.trim()) === -1) {
      const animeInfo = await malScraper.getResultsFromSearch(title)
         .then((data) => {
            let anime = data[0].name;
            arr.push(anime);
            client.media.set(message.author.id, watchlist, "watchlist");
         });
      listArr(message, arr, "WatchList");
   } else {
      message.channel.send(title + " is already in your watchlist");
   }
}

//helper function for watching and watchlist to delete title
async function removeTitle(message, title, arr) {
   const animeInfo = await malScraper.getResultsFromSearch(title)
      .then((data) => {
         let removeAnime = data[0].name;
         if (arr.indexOf(removeAnime) != -1) {
            arr.splice(arr.indexOf(removeAnime), 1);
         }
         client.media.set(message.author.id, watchlist, "watchlist");
      });

   listArr(message, arr, "WatchList");
}

//prints the watchlist
async function listArr(message, arr, arrName) {
   let print = message.author.tag + " " + arrName + ": \n";
   message.channel.send(print);
   for (let i = 0; i < arr.length; i++) {
      malScraper.getResultsFromSearch(arr[i])
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

client.login(process.env.DISCORD_TOKEN);