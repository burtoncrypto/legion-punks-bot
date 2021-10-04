const cheerio = require('cheerio');
const capitalize = require('capitalize');

const solanartClient = require('./solanart');
const howrareClient = require('./howrare');
const { buildSolanartMessage, buildHowRareMessage } = require('./discord');

const TITLE_FLOOR = 'Floor Punk!';
const TITLE_LAST_LISTED = 'Last Listed!';
const TITLE_LAST_SOLD = 'Last Sold!';
const TITLE_HOW_RARE = 'How Rare?';

const floor = async () => buildSolanartMessage(await solanartClient.floor(), { title: TITLE_FLOOR });
const lastListed = async () => buildSolanartMessage(await solanartClient.lastListed(), { title: TITLE_LAST_LISTED });
const lastSold = async () => buildSolanartMessage(await solanartClient.lastSold(), { title: TITLE_LAST_SOLD });

const howrare = async options => {
  const $ = cheerio.load(await howrareClient.get(options.id));

  const data = {
    link_img: $('.listing-item .col-md-5 img').attr('src'),
    attributes: [{
      name: 'Name',
      value: $('.listing-item .col-md-5 h3').text(),
    }],
  }

  $('.listing-item ul.attributes li').each((i, el) => {
    const e = $(el);
    const name = e.find('span').text();
    const valueParsed = e.find('div').text().match(/([^(]+)(.*)$/);

    let value = capitalize(`${valueParsed[1].trim()} ${valueParsed[2]}`.trim());

    console.log(name);
    if (name === 'Price:') {
      value = value.replace('buy', '').trim();
    }

    data.attributes.push({ name, value, inline: true });
  });

  return buildHowRareMessage(data, { title: TITLE_HOW_RARE });
};

module.exports = {
  floor,
  lastListed,
  lastSold,
  howrare,
};