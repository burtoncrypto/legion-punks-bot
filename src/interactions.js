const solanart = require('./solanart');
const { buildMessage } = require('./discord');

const TITLE_FLOOR = 'Floor Punk!';
const TITLE_LAST_LISTED = 'Last Listed!';
const TITLE_LAST_SOLD = 'Last Sold!';

const floor = async () => buildMessage(await solanart.floor(), { title: TITLE_FLOOR });
const lastListed = async () => buildMessage(await solanart.lastListed(), { title: TITLE_LAST_LISTED });
const lastSold = async () => buildMessage(await solanart.lastSold(), { title: TITLE_LAST_SOLD });

module.exports = {
    floor,
    lastListed,
    lastSold,
};