
const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
  Events
} = require('discord.js');

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;

if (!token || !clientId) {
  console.error('Missing DISCORD_TOKEN or CLIENT_ID');
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const commands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('اختبار البوت')
    .toJSON(),

  new SlashCommandBuilder()
    .setName('server')
    .setDescription('عرض معلومات السيرفر')
    .toJSON()
];

client.once(Events.ClientReady, async () => {
  console.log(`Online: ${client.user.tag}`);

  const rest = new REST({ version: '10' }).setToken(token);

  try {
    await rest.put(
      Routes.applicationCommands(clientId),
      { body: commands }
    );
    console.log('Commands registered');
  } catch (error) {
    console.error(error);
  }
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong! 🟢 البوت شغال');
  }

  if (interaction.commandName === 'server') {
    await interaction.reply(
      `اسم السيرفر: ${interaction.guild.name}\nعدد الأعضاء: ${interaction.guild.memberCount}`
    );
  }
});

client.login(token);
