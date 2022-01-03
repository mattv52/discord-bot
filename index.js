// Requiring libraries
const fs = require('fs');
const Discord = require('discord.js');

// sets up config
const { prefix, token } = require('./config.json');

// create a new Discord client and commands
const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

// when the client is ready, run this code this event will only trigger one time after logging in
client.once('ready', () => {
	console.log('Ready!');
});


// listening for messages
client.on('message', message => {
  // Leaving loop if message doesnt start with a prefix or was sent by a bot
	if (!message.content.startsWith(prefix) || message.author.bot) return;

  // Collecting the args from the command and getting the commands name
	const args = message.content.slice(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();

  // If the command doesnt exist, stop.
  const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
  
  if (!command) return;
  
  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`;
    
    if (command.usage) {
    	reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
    }
    
    return message.channel.send(reply);  
  }

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('there was an error trying to execute that command!');
  }
});

var getUserFromMention = function(mention) {
  if (!mention) return;

  if (mention.startsWith('<@') && mention.endsWith('>')) {
    mention = mention.slice(2, -1);

    if (mention.startsWith('!')) {
      mention = mention.slice(1);
    }

    return client.users.cache.get(mention);
  }
}

global = {
  getUserFromMention: function(mention){
    return getUserFromMention(mention);
  }
};

// login to Discord with your app's token
client.login(token);