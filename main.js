const fs = require('fs');
const Discord = require('discord.js');
const config = require('./config.json');
const Hypixel = require('hypixel');

const client = new Discord.Client();
const hypixelApi = new Hypixel({ key: config.HYPIXEL_API_KEY });

const prefix = '/';

client.on('message', function (message) {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(' ');
  const command = args.shift().toLowerCase();

  if (command === 'ping') {
    const timeTaken = Date.now() - message.createdTimestamp;
    message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
  } else if (command === 'sum') {
    const numArgs = args.map((x) => parseFloat(x));
    const sum = numArgs.reduce((counter, x) => (counter += x));
    message.reply(`The sum of all the arguments you provided is ${sum}!`);
  } else if (command === 'level') {
    hypixelApi.getPlayerByUsername(args[0], (err, player) => {
      if (err) return;
      const base = 10000;
      const growth = 2500;
      const reversePqPrefix = -(base - 0.5 * growth) / growth;
      const reverseConst = reversePqPrefix ** 2;

      if (player === null) return null;

      const exp = player.networkExp;

      const level = exp < 0 ? 1 : Math.floor(1 + reversePqPrefix + Math.sqrt(reverseConst + (2 / growth) * exp));

      message.reply(`The Level of ${args[0]} is ${level}!`);
    });
  } else if (command === 'stats') {
    hypixelApi.getPlayerByUsername(args[0], (err, player) => {
      switch (args[1]) {
        case 'bedwars':
          switch (args[2]) {
            case 'level':
              message.reply(`${args[0]} is BedWars-Level: ${player.achievements.bedwars_level}!`);
              break;
            case 'wins':
              message.reply(`${args[0]} has ${player.achievements.bedwars_wins} wins in BedWars!`);
              break;
            case 'kills':
              message.reply(`${args[0]} has ${player.achievements.bedwars_wins} kills in BedWars!`);
              break;
            case 'final-kills':
              message.reply(`${args[0]} has ${player.stats.final_kills_bedwars} Final-Kills in BedWars!`);
              break;
          }
          break;
      }
    });
  }
});

client.login(config.BOT_TOKEN);
