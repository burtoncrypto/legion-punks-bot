const logger = require('pino')();

const { getNewListings, getNewSales } = require('./solanart');
const buildDiscordClient = require('./discord').buildClient;
const buildTwitterClient = require('./twitter').buildClient;

const { buildSender } = require('./senders/sender');
const logSenderFactory = require('./senders/logSender');
const discordSenderFactory = require('./senders/discordSender');
const twitterSenderFactory = require('./senders/twitterSender');
const interactions = require('./interactions');

const {
  DISCORD_BOT_TOKEN,
  DISCORD_CHANNEL_ID_LISTINGS,
  DISCORD_CHANNEL_ID_SALES,
  DISCORD_GUILD_ID,
  TWITTER_API_KEY,
  TWITTER_API_SECRET,
  TWITTER_ACCESS_TOKEN,
  TWITTER_ACCESS_SECRET,
} = process.env;

const TICK_TIME = 10;

async function tick(sender, logger) {
  logger.info('tick');

  const [listings, sales] = await Promise.all([
    getNewListings(logger),
    getNewSales(logger),
  ]);

  await Promise.all([
    ...listings.map(item => sender.listing(item)),
    ...sales.map(item => sender.sale(item)),
  ]);
}

async function tickWithErrorHandler(sender, logger) {
  try {
    await tick(sender, logger);
  } catch (e) {
    logger.error(e);
  } finally {
    setTimeout(() => tickWithErrorHandler(sender, logger), TICK_TIME * 1000);
  }
}

async function main() {
  const discord = await buildDiscordClient({
    token: DISCORD_BOT_TOKEN,
    guild: DISCORD_GUILD_ID
  }, logger);

  discord.registerInteraction({ name: 'floor', description: 'Get the floor Legion Punk' }, interactions.floor);
  discord.registerInteraction({ name: 'last_listed', description: 'Get the last listed Legion Punk' }, interactions.lastListed);
  discord.registerInteraction({ name: 'last_sold', description: 'Get the last sold Legion Punk' }, interactions.lastSold);

  if (false) {
    discord.registerInteraction({
      name: 'howrare',
      description: 'Get the howrare rank of the Legion Punk',
      options: [{ type: 4, name: 'id', description: 'Punk Number', required: true }],
    }, interactions.howrare)
  }

  const twitter = buildTwitterClient({
    apiKey: TWITTER_API_KEY,
    apiSecret: TWITTER_API_SECRET,
    accessToken: TWITTER_ACCESS_TOKEN,
    accessSecret: TWITTER_ACCESS_SECRET,
  }, logger);

  const sender = await buildSender();
  sender.addSender('log', await logSenderFactory.buildSender(logger));
  sender.addSender('discord', await discordSenderFactory.buildSender(discord, {
    sales: DISCORD_CHANNEL_ID_SALES,
    listings: DISCORD_CHANNEL_ID_LISTINGS,
  }));
  sender.addSender('twitter', await twitterSenderFactory.buildSender(twitter));

  tickWithErrorHandler(sender, logger);
}

module.exports = {
    main,
};