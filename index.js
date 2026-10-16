
const {
  Client,
  GatewayIntentBits,
  Events,
  REST,
  Routes,
  SlashCommandBuilder
} = require('discord.js');

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;

if (!token || !clientId) {
  throw new Error('Missing DISCORD_TOKEN or CLIENT_ID');
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const commands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('اختبر استجابة البوت')
    .toJSON()
];

client.once(Events.ClientReady, async (readyClient) => {
  console.log(`Bot online: ${readyClient.user.tag}`);

  try {
    const rest = new REST({ version: '10' }).setToken(token);

    await rest.put(
      Routes.applicationCommands(clientId),
      { body: commands }
    );

    console.log('Slash commands registered');
  } catch (error) {
    console.error('Command registration failed:', error);
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong! 🟢 البوت شغال');
  }
});

client.login(token);
