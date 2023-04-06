// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, IntentsBitField } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, 
	GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages,
	GatewayIntentBits.MessageContent] });
client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

const thanksList = ["thanks", "thank you",  "thank you very much",  
"many thanks",  "thanks!",  "appreciate it", 
"i appreciate it",  "tq",  "thanx",  "thx", "tx", "prece", "preace"];

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on('messageCreate', (msg) =>
{
	if (msg.author.bot)
		return;
	// checking a bunch of thanks messages to show venom thank you 
	console.log(msg.content + " by " + msg.author.username)
	if (thanksList.some(check => msg.content.toLowerCase().includes(check)))
	{
		msg.reply('https://tenor.com/view/venom-welcome-copy-mask-copy-youre-welcome-gif-27080978')
	}
	if (msg.content.toLowerCase().includes('amirite') && msg.mentions.users)
	{
		const rightMessage = ['isHeRite', 'isheRight'];
		const index = Math.floor(Math.random() * 2);
		msg.reply(`${rightMessage[index]} ${msg.mentions.users.first()}`)
	}
})

client.on(Events.InteractionCreate, async interaction => 
	{
		console.log(interaction);
		if (!interaction.isChatInputCommand())
			return;
		const command = interaction.client.commands.get(interaction.commandName);
		

		try {
			await command.execute(interaction);
			const channelID = '1068617453988495393';
			const channel = client.channels.cache.get(channelID);
			channel.send('Test');
		} catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
			} else {
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		}
	})

// Log in to Discord with your client's token
client.login(token);

