const { buildSolanartMessage } = require('../discord');

async function buildSender(discord, channelIds) {
  const channelListings = await discord.getChannel(channelIds.listings);
  const channelSales = await discord.getChannel(channelIds.sales);

  return {
    listing: item => channelListings.send(buildSolanartMessage(item, { title: 'New Listing' })),
    sale: item => channelSales.send(buildSolanartMessage(item, { title: 'New Sale' })),
  };
}

module.exports = {
  buildSender,
};
