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

async function tick(sender) {
  await Promise.all((await getNewListings()).map(item => sender.listing(item)));
  await Promise.all((await getNewSales()).map(item => sender.sale(item)));
}

async function tickWithErrorHandler(sender) {
  try {
    await tick(sender);
  } catch (e) {
    logger.error(e);
  } finally {
    setTimeout(() => tickWithErrorHandler(sender), TICK_TIME * 1000);
  }
}

async function main() {
  const discord = await buildDiscordClient({
    token: DISCORD_BOT_TOKEN,
    guild: DISCORD_GUILD_ID
  }, logger);

  discord.registerInteraction('floor', 'Get the floor Legion Punk', interactions.floor);
  discord.registerInteraction('last_listed', 'Get the last listed Legion Punk', interactions.lastListed);
  discord.registerInteraction('last_sold', 'Get the last sold Legion Punk', interactions.lastSold);

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

  tickWithErrorHandler(sender);
}

module.exports = {
    main,
};